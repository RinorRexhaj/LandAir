import useApi from "@/app/hooks/useApi";
import { useTimeAgo } from "@/app/hooks/useTimeAgo";
import useToast from "@/app/hooks/useToast";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import { useModalStore } from "@/app/store/useModalStore";
import { Project } from "@/app/types/Project";
import { faEdit, faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "@/app/hooks/useAuth";
import NameModal from "@/app/components/navbar/NameModal";

interface ProjectPreviewProps {
  project: Project;
  sortBy: string;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, sortBy }) => {
  const { darkMode } = useThemeStore();
  const { setSelectedProject, projects, setProjects } = useProjectStore();
  const { activeModal, setActiveModal } = useModalStore();
  const { loading, del } = useApi();
  const { formatTime } = useTimeAgo();
  const toast = useToast();
  const [imgError, setImgError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [hover, setHover] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const deleteModalId = `delete-${project.id}`;
  const renameModalId = `rename-${project.id}`;
  const showDeleteModal = activeModal === deleteModalId;
  const showRenameModal = activeModal === renameModalId;

  const imageUrl = imgError
    ? ""
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pages/${user?.id}/${project.id}/screenshot.png`;

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
      await del(`/api/storage?filePath=${project.id}`);
      if (success) {
        setProjects(projects.filter((p) => p.id !== project.id));
        toast.success("Successfully deleted!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }

    setActiveModal(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Close modals when clicking outside
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModal(null);
        setShowMenu(false);
      }
    };

    if (showDeleteModal || showRenameModal) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showDeleteModal, showRenameModal, setActiveModal]);

  // Cleanup modals when component unmounts
  useEffect(() => {
    return () => {
      if (activeModal === deleteModalId || activeModal === renameModalId) {
        setActiveModal(null);
      }
    };
  }, [activeModal, deleteModalId, renameModalId, setActiveModal]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleRenameClick = () => {
    setShowMenu(false);
    setActiveModal(renameModalId);
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    setActiveModal(deleteModalId);
  };

  const closeDeleteModal = () => {
    setActiveModal(null);
  };

  const closeRenameModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div
        className={`relative rounded-xl group transition-transform hover:-translate-y-1 cursor-pointer bg-gray-100 ${
          darkMode
            ? "bg-zinc-700/30 hover:bg-zinc-700/50"
            : "bg-gray-200/60 hover:bg-gray-200"
        }`}
        onClick={() => {
          setSelectedProject(project);
          router.push(`/project/${project.id}`);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Action Menu */}
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          className="transition-opacity absolute bottom-10 right-2"
        >
          <div className="text-left">
            <button
              onClick={handleMenuClick}
              className={`px-2 py-1 rounded-lg ${
                darkMode
                  ? "text-gray-400 hover:bg-zinc-700"
                  : "text-gray-600 hover:bg-gray-200"
              } ${hover ? "opacity-100" : "opacity-0"}`}
            >
              •••
            </button>
            {showMenu && (
              <div
                className={`absolute right-0 top-8 w-32 rounded-md animate-fadeFast shadow-lg z-40 ${
                  darkMode ? "bg-zinc-800" : "bg-white"
                }`}
              >
                <div className="py-1">
                  <button
                    className={`w-full flex gap-2 items-center text-left px-4 py-2 text-sm ${
                      darkMode
                        ? "hover:bg-zinc-700 text-gray-200"
                        : "hover:bg-gray-100 text-zinc-800"
                    }`}
                    onClick={handleRenameClick}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <p className="">Rename</p>
                  </button>
                  <button
                    className={`w-full flex gap-2 items-center text-left px-4 py-2 text-sm ${
                      darkMode
                        ? "hover:bg-red-500/20 text-red-400"
                        : "hover:bg-red-500/10 text-red-500"
                    }`}
                    onClick={handleDeleteClick}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <p className="">Delete</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Screenshot */}
        <div className="w-full h-40 relative rounded-tl-xl rounded-tr-xl overflow-hidden">
          {imageUrl && !authLoading ? (
            <Image
              src={`${imageUrl}`}
              alt={`${project.project_name} Screenshot`}
              fill
              onError={() => setImgError(true)}
              className="object-cover animate-fade"
              sizes="(max-width: 500px) 100%, (max-width: 1000px) 50%, 25%"
            />
          ) : (
            <div
              className={`${
                darkMode ? "bg-zinc-900/50" : "bg-zinc-300/50"
              } w-full border border-zinc-500/20 border-b-0 rounded-xl rounded-bl-none rounded-br-none h-full flex items-center justify-center`}
            >
              <FontAwesomeIcon icon={faImage} className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="p-4 flex flex-col gap-1">
          <h3
            className={`text-base font-semibold truncate ${
              darkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            {project.project_name}
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-zinc-600"
            } truncate`}
          >
            {formatProjectDate(project)}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeDeleteModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`p-6 rounded-xl animate-fadeFast max-w-md w-full mx-4 ${
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
                onClick={closeDeleteModal}
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

      {/* Rename Modal */}
      {showRenameModal && (
        <NameModal
          setIsEditNameModalOpen={closeRenameModal}
          project={project}
        />
      )}
    </>
  );
};

export default ProjectPreview;
