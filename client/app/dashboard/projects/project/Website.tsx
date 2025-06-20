import useChange from "@/app/hooks/useChange";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
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
  setSelector: (sel: boolean) => void;
  mobile: number;
  scale: number;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const Website: React.FC<WebsiteProps> = ({
  selector,
  setSelector,
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
  const [elementType, setElementType] = useState<
    "text" | "image" | "layout" | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const {
    handleContentDelete,
    handleContentEdit,
    handleDiscardChanges,
    handleSaveChanges,
    injectLinkFixScript,
  } = useChange();
  const { selectedProject } = useProjectStore();
  const { darkMode } = useThemeStore();

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
        if (!isEditing) {
          target.style.backgroundColor = "";
          target.style.outline = "";
          target.contentEditable = "false";
          setSelectedElement(null);
          return;
        }
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
  }, [
    selector,
    selectedProject,
    selectedElement,
    setSelectedElement,
    scale,
    isEditing,
  ]);

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
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";

                    input.onchange = (e: Event) => {
                      const target = e.target as HTMLInputElement;
                      const file = target.files?.[0];
                      if (!file) return;

                      if (file.size > 1024 * 1024) {
                        alert("Image must be less than 1MB");
                        return;
                      }

                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = reader.result as string;

                        // Store original HTML if not already stored
                        if (
                          !selectedElement.getAttribute("data-original-html")
                        ) {
                          selectedElement.setAttribute(
                            "data-original-html",
                            selectedElement.outerHTML
                          );
                        }

                        selectedElement.setAttribute("src", dataUrl);

                        // Call the change tracking function
                        handleContentEdit(selectedElement);
                        setHasUnsavedChanges(true);
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
                      selectedElement.addEventListener("input", () => {
                        handleContentEdit(selectedElement);
                        setHasUnsavedChanges(true);
                      });
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
                <p className={`md:hidden font-medium`}>
                  {isEditing ? "Save" : "Edit"}
                </p>
              </button>
              <span className="w-px h-4 bg-zinc-400"></span>
            </>
          )}

          <button
            onClick={() => {
              handleContentDelete(selectedElement);
              setSelectedElement(null);
              setHasUnsavedChanges(true);
            }}
            className="text-gray-700 hover:text-red-600 flex items-center gap-1 font-semibold"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
            <p className="md:hidden">Delete</p>
          </button>
        </div>
      )}
      {hasUnsavedChanges && (
        <div
          className={`fixed top-28 left-[465px] tb:left-80 md:top-[104px] md:left-[274px] flex p-2 md:px-1 rounded-lg items-center gap-1 md:gap-0 md:z-40 border transition-all animate-fade duration-200 ${
            darkMode
              ? "bg-zinc-800/20 md:bg-zinc-900 border-gray-200/20"
              : "bg-zinc-100/80 md:bg-zinc-100 border-gray-300/50"
          }`}
          style={
            {
              // left: "465px",
            }
          }
        >
          {/* <button
            onClick={handleUndoChange}
            title="Undo"
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 focus:outline-none hover:opacity-100"
          >
            <FontAwesomeIcon icon={faUndo} className="w-4 h-4" />
          </button> */}
          <button
            onClick={async () => {
              if (selectedElement) {
                const saved = await handleSaveChanges(
                  selectedElement,
                  iframeRef
                );
                if (saved) {
                  setHasUnsavedChanges(false);
                }
              }
            }}
            title="Save"
            className="flex items-center gap-1 px-2 py-1.5 md:px-1 rounded-md text-sm opacity-80 font-medium transition-all duration-200 focus:outline-none hover:opacity-100"
          >
            <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              handleDiscardChanges(iframeRef);
              setHasUnsavedChanges(false);
              setSelector(false);
              setSelectedElement(null);
              setIsEditing(false);
            }}
            title="Discard"
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 focus:outline-none hover:opacity-100"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default Website;
