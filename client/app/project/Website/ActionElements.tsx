import useChange from "@/app/hooks/useChange";
import { useThemeStore } from "@/app/store/useThemeStore";
import { ElementPos } from "@/app/types/Element";
import {
  faCheck,
  faImage,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { RefObject } from "react";

interface ActionElementsProps {
  selector: boolean;
  hoveredElement: ElementPos | null;
  selectedElement: ElementPos | null;
  setSelectedElement: (el: ElementPos | null) => void;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  toolBarPos: {
    top: number;
    left: number;
  } | null;
  elementType: "text" | "image" | "layout" | null;
  isEditing: boolean;
  setIsEditing: (ed: boolean) => void;
  setHasUnsavedChanges: (ed: boolean) => void;
  setModalTextValue: (val: string) => void;
  setShowTextEditModal: (show: boolean) => void;
  selectedVisible: boolean;
}

const ActionElements: React.FC<ActionElementsProps> = ({
  selector,
  hoveredElement,
  selectedElement,
  setSelectedElement,
  elementType,
  toolBarPos,
  iframeRef,
  isEditing,
  setIsEditing,
  setHasUnsavedChanges,
  setModalTextValue,
  setShowTextEditModal,
  selectedVisible,
}) => {
  const { handleContentDelete, handleContentEdit } = useChange();
  const { darkMode } = useThemeStore();

  return (
    <>
      {selector && hoveredElement && iframeRef.current && (
        <div
          className={`bg-blue-500 opacity-50 pointer-events-none`}
          style={{
            position: "fixed",
            height: hoveredElement.height,
            width: hoveredElement.width,
            left: hoveredElement.left,
            top: hoveredElement.top,
          }}
        ></div>
      )}
      {selector && selectedElement && selectedVisible && iframeRef.current && (
        <div
          className="outline-dashed outline-2 outline-blue-700 opacity-100 pointer-events-none"
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
          className={`absolute z-40 ${
            darkMode
              ? "bg-zinc-900 text-white border-zinc-700"
              : "text-zinc-900 bg-white border-zinc-200"
          } px-3 py-1.5 flex gap-2 items-center rounded text-xs shadow-lg border-2 `}
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
                className={`hover:text-blue-600 flex items-center gap-1`}
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
            className="hover:text-red-600 flex items-center gap-1 font-semibold"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
            <p className="md:hidden">Delete</p>
          </button>
        </div>
      )}
    </>
  );
};

export default ActionElements;
