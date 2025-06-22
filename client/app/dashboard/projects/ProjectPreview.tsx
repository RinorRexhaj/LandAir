import useApi from "@/app/hooks/useApi";
import { useTimeAgo } from "@/app/hooks/useTimeAgo";
import useToast from "@/app/hooks/useToast";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import { Project } from "@/app/types/Project";
import { faClock, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface ProjectPreviewProps {
  project: Project;
  sortBy: string;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, sortBy }) => {
  const { darkMode } = useThemeStore();
  const { setSelectedProject, projects, setProjects } = useProjectStore();
  const { loading, del } = useApi();
  const { formatTime } = useTimeAgo();
  const toast = useToast();
  const [hover, setHover] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatProjectDate = (project: Project) => {
    const date =
      sortBy === "alphabetical"
        ? project.last_edited
        : sortBy === "Created"
        ? project.created_at
        : project.last_edited;
    const text = sortBy === "alphabetical" ? "Edited" : sortBy;
    return (
      text +
      " " +
      formatTime(date) +
      (formatTime(date).startsWith("now") ? "" : " ago")
    );
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const success = await del(`/api/projects/${project.id}`);
      await del(`/api/storage?filePath=${project.project_name}`);
      if (success) {
        setProjects(projects.filter((p) => p.id !== project.id));
        toast.success("Successfully deleted!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }

    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className={`relative bottom-0 flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer ${
          darkMode
            ? "bg-zinc-700/30 hover:bg-zinc-700/50"
            : "bg-gray-200/60 hover:bg-gray-200"
        } hover:-translate-y-1 transition-transform`}
        onClick={() => setSelectedProject(project)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start">
            <h3
              className={`font-semibold ${
                darkMode ? "text-white" : "text-zinc-900"
              }`}
            >
              {project.project_name}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <span
                className={`flex items-center gap-1 text-sm ${
                  darkMode ? "text-gray-400" : "text-zinc-600"
                }`}
              >
                <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                {formatProjectDate(project)}
              </span>
            </div>
          </div>
        </div>
        <div
          className={`flex-col max-h-10 top-0 ${
            hover ? "animate-fade flex" : "hidden"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-red-500/20 text-gray-400 hover:text-red-500"
                : "hover:bg-red-500/20 text-gray-600 hover:text-red-500"
            }`}
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl max-w-md w-full mx-4 ${
              darkMode ? "bg-zinc-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-4 ${
                darkMode ? "text-white" : "text-zinc-900"
              }`}
            >
              Delete Project
            </h3>
            <p
              className={`mb-6 ${darkMode ? "text-gray-300" : "text-zinc-600"}`}
            >
              Are you sure you want to delete &ldquo;
              <span className="font-bold">{project.project_name}</span>
              &rdquo; and it&apos;s associated data? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  darkMode
                    ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-zinc-900"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white ${
                  loading && "animate-glow cursor-not-allowed"
                }`}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectPreview;
