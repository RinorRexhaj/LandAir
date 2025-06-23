import { RefObject, useState } from "react";
import { useProjectStore } from "../store/useProjectsStore";
import useApi from "./useApi";
import useToast from "./useToast";

interface ElementChange {
  element: HTMLElement;
  originalHTML: string;
  newHTML: string;
  type: "edit" | "delete";
}

const useChange = () => {
  const { post, put } = useApi();
  const toast = useToast();
  const { selectedProject, setSelectedProject } = useProjectStore();
  const [changes, setChanges] = useState<ElementChange[]>([]);

  // Track changes when content is edited
  const handleContentEdit = (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    const isVoid = ["img", "input", "br", "hr", "meta", "link"].includes(
      tagName
    );

    const originalHTML =
      element.getAttribute("data-original-html") ||
      (isVoid ? element.outerHTML : element.innerHTML);

    const newHTML = isVoid ? element.outerHTML : element.innerHTML;

    if (originalHTML !== newHTML) {
      const existingChangeIndex = changes.findIndex(
        (change) => change.element === element
      );

      const updatedChanges = [...changes];

      if (existingChangeIndex >= 0) {
        updatedChanges[existingChangeIndex] = {
          ...updatedChanges[existingChangeIndex],
          newHTML,
        };
      } else {
        updatedChanges.push({ element, originalHTML, newHTML, type: "edit" });
      }

      setChanges(updatedChanges);
    }
  };

  const handleUndoChange = () => {
    if (changes.length === 0) return;

    const lastChange = changes[changes.length - 1];
    const remainingChanges = changes.slice(0, -1);

    if (lastChange.type === "edit") {
      const tagName = lastChange.element.tagName.toLowerCase();
      const isVoid = ["img", "input", "br", "hr", "meta", "link"].includes(
        tagName
      );

      if (isVoid) {
        // For void elements, replace outerHTML
        const wrapper = document.createElement("div");
        wrapper.innerHTML = lastChange.originalHTML;
        const restored = wrapper.firstElementChild;
        if (restored && lastChange.element.parentNode) {
          lastChange.element.parentNode.replaceChild(
            restored,
            lastChange.element
          );
        }
      } else {
        // For text elements, revert innerHTML
        lastChange.element.innerHTML = lastChange.originalHTML;
      }
    } else if (lastChange.type === "delete") {
      // Re-insert the deleted element
      lastChange.element.style.display = "block";
    }

    setChanges(remainingChanges);
    return remainingChanges.length === 0;
  };

  // Save changes
  const handleSaveChanges = async (
    selectedElement: HTMLElement | null,
    iframeRef: RefObject<HTMLIFrameElement | null>
  ): Promise<boolean> => {
    if (!selectedProject) return false;

    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return false;

    const toastId = toast.loading("Saving...");

    // Clean up styles
    iframeDoc.querySelectorAll("*").forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.backgroundColor = "";
        el.style.outline = "";
        if (el.contentEditable === "true") el.contentEditable = "false";
        el.removeAttribute("data-original-html");
      }
    });

    if (selectedElement) {
      selectedElement.style.backgroundColor = "";
      selectedElement.style.outline = "";
    }

    // --- IMAGE UPLOAD LOGIC START ---
    // Find all <img> tags with data URLs
    const imgElements = Array.from(iframeDoc.querySelectorAll("img"));
    for (const img of imgElements) {
      const src = img.getAttribute("src");
      if (src && src.startsWith("data:image/")) {
        // Convert data URL to File
        const matches = src.match(/^data:(image\/[^;]+);base64,(.+)$/);
        if (!matches) continue;
        const mimeType = matches[1];
        const b64Data = matches[2];
        const byteCharacters = atob(b64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        // Use a unique filename for each image
        const ext = mimeType.split("/")[1] || "png";
        const imageName = `${
          selectedProject.project_name
        }/images/${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
        const file = new File([byteArray], imageName, { type: mimeType });
        // Upload image
        let uploadedUrl = "";
        try {
          const formData = new FormData();
          formData.append("content", file);
          formData.append("filePath", imageName);
          formData.append("type", "image");

          const response = await post<{ success: boolean; url: string }>(
            "/api/storage/",
            formData
          );

          uploadedUrl =
            response?.url ||
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pages/${imageName}`;
        } catch (err) {
          console.error("Image upload failed", err);
          continue;
        }
        // Replace src with uploaded URL
        img.setAttribute("src", uploadedUrl);
        img.removeAttribute("data-original-html");
      }
    }
    // --- IMAGE UPLOAD LOGIC END ---

    const updatedHTML = iframeDoc.documentElement.outerHTML || "";
    const filePath = `${selectedProject.project_name}`;

    try {
      const formData = new FormData();
      formData.append("content", updatedHTML);
      formData.append("filePath", filePath);
      formData.append("type", "html");
      await post(`/api/storage/`, formData);
      await put(`/api/projects/${selectedProject.id}`, {
        new_name: selectedProject.project_name,
      });

      setSelectedProject({
        ...selectedProject,
        file: updatedHTML,
        last_edited: new Date(),
      });

      setChanges([]);
      toast.update(toastId, "success", "Changes saved!");
      return true;
    } catch (err) {
      console.error("Save failed:", err);
      toast.update(toastId, "error", "Save failed...");
      return false;
    }
  };

  // Discard changes
  const handleDiscardChanges = (
    iframeRef: RefObject<HTMLIFrameElement | null>
  ) => {
    if (!iframeRef.current || !selectedProject?.file) return;

    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(injectLinkFixScript(selectedProject.file));
    iframeDoc.close();

    setChanges([]);
    toast.info("Changes discarded.");
  };

  const handleContentDelete = (selectedElement: HTMLElement) => {
    const originalHTML = selectedElement?.outerHTML || "";

    setChanges([
      ...changes,
      {
        element: selectedElement,
        originalHTML,
        newHTML: "",
        type: "delete",
      },
    ]);

    selectedElement.style.display = "none";
  };

  function injectLinkFixScript(html: string): string {
    const linkFixScript = `
    <script>
    (function () {
      'use strict';

      const originalWindowOpen = window.open;
      window.open = function (url, target, features) {
        if (typeof url === 'string' && url.startsWith('#')) {
          const el = document.querySelector(url);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          return null;
        }
        return originalWindowOpen.call(window, url, target, features);
      };

      document.addEventListener('click', function (event) {
        const anchor = event.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || ['#', '', 'javascript:void(0)'].includes(href)) return;
        if(href === '#') return;

        event.preventDefault();

        if (href.startsWith('#')) {
          const el = document.querySelector(href);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.open(href, '_blank');
        }
      });
    })();
    </script>
  `;

    if (html.includes("</body>")) {
      return html.replace("</body>", `${linkFixScript}</body>`);
    } else {
      return html + linkFixScript;
    }
  }

  return {
    handleContentEdit,
    handleUndoChange,
    handleDiscardChanges,
    handleSaveChanges,
    handleContentDelete,
    injectLinkFixScript,
  };
};

export default useChange;
