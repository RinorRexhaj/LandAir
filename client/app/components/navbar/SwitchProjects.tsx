import useApi from "@/app/hooks/useApi";
import useToast from "@/app/hooks/useToast";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useToolbarStore } from "@/app/store/useToolbarStore";
import {
  faCheck,
  faPlusCircle,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState, useEffect } from "react";

const SwitchProjects = () => {
  const { projects, setSelectedProject, selectedProject, createProject } =
    useProjectStore();
  const { setMobile, setSelector } = useToolbarStore();
  const toast = useToast();
  const { post } = useApi();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative flex" ref={dropdownRef}>
      <button
        className="p-2 mt-0.5 flex items-center justify-center hover:bg-zinc-700 rounded-lg"
        onClick={() => setOpen((prev) => !prev)}
        title="Switch Project"
      >
        <FontAwesomeIcon icon={faSort} />
      </button>
      {open && (
        <div className="fixed left-4 top-12 min-w-[180px] w-52 max-w-[260px] bg-zinc-900 text-white shadow-lg rounded-lg py-2 animate-fadeFast border border-zinc-800">
          {/* Create Project Button */}
          {projects.length < 4 && (
            <button
              key={"create-project-switch"}
              className={`w-full flex justify-between items-center text-left px-4 py-2 transition-colors text-sm truncate rounded-none hover:bg-zinc-800`}
              onClick={() => {
                createProject(toast, post);
                setOpen(false);
              }}
            >
              New Project
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          )}
          {projects.length === 0 ? (
            <div className="px-4 py-2 text-sm text-zinc-400">
              No projects found
            </div>
          ) : (
            projects.map((project) => {
              const isActive =
                selectedProject && selectedProject.id === project.id;
              return (
                <button
                  key={project.id}
                  className={`w-full flex justify-between items-center text-left px-4 py-2 transition-colors text-sm truncate rounded-none ${
                    isActive
                      ? "bg-zinc-700 font-semibold cursor-default"
                      : "hover:bg-zinc-700"
                  }`}
                  onClick={() => {
                    if (!isActive) {
                      setSelectedProject(project);
                      setMobile(0);
                      setSelector(false);
                    }
                    setOpen(false);
                  }}
                  disabled={!!isActive}
                >
                  {project.project_name}
                  {isActive && <FontAwesomeIcon icon={faCheck} />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SwitchProjects;
