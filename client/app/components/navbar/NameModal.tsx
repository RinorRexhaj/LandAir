import useApi from "@/app/hooks/useApi";
import useToast from "@/app/hooks/useToast";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import { Project } from "@/app/types/Project";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface NameModalProps {
  setIsEditNameModalOpen: (open: boolean) => void;
  project?: Project;
}

const NameModal: React.FC<NameModalProps> = ({
  setIsEditNameModalOpen,
  project,
}) => {
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { selectedProject, changeProject } = useProjectStore();
  const { put } = useApi();
  const toast = useToast();
  const { darkMode } = useThemeStore();
  const [newProjectName, setNewProjectName] = useState(
    selectedProject?.project_name || project?.project_name || ""
  );

  const saveName = async (e: React.FormEvent<HTMLFormElement> | null) => {
    e?.preventDefault();
    if ((!selectedProject && !project) || !newProjectName.trim()) return;
    setSaving(true);
    try {
      const updatedProject: Project[] = await put(
        `/api/projects/${selectedProject?.id || project?.id}`,
        { new_name: newProjectName.trim() }
      );
      changeProject(updatedProject[0]);
      toast.success("Project name updated successfully!");
    } catch {
      toast.error("Something went wrong!");
    }
    setSaving(false);
    setIsEditNameModalOpen(false);
  };

  const handleClose = useCallback(() => {
    if (!saving) {
      setIsEditNameModalOpen(false);
    }
  }, [saving, setIsEditNameModalOpen]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [saving, handleClose]);

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 ${
          darkMode ? "bg-black/50" : "bg-black/30"
        } backdrop-blur-sm`}
        onClick={handleClose}
      />
      <div
        ref={modalRef}
        className={`relative w-full max-w-md p-6 rounded-xl border shadow-2xl animate-fadeFast ${
          darkMode
            ? "bg-zinc-900 border-white/10"
            : "bg-white border-zinc-700/20"
        }`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-zinc-700 hover:text-zinc-900"
          } transition-colors`}
          disabled={saving}
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>
        <h2
          className={`text-xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-zinc-900"
          }`}
        >
          Edit Project Name
        </h2>
        <form onSubmit={saveName}>
          <input
            type="text"
            ref={nameRef}
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none mb-4 ${
              darkMode
                ? "bg-zinc-800 text-white border-zinc-700 focus:border-blue-500"
                : "bg-white text-zinc-900 border-zinc-300 focus:border-blue-600"
            }`}
            disabled={saving}
            maxLength={20}
            placeholder="Enter project name"
          />
        </form>
        <p className={`mb-4 ${!darkMode ? "text-zinc-700" : "text-zinc-200"}`}>
          The project name should be 20 chars max.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg font-medium ${
              darkMode
                ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-zinc-900"
            }`}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={() => saveName(null)}
            className={`px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white ${
              saving && "animate-glow cursor-not-allowed"
            }`}
            disabled={saving || !newProjectName.trim()}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NameModal;
