import React, { useState, useEffect, useCallback } from "react";
// import Empty from "./EmptyProject";
import Prompt from "./Prompt";
// import Generating from "./Generating";
import Preview from "./Preview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDisplay, faRobot } from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";
import Generating from "./Generating";
import Empty from "./EmptyProject";
import { useProjectStore } from "@/app/store/useProjectsStore";
import useAuth from "@/app/hooks/useAuth";
import useApi from "@/app/hooks/useApi";
import Loading from "./Loading";

const ProjectPage = () => {
  const { selectedProject, setSelectedProject } = useProjectStore();
  const [projectFile, setProjectFile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeView, setActiveView] = useState<"preview" | "prompt">("preview");
  const { darkMode } = useThemeStore();
  const { user } = useAuth();
  const { setLoading, loading, get } = useApi();

  const getUrl = useCallback(async () => {
    if (!selectedProject) return;
    setLoading(true);
    const url = await get(
      `/api/storage?project_name=${selectedProject.project_name}`
    );
    const content: string = await get(`${url}?v=${Date.now()}`);

    if (url && content) {
      setSelectedProject({ ...selectedProject, file: content });
      setProjectFile(true);
    } else {
      setSelectedProject({ ...selectedProject, file: undefined });
      setProjectFile(false);
    }
  }, [get, selectedProject, setLoading, setSelectedProject]);

  useEffect(() => {
    if (
      !user ||
      !selectedProject ||
      selectedProject.file ||
      selectedProject.created
    )
      return;

    getUrl();
  }, [
    user,
    selectedProject,
    projectFile,
    setSelectedProject,
    get,
    setLoading,
    getUrl,
  ]);

  if (!selectedProject) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Toggle Preview/Prompt */}
      <div
        className={`absolute right-4 hidden z-40 tb:flex w-fit px-1 py-1 rounded-lg items-center justify-center gap-2 border transition-all duration-200 ${
          darkMode
            ? "bg-zinc-800/20 border-gray-200/20"
            : "bg-zinc-100/80 border-gray-300/50"
        }`}
      >
        <button
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
            activeView !== "preview"
              ? "opacity-70 hover:opacity-100"
              : darkMode
              ? "bg-zinc-700 text-white"
              : "bg-white text-black shadow"
          }`}
          onClick={() => setActiveView("preview")}
          title="Preview"
          disabled={loading}
        >
          <FontAwesomeIcon icon={faDisplay} className="w-4 h-4" />
          <p className="md:hidden">Preview</p>
        </button>

        <button
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
            activeView === "prompt"
              ? darkMode
                ? "bg-zinc-700 text-white"
                : "bg-white text-black shadow"
              : "opacity-70 hover:opacity-100"
          }`}
          onClick={() => setActiveView("prompt")}
          title="Generate"
          disabled={loading}
        >
          <FontAwesomeIcon icon={faRobot} className="w-4 h-4" />
          <p className="md:hidden">Generate</p>
        </button>
      </div>

      {/* Project Content */}
      <div
        className="w-full flex gap-4"
        style={{
          height: "calc(100vh - 80px)",
        }}
      >
        {/* Desktop Layout */}
        <div
          className={`relative w-8/12 animate-fade ${
            activeView === "preview" ? "tb:w-full" : "tb:hidden"
          }`}
        >
          {isGenerating ? (
            <Generating />
          ) : projectFile ? (
            <Preview getUrl={getUrl} />
          ) : loading ? (
            <Loading />
          ) : (
            <Empty />
          )}
        </div>
        <div
          className={`w-4/12 ${
            activeView === "prompt" ? "tb:w-full" : "tb:hidden"
          }`}
        >
          <Prompt
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            setProjectFile={setProjectFile}
            getUrl={getUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
