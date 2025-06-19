import useApi from "@/app/hooks/useApi";
import { useProjectStore } from "@/app/store/useProjectsStore";
import {
  faPenToSquare,
  faTrash,
  faSave,
  faXmark,
  faCheck,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

interface WebsiteProps {
  selector: boolean;
  mobile: number;
  scale: number;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

interface ElementChange {
  element: HTMLElement;
  originalHTML: string;
  newHTML: string;
  type: "edit" | "delete";
}

const Website: React.FC<WebsiteProps> = ({
  selector,
  mobile,
  scale,
  selectedElement,
  setSelectedElement,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [toolBarPos, setToolBarPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [changes, setChanges] = useState<ElementChange[]>([]);
  const [elementType, setElementType] = useState<
    "text" | "image" | "layout" | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { selectedProject, setSelectedProject } = useProjectStore();
  const { post, put } = useApi();

  // Track changes when content is edited
  const handleContentEdit = (element: HTMLElement) => {
    const originalHTML =
      element.getAttribute("data-original-html") || element.innerHTML;
    const newHTML = element.innerHTML;

    if (originalHTML !== newHTML) {
      const existingChangeIndex = changes.findIndex(
        (change) => change.element === element
      );

      if (existingChangeIndex >= 0) {
        const updatedChanges = [...changes];
        updatedChanges[existingChangeIndex] = {
          ...updatedChanges[existingChangeIndex],
          newHTML,
        };
        setChanges(updatedChanges);
      } else {
        setChanges([
          ...changes,
          { element, originalHTML, newHTML, type: "edit" },
        ]);
      }

      setHasUnsavedChanges(true);
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    if (!selectedProject) return;

    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

    // 🧼 CLEANUP: Remove editor background/outline from all elements
    iframeDoc.querySelectorAll("*").forEach((el) => {
      if (el instanceof HTMLElement) {
        if (
          el.style.backgroundColor === "rgba(29, 45, 255, 0.25)" ||
          el.style.backgroundColor === "rgba(29, 45, 255, 0.5)"
        ) {
          el.style.backgroundColor = "";
        }
        if (
          el.style.outline === "3px dotted #1d2dff" ||
          el.style.outline === "1px dashed #1d2dff"
        ) {
          el.style.outline = "";
        }

        // Optional: disable contentEditable and remove any data-original-html attributes
        if (el.contentEditable === "true") {
          el.contentEditable = "false";
        }
        el.removeAttribute("data-original-html");
      }
    });

    if (selectedElement) {
      selectedElement.style.backgroundColor = "";
      selectedElement.style.background = "";
      selectedElement.style.outline = "";
    }

    // Update the project file with new changes
    const updatedHTML = iframeDoc.documentElement.outerHTML || "";
    const filePath = `${selectedProject.project_name}`;

    await post(`/api/storage/`, { content: updatedHTML, filePath });
    await put(`/api/projects/${selectedProject.id}`, {
      new_name: selectedProject.project_name,
    });
    setSelectedProject({
      ...selectedProject,
      id: selectedProject.id,
      last_edited: new Date(),
    });
    setChanges([]);
    setHasUnsavedChanges(false);
  };

  // Discard changes
  const handleDiscardChanges = () => {
    if (!iframeRef.current || !selectedProject?.file) return;

    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(injectLinkFixScript(selectedProject.file));
    iframeDoc.close();

    setChanges([]);
    setHasUnsavedChanges(false);
    setSelectedElement(null);
    setIsEditing(false);
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !selectedProject?.file) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframeDoc.body) return;

    if (!selector) {
      removeDisableInteractionStyle(iframeDoc);

      iframeDoc.querySelectorAll("*").forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.backgroundColor = "";
          el.style.background = "";
          el.style.outline = "";
        }
      });

      if (selectedElement) {
        selectedElement.style.backgroundColor = "";
        selectedElement.style.background = "";
        selectedElement.style.outline = "";
      }

      setSelectedElement(null);
      setElementType(null);
      return;
    } else {
      injectDisableInteractionStyle(iframeDoc);
    }

    let lastHoveredElement: HTMLElement | null = null;
    let lastHoveredOriginalBg = "";
    let lastHoveredOriginalOutline = "";

    const HOVER_COLOR = "rgba(29, 45, 255, 0.5)";
    const SELECT_COLOR = "rgba(29, 45, 255, 0.25)";
    const SELECT_OUTLINE = "3px dotted #1d2dff";

    const handleMouseMove = (e: MouseEvent) => {
      const target = iframeDoc.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;

      if (!target || target === lastHoveredElement) return;

      // Restore styles of last hovered element
      if (lastHoveredElement && lastHoveredElement !== selectedElement) {
        lastHoveredElement.style.backgroundColor = lastHoveredOriginalBg;
        lastHoveredElement.style.outline = lastHoveredOriginalOutline;
      }

      lastHoveredOriginalBg = target.style.backgroundColor || "";
      lastHoveredOriginalOutline = target.style.outline || "";
      lastHoveredElement = target;

      // Apply hover styles
      if (target !== selectedElement) {
        target.style.backgroundColor = HOVER_COLOR;
        target.style.outline = "1px dashed #1d2dff";
      }
    };

    const handleMouseLeave = () => {
      if (lastHoveredElement && lastHoveredElement !== selectedElement) {
        lastHoveredElement.style.backgroundColor = lastHoveredOriginalBg;
        lastHoveredElement.style.outline = lastHoveredOriginalOutline;
        lastHoveredElement = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = iframeDoc.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;
      if (!target) return;

      if (isImageElement(target)) {
        setElementType("image");
      } else if (isTextOnly(target)) {
        setElementType("text");
      } else if (isLayoutElement(target)) {
        setElementType("layout");
      } else {
        setElementType("layout");
      }

      updateToolbarPos(target);

      // Deselect if clicking the same element
      if (selectedElement === target) {
        target.style.backgroundColor = "";
        target.style.outline = "";
        target.contentEditable = "false";
        setSelectedElement(null);
        return;
      }

      // Clear previous selection
      if (selectedElement) {
        selectedElement.style.backgroundColor = "";
        selectedElement.style.outline = "";
      }

      // Apply selection styles
      target.style.backgroundColor = SELECT_COLOR;
      target.style.outline = SELECT_OUTLINE;
      setSelectedElement(target);
    };

    const updateToolbarPos = (target: HTMLElement | null) => {
      const element = target || selectedElement;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const top =
        rect.y * scale < 50 ? rect.bottom * scale : scale * rect.y - 30;
      setToolBarPos({ top, left: scale * rect.x });
    };

    iframeDoc.addEventListener("click", handleClick);
    iframeDoc.addEventListener("mousemove", handleMouseMove);
    iframeDoc.addEventListener("mouseleave", handleMouseLeave);
    iframeDoc.addEventListener("scroll", () =>
      updateToolbarPos(selectedElement)
    );
    iframe.contentWindow?.addEventListener("resize", () =>
      updateToolbarPos(selectedElement)
    );

    return () => {
      iframeDoc.removeEventListener("mousemove", handleMouseMove);
      iframeDoc.removeEventListener("mouseleave", handleMouseLeave);
      iframeDoc.removeEventListener("click", handleClick);
    };
  }, [selector, selectedProject, selectedElement, setSelectedElement, scale]);

  const injectDisableInteractionStyle = (iframeDoc: Document) => {
    const style = iframeDoc.getElementById("disable-interaction-style");
    if (style) return; // Prevent duplicates

    const styleTag = iframeDoc.createElement("style");
    styleTag.id = "disable-interaction-style";
    styleTag.innerHTML = `
    * {
      cursor: default !important;
      transition: none !important;
      animation: none !important;
    }
  `;
    iframeDoc.querySelectorAll("*").forEach((el) => {
      if (!["SCRIPT", "HEAD", "META"].includes(el.tagName)) {
        const htmlEl = el as HTMLElement;
        htmlEl.onmouseover = (e) => e.stopPropagation();
        htmlEl.onmouseenter = (e) => e.stopPropagation();
        htmlEl.onclick = (e) => {
          e.preventDefault();
        };
        htmlEl.onfocus = (e) => e.preventDefault();
        htmlEl.onmousedown = (e) => e.preventDefault();
        htmlEl.onmouseup = (e) => e.preventDefault();
      }
    });
    const overlay = iframeDoc.querySelector(".inset-0");
    if (overlay) overlay.classList.add("pointer-events-none");

    iframeDoc.head.appendChild(styleTag);
  };

  const removeDisableInteractionStyle = (iframeDoc: Document) => {
    iframeDoc.getElementById("disable-interaction-style")?.remove();
  };

  const isTextOnly = (el: HTMLElement): boolean => {
    return (
      el.childNodes.length === 1 &&
      el.childNodes[0].nodeType === Node.TEXT_NODE &&
      (el.textContent?.trim().length
        ? el.textContent?.trim().length > 0
        : false)
    );
  };

  const isImageElement = (el: HTMLElement): boolean => {
    const isImgTag = el.tagName === "IMG";

    const hasSingleImgChild =
      el.querySelectorAll("img").length === 1 && el.children.length === 1;

    const bg = window.getComputedStyle(el).backgroundImage;
    const hasBackgroundImage = Boolean(
      bg && bg !== "none" && bg.includes("url(")
    );

    return isImgTag || hasSingleImgChild || hasBackgroundImage;
  };

  const isLayoutElement = (el: HTMLElement): boolean => {
    const layoutTags = ["DIV", "SECTION", "MAIN", "HEADER", "FOOTER"];
    const hasNoText = !el.textContent?.trim();
    const hasChildren = el.children.length > 0;
    return layoutTags.includes(el.tagName) && hasNoText && hasChildren;
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

  if (!selectedProject) return;

  return (
    <>
      <iframe
        ref={iframeRef}
        key={selectedProject.file}
        srcDoc={injectLinkFixScript(selectedProject?.file || "")}
        className="rounded-lg shadow-md"
        style={{
          border: "none",
          width: mobile ? "430px" : "1440px",
          transform: `scale(${scale})`,
          height: mobile ? "calc(100vh - 100px)" : "100vh",
          transformOrigin: "top left",
          position: "fixed",
        }}
      />
      {selectedElement && selector && (
        <div
          className="absolute z-40 bg-white px-2 py-1 flex gap-2 items-center rounded text-xs shadow-lg border-2 border-zinc-200"
          style={{
            left: toolBarPos?.left,
            top: toolBarPos?.top,
          }}
        >
          {elementType !== "layout" && (
            <>
              <button
                onClick={() => {
                  if (elementType === "image") {
                    // Trigger hidden file input for images
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";

                    input.onchange = (e: Event) => {
                      const target = e.target as HTMLInputElement;
                      const file = target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = reader.result as string;
                        selectedElement.setAttribute("src", dataUrl);
                        // Optional: store original image src
                        selectedElement.setAttribute(
                          "data-original-src",
                          selectedElement.getAttribute("src") || ""
                        );
                      };
                      reader.readAsDataURL(file);
                    };

                    input.click();
                  } else {
                    // Text or mixed content editing
                    if (!isEditing) {
                      selectedElement.contentEditable = "true";
                      selectedElement.setAttribute(
                        "data-original-html",
                        selectedElement.innerHTML
                      );
                      selectedElement.addEventListener("input", () =>
                        handleContentEdit(selectedElement)
                      );
                      selectedElement.focus();
                    } else {
                      selectedElement.contentEditable = "false";
                      selectedElement.blur();
                    }
                    setIsEditing(!isEditing);
                  }
                }}
                className="text-gray-700 hover:text-blue-600 flex items-center gap-1"
                title="Edit"
              >
                <FontAwesomeIcon
                  icon={
                    isEditing
                      ? faCheck
                      : elementType === "image"
                      ? faImage
                      : faPenToSquare
                  }
                />
                <p className={`${mobile === 1 && "hidden"} font-medium`}>
                  {isEditing ? "Save" : "Edit"}
                </p>
              </button>
              <span className="w-px h-4 bg-zinc-400"></span>
            </>
          )}

          <button
            onClick={() => {
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

              selectedElement?.remove();
              setSelectedElement(null);
              setHasUnsavedChanges(true);
            }}
            className="text-gray-700 hover:text-red-600 flex items-center gap-1"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
            <p className="md:hidden">Delete</p>
          </button>
        </div>
      )}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 z-50 bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-zinc-200 flex gap-4 items-center">
          <span className="text-sm text-gray-700">Unsaved changes</span>
          <button
            onClick={handleSaveChanges}
            className="text-green-600 hover:text-green-700 flex items-center gap-1"
            title="Save Changes"
          >
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </button>
          <button
            onClick={handleDiscardChanges}
            className="text-red-600 hover:text-red-700 flex items-center gap-1"
            title="Discard Changes"
          >
            <FontAwesomeIcon icon={faXmark} />
            <span>Discard</span>
          </button>
        </div>
      )}
    </>
  );
};

export default Website;
