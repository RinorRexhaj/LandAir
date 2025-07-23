import { RefObject } from "react";
import { useProjectStore } from "../store/useProjectsStore";
import { useChangesStore } from "../store/useChangesStore";
import useApi from "./useApi";
import useToast from "./useToast";
import { takeScreenshot } from "../utils/Screenshot";

const useChange = () => {
  const { post, put } = useApi();
  const toast = useToast();
  const { selectedProject, setSelectedProject } = useProjectStore();
  const {
    changes,
    addChange,
    updateChange,
    removeLastChange,
    clearChanges,
    getChangesCount,
  } = useChangesStore();

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

      if (existingChangeIndex >= 0) {
        updateChange(element, newHTML);
      } else {
        addChange({ element, originalHTML, newHTML, type: "edit" });
      }
    }
  };

  const handleUndoChange = () => {
    const lastChange = removeLastChange();
    if (!lastChange) return false;

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
      lastChange.element.style.display = "";
    } else if (lastChange.type === "clone") {
      // Remove the cloned element
      if (lastChange.element.parentElement) {
        lastChange.element.parentElement.removeChild(lastChange.element);
      }
    }

    return getChangesCount() === 0;
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
      const elem = el as HTMLElement;
      elem.style.backgroundColor = "";
      elem.style.outline = "";
      if (elem.contentEditable === "true") elem.contentEditable = "false";
      elem.removeAttribute("data-original-html");
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
          selectedProject.id
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
    const filePath = `${selectedProject.id}`;

    try {
      const formData = new FormData();
      formData.append("content", updatedHTML);
      formData.append("filePath", filePath);
      formData.append("type", "html");
      await post(`/api/storage/`, formData);
      await put(`/api/projects/${selectedProject.id}`, {
        new_name: selectedProject.project_name,
      });

      if (iframeRef.current) {
        const screenshot = await takeScreenshot(iframeRef.current);
        if (screenshot) {
          const screenshotData = new FormData();
          screenshotData.append("content", screenshot);
          screenshotData.append(
            "filePath",
            `${selectedProject.id}/screenshot.png`
          );
          screenshotData.append("type", "image");
          await post(`/api/storage/`, screenshotData);
        }
      }

      setSelectedProject({
        ...selectedProject,
        file: updatedHTML,
        last_edited: new Date(),
      });

      clearChanges();
      removeDisableInteractionStyle(iframeDoc);
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
    iframeDoc.write(selectedProject.file);
    iframeDoc.close();

    clearChanges();
    removeDisableInteractionStyle(iframeDoc);
    toast.info("Changes discarded.");
  };

  const handleContentDelete = (selectedElement: HTMLElement) => {
    const originalHTML = selectedElement?.outerHTML || "";

    addChange({
      element: selectedElement,
      originalHTML,
      newHTML: "",
      type: "delete",
    });

    selectedElement.style.display = "none";
  };

  const handleCloneElement = (element: HTMLElement) => {
    if (!element || !element.parentElement) return;

    const clone = element.cloneNode(true) as HTMLElement;

    // Insert the clone right after the original
    element.parentElement.insertBefore(clone, element.nextSibling);

    // Mark clone's current HTML as original for future edits
    const tagName = clone.tagName.toLowerCase();
    const isVoid = ["img", "input", "br", "hr", "meta", "link"].includes(
      tagName
    );
    const originalHTML = isVoid ? clone.outerHTML : clone.innerHTML;
    clone.setAttribute("data-original-html", originalHTML);

    // Track this as a "clone" change
    addChange({
      element: clone,
      originalHTML: "",
      newHTML: originalHTML,
      type: "clone",
    });
  };

  const removeDisableInteractionStyle = (iframeDoc: Document) => {
    iframeDoc.getElementById("disable-interaction-style")?.remove();
    iframeDoc.querySelectorAll("*").forEach((el) => {
      if (!["SCRIPT", "HEAD", "META"].includes(el.tagName)) {
        const htmlEl = el as HTMLElement;
        htmlEl.style.cursor = "";
        const originalHref = htmlEl.getAttribute("data-original-href");
        if (originalHref) {
          htmlEl.setAttribute("href", originalHref);
        }
        htmlEl.removeAttribute("data-original-href");
        htmlEl.onclick = (e) => {
          e.preventDefault();
        };
      }
    });
  };

  return {
    handleContentEdit,
    handleUndoChange,
    handleDiscardChanges,
    handleSaveChanges,
    handleContentDelete,
    handleCloneElement,
    removeDisableInteractionStyle,
  };
};

export default useChange;
