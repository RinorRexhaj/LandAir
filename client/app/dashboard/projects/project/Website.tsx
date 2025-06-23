import useChange from "@/app/hooks/useChange";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import {
  faPenToSquare,
  faTrash,
  faXmark,
  faCheck,
  faImage,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

interface WebsiteProps {
  selector: boolean;
  setSelector: (sel: boolean) => void;
  mobile: number;
  scale: number;
}

interface ElementPos {
  element: HTMLElement;
  height: number;
  width: number;
  left: number;
  top: number;
}

const Website: React.FC<WebsiteProps> = ({
  selector,
  setSelector,
  mobile,
  scale,
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
  const [hoveredElement, setHoveredElement] = useState<ElementPos | null>(null);
  const [selectedElement, setSelectedElement] = useState<ElementPos | null>(
    null
  );
  const {
    handleContentDelete,
    handleContentEdit,
    handleUndoChange,
    handleDiscardChanges,
    handleSaveChanges,
    injectLinkFixScript,
  } = useChange();
  const { selectedProject } = useProjectStore();
  const { darkMode } = useThemeStore();
  const [showTextEditModal, setShowTextEditModal] = useState(false);
  const [modalTextValue, setModalTextValue] = useState("");

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !selectedProject?.file) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframeDoc.body) return;

    if (!selector) {
      removeDisableInteractionStyle(iframeDoc);
      setSelectedElement(null);
      setElementType(null);
      return;
    } else {
      injectDisableInteractionStyle(iframeDoc);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = iframeDoc.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;

      if (!target) return;

      updateHoverPos(target);
    };

    const handleMouseLeave = () => {
      updateHoverPos(undefined);
    };

    const handleClick = async (e: MouseEvent) => {
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

      setIsEditing(false);
      updateToolbarPos(target);
      updateClickPos(target);

      // Deselect if clicking the same element
      if (selectedElement?.element === target) {
        if (!isEditing) {
          target.contentEditable = "false";
          setIsEditing(false);
          setSelectedElement(null);
          return;
        }
      }
    };

    const updateToolbarPos = (target: HTMLElement | null | undefined) => {
      const element = target || selectedElement?.element;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const top =
        rect.y * scale < 50 ? rect.bottom * scale : scale * rect.y - 30;
      setToolBarPos({ top, left: scale * rect.x });
    };

    const updateHoverPos = (target: HTMLElement | undefined) => {
      if (!target) {
        setHoveredElement(null);
        return;
      }
      if (!iframeRef.current) return;
      const rect = target.getBoundingClientRect();
      const iframeRect = iframeRef.current.getBoundingClientRect();

      // Calculate scaled position and size
      let left = iframeRect.left + rect.left * scale;
      let top = iframeRect.top + rect.top * scale;
      let width = rect.width * scale;
      let height = rect.height * scale;

      // Clamp to iframe bounds
      const maxLeft = iframeRect.left + iframeRect.width;
      const maxTop = iframeRect.top + iframeRect.height;

      if (left < iframeRect.left) {
        width -= iframeRect.left - left;
        left = iframeRect.left;
      }
      if (top < iframeRect.top) {
        height -= iframeRect.top - top;
        top = iframeRect.top;
      }
      if (left + width > maxLeft) {
        width = maxLeft - left;
      }
      if (top + height > maxTop) {
        height = maxTop - top;
      }

      // Only show if still visible
      if (width > 0 && height > 0) {
        setHoveredElement({
          element: target,
          height,
          width,
          left,
          top,
        });
      } else {
        setHoveredElement(null);
      }
    };

    const updateClickPos = (target: HTMLElement | undefined) => {
      if (!target) {
        setSelectedElement(null);
        return;
      }
      if (!iframeRef.current) return;
      const rect = target.getBoundingClientRect();
      const iframeRect = iframeRef.current.getBoundingClientRect();

      // Calculate scaled position and size
      let left = iframeRect.left + rect.left * scale;
      let top = iframeRect.top + rect.top * scale;
      let width = rect.width * scale;
      let height = rect.height * scale;

      // Clamp to iframe bounds
      const maxLeft = iframeRect.left + iframeRect.width;
      const maxTop = iframeRect.top + iframeRect.height;

      if (left < iframeRect.left) {
        width -= iframeRect.left - left;
        left = iframeRect.left;
      }
      if (top < iframeRect.top) {
        height -= iframeRect.top - top;
        top = iframeRect.top;
      }
      if (left + width > maxLeft) {
        width = maxLeft - left;
      }
      if (top + height > maxTop) {
        height = maxTop - top;
      }

      // Only show if still visible
      if (width > 0 && height > 0) {
        setSelectedElement({
          element: target,
          height,
          width,
          left,
          top,
        });
      } else {
        setSelectedElement(null);
      }
    };

    iframeDoc.addEventListener("click", handleClick);
    iframeDoc.addEventListener("mousemove", handleMouseMove);
    iframeDoc.addEventListener("mouseleave", handleMouseLeave);
    iframeDoc.addEventListener("scroll", () => {
      updateToolbarPos(selectedElement?.element);
      updateHoverPos(hoveredElement?.element);
      updateClickPos(selectedElement?.element);
    });
    iframe.contentWindow?.addEventListener("resize", () => {
      updateToolbarPos(selectedElement?.element);
      updateHoverPos(hoveredElement?.element);
      updateClickPos(selectedElement?.element);
    });

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
    hoveredElement?.element,
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
      {selector && hoveredElement && iframeRef.current && (
        <div
          className="bg-blue-500 opacity-50 pointer-events-none"
          style={{
            position: "fixed",
            height: hoveredElement.height,
            width: hoveredElement.width,
            left: hoveredElement.left,
            top: hoveredElement.top,
          }}
        ></div>
      )}
      {selector && selectedElement && iframeRef.current && (
        <div
          className="outline-dotted outline-3 outline-blue-500 opacity-50 pointer-events-none"
          style={{
            position: "fixed",
            height: selectedElement.height,
            width: selectedElement.width,
            left: selectedElement.left,
            top: selectedElement.top,
          }}
        ></div>
      )}
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
                          !selectedElement.element.getAttribute(
                            "data-original-html"
                          )
                        ) {
                          selectedElement.element.setAttribute(
                            "data-original-html",
                            selectedElement.element.outerHTML
                          );
                        }

                        selectedElement.element.setAttribute("src", dataUrl);

                        // Call the change tracking function
                        handleContentEdit(selectedElement.element);
                        setIsEditing(false);
                        setHasUnsavedChanges(true);
                      };

                      reader.readAsDataURL(file);
                    };

                    input.click();
                  } else if (elementType === "text") {
                    // Open modal for text editing
                    setModalTextValue(
                      selectedElement.element.textContent || ""
                    );
                    setShowTextEditModal(true);
                  } else {
                    // fallback to previous logic for mixed content
                    if (!isEditing) {
                      selectedElement.element.contentEditable = "true";
                      selectedElement.element.style.outline = "none";
                      selectedElement.element.setAttribute(
                        "data-original-html",
                        selectedElement.element.innerHTML
                      );
                      selectedElement.element.addEventListener("input", () => {
                        handleContentEdit(selectedElement.element);
                        setHasUnsavedChanges(true);
                      });
                      selectedElement.element.focus();
                    } else {
                      selectedElement.element.contentEditable = "false";
                      selectedElement.element.blur();
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
              setHasUnsavedChanges(true);
              handleContentDelete(selectedElement.element);
              setSelectedElement(null);
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
          className={`fixed top-28 left-[457px] tb:left-[315px] md:top-[104px] md:left-[274px] flex p-2 md:px-1 rounded-lg items-center gap-1 md:gap-0 md:z-40 border transition-all animate-fade duration-200 ${
            darkMode
              ? "bg-zinc-800/20 md:bg-zinc-900 border-gray-200/20"
              : "bg-zinc-100/80 md:bg-zinc-100 border-gray-300/50"
          }`}
        >
          <button
            onClick={() => {
              const noChanges = handleUndoChange();
              if (noChanges) setHasUnsavedChanges(false);
            }}
            title="Undo"
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 focus:outline-none hover:opacity-100"
          >
            <FontAwesomeIcon icon={faUndo} className="w-4 h-4" />
          </button>
          <button
            onClick={async () => {
              const saved = await handleSaveChanges(
                selectedElement?.element || null,
                iframeRef
              );
              if (saved) {
                setHasUnsavedChanges(false);
              }
            }}
            title="Save"
            className="flex items-center gap-1 px-2 py-1.5 md:px-1 rounded-md text-sm opacity-80 font-medium transition-all duration-200 focus:outline-none hover:opacity-100"
          >
            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
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
      {showTextEditModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30`}
        >
          <div
            className={`${
              darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"
            } rounded-lg shadow-lg p-6 w-96 flex flex-col gap-4 font-semibold`}
          >
            <h3 className="text-lg font-semibold">Edit Text</h3>
            <textarea
              className={`${
                darkMode ? "border-zinc-700" : "border-zinc-300"
              } border bg-inherit rounded p-2 w-full min-h-[120px] focus:outline-none`}
              value={modalTextValue}
              onChange={(e) => setModalTextValue(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  if (selectedElement) {
                    // Store original HTML if not already stored
                    if (
                      !selectedElement.element.getAttribute(
                        "data-original-html"
                      )
                    ) {
                      selectedElement.element.setAttribute(
                        "data-original-html",
                        selectedElement.element.innerHTML
                      );
                    }
                    selectedElement.element.textContent = modalTextValue;
                    handleContentEdit(selectedElement.element);
                    setHasUnsavedChanges(true);
                  }
                  setShowTextEditModal(false);
                  setSelectedElement(null);
                }}
              >
                Save
              </button>
              <button
                className="px-3 text-white py-1 rounded bg-gray-500 hover:bg-gray-600"
                onClick={() => {
                  setShowTextEditModal(false);
                  setSelectedElement(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Website;
