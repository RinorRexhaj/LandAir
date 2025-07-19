import useChange from "@/app/hooks/useChange";
import { useThemeStore } from "@/app/store/useThemeStore";
import { ElementPos } from "@/app/types/Element";
import React from "react";

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
  selectedElement,
  setHasUnsavedChanges,
  setModalTextValue,
  setShowTextEditModal,
  setSelectedElement,
}) => {
  const { darkMode } = useThemeStore();
  const { handleContentEdit } = useChange();

  return (
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
          value={modalTextValue.trim()}
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
                  !selectedElement.element.getAttribute("data-original-html")
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
  );
};

export default EditModal;
