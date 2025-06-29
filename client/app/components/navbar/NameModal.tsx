import useApi from "@/app/hooks/useApi";
import useToast from "@/app/hooks/useToast";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import { Project } from "@/app/types/Project";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

interface NameModalProps {
  setIsEditNameModalOpen: (open: boolean) => void;
}

const NameModal: React.FC<NameModalProps> = ({ setIsEditNameModalOpen }) => {
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const { selectedProject, changeProject } = useProjectStore();
  const { put } = useApi();
  const toast = useToast();
  const { darkMode } = useThemeStore();
  const [newProjectName, setNewProjectName] = useState(
    selectedProject?.project_name || ""
  );

  const saveName = async (e: React.FormEvent<HTMLFormElement> | null) => {
    e?.preventDefault();
    if (!selectedProject || !newProjectName.trim()) return;
    setSaving(true);
    try {
      const updatedProject: Project[] = await put(
        `/api/projects/${selectedProject.id}`,
        { new_name: newProjectName.trim() }
      );
      changeProject(updatedProject[0]);
    } catch {
      toast.error("Something went wrong!");
    }
    setSaving(false);
    setIsEditNameModalOpen(false);
  };

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 ${
          darkMode ? "bg-black/50" : "bg-white/5"
        } backdrop-blur-sm`}
        onClick={() => !saving && setIsEditNameModalOpen(false)}
      />
      <div
        className={`relative w-full max-w-md p-6 rounded-xl border shadow-2xl ${
          darkMode
            ? "bg-zinc-900 border-white/10"
            : "bg-white border-zinc-700/20"
        }`}
      >
        <button
          onClick={() => !saving && setIsEditNameModalOpen(false)}
          className={`absolute top-4 right-4 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-zinc-700 hover:text-zinc-900"
          } transition-colors`}
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
            maxLength={50}
          />
        </form>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsEditNameModalOpen(false)}
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
