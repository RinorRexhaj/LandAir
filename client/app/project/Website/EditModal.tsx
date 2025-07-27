import React, { useEffect, useRef, useState } from "react";
import useChange from "@/app/hooks/useChange";
import { useThemeStore } from "@/app/store/useThemeStore";
import { ElementPos, ElementStyles } from "@/app/types/Element";
import { resetStyles, rgbToHex } from "@/app/utils/Elements";

interface EditModalProps {
  modalTextValue: string;
  setModalTextValue: (val: string) => void;
  selectedElement: ElementPos | null;
  setSelectedElement: (el: ElementPos | null) => void;
  setHasUnsavedChanges: (ch: boolean) => void;
  setShowTextEditModal: (show: boolean) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  modalTextValue,
  setModalTextValue,
  selectedElement,
  setHasUnsavedChanges,
  setShowTextEditModal,
  setSelectedElement,
}) => {
  const { darkMode } = useThemeStore();
  const { handleContentEdit, handleUndoChange } = useChange();
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [computedStyles, setComputedStyles] = useState<ElementStyles>({
    color: "#000000",
    backgroundColor: "rgba(0, 0, 0, 0)",
    fontWeight: "normal",
  });

  useEffect(() => {
    setModalTextValue(modalTextValue.trim());

    if (selectedElement?.element.tagName === "A") {
      const href = selectedElement.element.getAttribute("data-original-href");
      if (href) setLink(href);
    }

    selectedElement?.element.setAttribute(
      "data-original-html",
      selectedElement.element.outerHTML
    );

    if (selectedElement?.element) {
      const style = window.getComputedStyle(selectedElement.element);
      const computedStyleObj = {
        color: rgbToHex(style.color),
        backgroundColor: rgbToHex(style.backgroundColor),
        fontWeight: style.fontWeight,
      };

      setComputedStyles(computedStyleObj);
    }

    setTimeout(() => autoResize(), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const isValidHref = (value: string) => {
    if (
      value.startsWith("#") &&
      value.length > 1 &&
      /^[a-zA-Z0-9\-_]+$/.test(value.slice(1))
    ) {
      return true;
    }
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLink(value);

    if (value.trim() === "" || isValidHref(value.trim())) {
      setLinkError("");
    } else {
      setLinkError("Must be a valid URL or an HTML ID (e.g., #contact)");
    }
  };

  const handleSave = () => {
    if (selectedElement) {
      const el = selectedElement.element;

      el.textContent = modalTextValue;

      if (el.tagName === "A") {
        const trimmedLink = link.trim();
        if (trimmedLink !== "") {
          if (isValidHref(trimmedLink)) {
            el.setAttribute("data-original-href", trimmedLink);
          } else {
            setLinkError("Please enter a valid URL or #id");
            return;
          }
        }
      }

      handleContentEdit(el);
      setHasUnsavedChanges(true);
    }

    setShowTextEditModal(false);
    setSelectedElement(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div
        className={`${
          darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"
        } rounded-lg shadow-lg p-6 w-96 flex flex-col gap-4 font-semibold`}
      >
        <h3 className="text-lg font-semibold">Edit Element</h3>

        <textarea
          ref={textareaRef}
          className={`${
            darkMode ? "border-zinc-700" : "border-zinc-300"
          } border bg-inherit rounded p-2 w-full resize-none focus:outline-none`}
          value={modalTextValue}
          onChange={(e) => {
            setModalTextValue(e.target.value);
            autoResize();
          }}
          autoFocus
        />

        {/* Link input (if <a>) */}
        {selectedElement?.element.tagName === "A" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Link (href)</label>
            <input
              className={`p-2 rounded border ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700"
                  : "bg-zinc-100 border-zinc-300"
              } focus:outline-none`}
              value={link}
              onChange={handleLinkChange}
              placeholder={!link ? "https://example.com" : ""}
            />
            {linkError && (
              <span className="text-sm text-red-500">{linkError}</span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center mb-2">
            <div className="w-full">
              <label className="text-sm font-medium">Text Color</label>
              <input
                type="color"
                className="w-full h-10 p-1 bg-zinc-800 rounded border border-zinc-700 focus:outline-none"
                value={computedStyles.color}
                onChange={(e) => {
                  if (selectedElement) {
                    selectedElement.element.style.color = e.target.value;
                  }
                }}
              />
            </div>

            <div className="w-full">
              <label className="text-sm font-medium">Background Color</label>
              <input
                type="color"
                className="w-full h-10 p-1 bg-zinc-800 rounded border border-zinc-700 focus:outline-none"
                value={computedStyles.backgroundColor}
                onChange={(e) => {
                  if (selectedElement) {
                    selectedElement.element.style.backgroundColor =
                      e.target.value;
                  }
                }}
              />
            </div>
          </div>

          <label className="text-sm font-medium">Font Weight</label>
          <select
            className={`p-2 rounded border ${
              darkMode
                ? "bg-zinc-800 border-zinc-700 text-white"
                : "bg-zinc-100 border-zinc-300 text-zinc-900"
            } focus:outline-none`}
            value={computedStyles.fontWeight}
            onChange={(e) => {
              if (selectedElement) {
                selectedElement.element.style.fontWeight = e.target.value;
              }
            }}
          >
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
            onClick={() => {
              if (selectedElement?.element) {
                resetStyles(selectedElement?.element, computedStyles);
              }
              handleUndoChange();
              setShowTextEditModal(false);
              setSelectedElement(null);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
