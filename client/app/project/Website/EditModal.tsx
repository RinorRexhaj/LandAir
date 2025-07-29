import React, { useEffect, useRef, useState } from "react";
import useChange from "@/app/hooks/useChange";
import { useThemeStore } from "@/app/store/useThemeStore";
import { ElementPos, ElementStyles } from "@/app/types/Element";
import {
  getAlignIcon,
  getDecorIcon,
  resetStyles,
  rgbToHex,
} from "@/app/utils/Elements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faItalic } from "@fortawesome/free-solid-svg-icons";

interface EditModalProps {
  modalTextValue: string;
  setModalTextValue: (val: string) => void;
  selectedElement: ElementPos | null;
  setSelectedElement: (el: ElementPos | null) => void;
  setHasUnsavedChanges: (ch: boolean) => void;
  setShowTextEditModal: (show: boolean) => void;
  elementType: "image" | "text" | "layout" | null;
}

const EditModal: React.FC<EditModalProps> = ({
  modalTextValue,
  setModalTextValue,
  selectedElement,
  setHasUnsavedChanges,
  setShowTextEditModal,
  setSelectedElement,
  elementType,
}) => {
  const { darkMode } = useThemeStore();
  const { handleContentEdit, handleUndoChange } = useChange();
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [initialStyles, setInitialStyles] = useState<ElementStyles>({
    color: "#000000",
    backgroundColor: "rgba(0, 0, 0, 0)",
    fontWeight: "normal",
    fontSize: "12px",
    textAlign: "center",
    textDecoration: "none",
    fontStyle: "none",
  });
  const [computedStyles, setComputedStyles] = useState<ElementStyles>({
    color: "#000000",
    backgroundColor: "rgba(0, 0, 0, 0)",
    fontWeight: "normal",
    fontSize: "12px",
    textAlign: "center",
    textDecoration: "none",
    fontStyle: "none",
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
      const computedStyleObj: ElementStyles = {
        color: rgbToHex(style.color),
        backgroundColor: rgbToHex(style.backgroundColor),
        fontWeight: style.fontWeight,
        fontSize: style.fontSize,
        textAlign: style.textAlign,
        textDecoration: style.textDecoration,
        fontStyle: style.fontStyle,
      };

      setComputedStyles(computedStyleObj);
      setInitialStyles(computedStyleObj);
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

      if (elementType === "text") {
        el.textContent = modalTextValue;
      }

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

  /*
    <div className="fixed tb:fixed w-full tb:inset-0 z-40 flex items-center justify-center tb:bg-black tb:bg-opacity-30">
      <div
        className={`${
          darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"
        } absolute top-1 right-9 tb:static rounded border border-zinc-700 shadow-lg p-6 flex flex-col gap-4 font-semibold`}
        style={{
          width:
            document.body.clientWidth > 1000
              ? "calc(33.333333% - 24px)"
              : "384px",
        }}
      >
  */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div
        className={`${
          darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"
        } rounded-lg shadow-lg p-6 w-96 flex flex-col gap-4 font-semibold`}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Element</h3>
          <p
            className={`lowercase py-0.5 flex items-center justify-center px-3 border rounded ${
              darkMode
                ? "border-zinc-700 bg-zinc-800 text-white"
                : "border-zinc-300 bg-zinc-100 text-zinc-900"
            }`}
          >
            {selectedElement?.element.tagName}
          </p>
        </div>

        {elementType === "text" && (
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
        )}

        {/* Link input (if <a>) */}
        {selectedElement?.element.tagName === "A" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Link (href)</label>
            <input
              className={`p-2 rounded border ${
                darkMode
                  ? "bg-inherit border-zinc-700"
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

        <div className="w-full flex flex-col gap-2">
          <div className="w-full overflow-hidden flex gap-2 items-center mb-2">
            <div className="w-full">
              <label className="text-sm font-medium">Text Color</label>
              <div
                className={`flex items-center gap-2 py-1 px-1.5  bg-inherit rounded border ${
                  darkMode ? "border-zinc-700" : "border-zinc-300"
                }`}
              >
                <input
                  type="color"
                  className={`w-8 h-7 bg-inherit`}
                  value={computedStyles.color}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (selectedElement) {
                      selectedElement.element.style.color = value;
                      setComputedStyles({ ...computedStyles, color: value });
                    }
                  }}
                />
                <input
                  type="text"
                  className={`w-full bg-inherit ${
                    darkMode ? "text-white" : "text-zinc-900"
                  } focus:outline-none`}
                  value={computedStyles.color}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (selectedElement) {
                      selectedElement.element.style.color = value;
                      setComputedStyles({ ...computedStyles, color: value });
                    }
                  }}
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="text-sm font-medium">Background Color</label>
              <div
                className={`flex items-center gap-2 py-1 px-1.5  bg-inherit rounded border ${
                  darkMode ? "border-zinc-700" : "border-zinc-300"
                } focus:outline-none`}
              >
                <input
                  type="color"
                  className="w-8 h-7 bg-inherit"
                  value={computedStyles.backgroundColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (selectedElement) {
                      selectedElement.element.style.backgroundColor = value;
                      setComputedStyles({
                        ...computedStyles,
                        backgroundColor: value,
                      });
                    }
                  }}
                />
                <input
                  type="text"
                  className={`w-full bg-inherit ${
                    darkMode ? "text-white" : "text-zinc-900"
                  } focus:outline-none`}
                  value={computedStyles.backgroundColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (selectedElement) {
                      selectedElement.element.style.backgroundColor = value;
                      setComputedStyles({
                        ...computedStyles,
                        backgroundColor: value,
                      });
                    }
                  }}
                  placeholder="None"
                />
              </div>
            </div>
          </div>

          <div className="w-full overflow-hidden flex gap-2 items-center">
            <div className="w-full">
              <label className="text-sm font-medium">Font Size</label>
              <input
                type="text"
                className={`w-full font-medium bg-inherit rounded px-2 py-1 border ${
                  darkMode ? "border-zinc-700" : "border-zinc-300"
                } focus:outline-none`}
                value={computedStyles.fontSize}
                onChange={(e) => {
                  const value = e.target.value;
                  if (selectedElement) {
                    selectedElement.element.style.fontSize = value;
                    setComputedStyles({ ...computedStyles, fontSize: value });
                  }
                }}
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="text-sm font-medium">Font Weight</label>
              <select
                className={`cursor-pointer px-2 py-1.5 font-medium rounded bg-inherit border ${
                  darkMode
                    ? "border-zinc-700 bg-zinc-900 text-white"
                    : "bg-inherit border-zinc-300 text-zinc-900"
                } focus:outline-none`}
                value={computedStyles.fontWeight}
                onChange={(e) => {
                  if (selectedElement) {
                    selectedElement.element.style.fontWeight = e.target.value;
                    setComputedStyles({
                      ...computedStyles,
                      fontWeight: e.target.value,
                    });
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
          </div>
        </div>

        <div className="w-full flex items-center gap-2">
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">Text Align</label>
            <div className="flex gap-1">
              {["left", "center", "right", "justify"].map((align) => (
                <button
                  key={align}
                  className={`px-2 py-1 rounded border text-sm ${
                    computedStyles.textAlign === align
                      ? "bg-zinc-600 text-white border-zinc-500"
                      : darkMode
                      ? "bg-zinc-800 text-white border-zinc-700"
                      : "bg-white text-zinc-900 border-zinc-300"
                  }`}
                  onClick={() => {
                    if (selectedElement) {
                      selectedElement.element.style.textAlign = align;
                      setComputedStyles({
                        ...computedStyles,
                        textAlign: align,
                      });
                    }
                  }}
                  type="button"
                >
                  <FontAwesomeIcon icon={getAlignIcon(align)} />
                </button>
              ))}
            </div>
          </div>
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">
              Text Decoration
            </label>
            <div className="flex gap-1">
              <button
                key={"decor-italic"}
                className={`px-2 py-1 rounded border text-sm capitalize ${
                  computedStyles.fontStyle === "italic"
                    ? "bg-zinc-600 text-white border-zinc-500"
                    : darkMode
                    ? "bg-zinc-800 text-white border-zinc-700"
                    : "bg-white text-zinc-900 border-zinc-300"
                }`}
                onClick={() => {
                  if (selectedElement) {
                    const isSelected = computedStyles.fontStyle === "italic";
                    selectedElement.element.style.fontStyle = isSelected
                      ? ""
                      : "italic";
                    setComputedStyles({
                      ...computedStyles,
                      fontStyle: isSelected ? "" : "italic",
                    });
                  }
                }}
                type="button"
              >
                <FontAwesomeIcon icon={faItalic} />
              </button>
              {["underline", "line-through"].map((decoration) => (
                <button
                  key={decoration}
                  className={`px-2 py-1 rounded border text-sm capitalize ${
                    computedStyles.textDecoration === decoration
                      ? "bg-zinc-600 text-white border-zinc-500"
                      : darkMode
                      ? "bg-zinc-800 text-white border-zinc-700"
                      : "bg-white text-zinc-900 border-zinc-300"
                  }`}
                  onClick={() => {
                    if (selectedElement) {
                      const isSelected =
                        computedStyles.textDecoration === decoration;
                      selectedElement.element.style.textDecoration = isSelected
                        ? ""
                        : decoration;
                      setComputedStyles({
                        ...computedStyles,
                        textDecoration: isSelected ? "" : decoration,
                      });
                    }
                  }}
                  type="button"
                >
                  <FontAwesomeIcon icon={getDecorIcon(decoration)} />
                </button>
              ))}
            </div>
          </div>
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
                resetStyles(selectedElement?.element, initialStyles);
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
