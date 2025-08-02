import useChange from "@/app/hooks/useChange";
import { useThemeStore } from "@/app/store/useThemeStore";
import { ElementPos } from "@/app/types/Element";
import { faBookmark, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { RefObject } from "react";

interface ChangesBarProps {
  setSelector: (sel: boolean) => void;
  setChanged: (ch: boolean) => void;
  selectedElement: ElementPos | null;
  setSelectedElement: (el: ElementPos | null) => void;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  setIsEditing: (ed: boolean) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (ed: boolean) => void;
}

const ChangesBar: React.FC<ChangesBarProps> = ({
  setChanged,
  setSelector,
  setSelectedElement,
  iframeRef,
  setIsEditing,
  hasUnsavedChanges,
  setHasUnsavedChanges,
}) => {
  const { darkMode } = useThemeStore();
  const { handleSaveChanges, handleDiscardChanges, handleUndoChange } =
    useChange();
  return (
    <>
      {hasUnsavedChanges && (
        <div
          className={`fixed top-1.5 left-[45%] -translate-x-1/2 ml-[175px] md:left-[135px] sm:left-[99px] md:top-12 md:mt-1.5 flex p-1 gap-1 rounded-lg items-center z-40 transition-all animate-fade duration-200 ${
            darkMode
              ? "bg-zinc-800/80 border-gray-200/20"
              : "bg-zinc-100/80 border-gray-300/50"
          }`}
        >
          <button
            onClick={async () => {
              setSelector(false);
              const saved = await handleSaveChanges(iframeRef);
              if (saved) {
                setChanged(true);
                setHasUnsavedChanges(false);
              }
            }}
            title="Save"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 focus:outline-none hover:opacity-100 hover:bg-blue-500/70 ${
              !darkMode && "hover:text-zinc-100"
            }`}
          >
            <FontAwesomeIcon icon={faBookmark} className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const noChanges = handleUndoChange();
              if (noChanges) setHasUnsavedChanges(false);
            }}
            title="Undo"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 focus:outline-none hover:opacity-100  ${
              darkMode
                ? "hover:bg-zinc-500"
                : "hover:bg-zinc-700/70 hover:text-white"
            }`}
          >
            <FontAwesomeIcon icon={faUndo} className="w-4 h-4" />
          </button>
          <button
            onClick={async () => {
              const discarded = await handleDiscardChanges(iframeRef);
              if (discarded) {
                setSelector(false);
                setSelectedElement(null);
                setHasUnsavedChanges(false);
                setIsEditing(false);
              }
            }}
            title="Discard"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 focus:outline-none hover:opacity-100 hover:bg-red-500/80 ${
              !darkMode && "hover:text-zinc-100"
            }`}
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default ChangesBar;
