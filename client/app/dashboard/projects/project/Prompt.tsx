import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";
import { useProjectStore } from "@/app/store/useProjectsStore";
import useAuth from "@/app/hooks/useAuth";
import { supabase } from "@/app/utils/Supabase";

interface WebsiteRequirements {
  generalDescription: string;
  audienceType: string;
  colorScheme: string;
  additionalFeatures: string;
}

interface PromptProps {
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  setProjectFile: (file: boolean) => void;
}

const Prompt: React.FC<PromptProps> = ({
  isGenerating,
  setIsGenerating,
  setProjectFile,
}) => {
  const [requirements, setRequirements] = useState<WebsiteRequirements>({
    generalDescription: "",
    audienceType: "",
    colorScheme: "",
    additionalFeatures: "",
  });
  const { selectedProject, setSelectedProject } = useProjectStore();
  const { user } = useAuth();
  const { darkMode } = useThemeStore();

  const handleInputChange = (
    field: keyof WebsiteRequirements,
    value: string
  ) => {
    setRequirements((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      const content = `<!DOCTYPE html><body><h1 style="color: white; font-size: 40px">Personal Project - LandAir</h1></body></html>`;
      const blob = new Blob([content], { type: "text/html" });
      const filePath = `${user?.id}/${selectedProject?.project_name}`;
      const file = new File([blob], filePath, { type: "text/html" });
      await supabase.storage.from("pages").upload(filePath, file, {
        contentType: "text/html",
      });
      setSelectedProject(selectedProject);
      setProjectFile(true);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setProjectFile(true);
      }, 5000);
    }
  };

  return (
    <div
      className={`flex flex-col justify-between h-full w-full mx-auto ${
        darkMode
          ? "bg-zinc-900 border-zinc-600/80"
          : "bg-white border-zinc-600/20"
      } border rounded-xl shadow-md overflow-hidden animate-fade p-6`}
    >
      <div className="space-y-6">
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            General Description
          </label>
          <textarea
            value={requirements.generalDescription}
            onChange={(e) =>
              handleInputChange("generalDescription", e.target.value)
            }
            required
            placeholder="Describe your website's purpose and main features..."
            className={`w-full rounded-xl px-4 py-2 text-sm leading-relaxed transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-zinc-800 text-white placeholder-gray-400 border-zinc-700"
                : "bg-white text-zinc-900 placeholder-gray-500 border-zinc-300"
            }`}
            rows={3}
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Target Audience / Business Type
          </label>
          <input
            type="text"
            value={requirements.audienceType}
            onChange={(e) => handleInputChange("audienceType", e.target.value)}
            placeholder="e.g., Small Business, E-commerce, Portfolio..."
            className={`w-full rounded-xl px-4 py-2 text-sm leading-relaxed transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-zinc-800 text-white placeholder-gray-400 border-zinc-700"
                : "bg-white text-zinc-900 placeholder-gray-500 border-zinc-300"
            }`}
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Color Scheme
          </label>
          <input
            type="text"
            value={requirements.colorScheme}
            onChange={(e) => handleInputChange("colorScheme", e.target.value)}
            placeholder="e.g., Blue and White, Dark Theme, Pastel Colors..."
            className={`w-full rounded-xl px-4 py-2 text-sm leading-relaxed transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-zinc-800 text-white placeholder-gray-400 border-zinc-700"
                : "bg-white text-zinc-900 placeholder-gray-500 border-zinc-300"
            }`}
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Additional Features
          </label>
          <textarea
            value={requirements.additionalFeatures}
            onChange={(e) =>
              handleInputChange("additionalFeatures", e.target.value)
            }
            placeholder="List any specific features or functionality you need..."
            className={`w-full rounded-xl px-4 py-2 text-sm leading-relaxed transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-zinc-800 text-white placeholder-gray-400 border-zinc-700"
                : "bg-white text-zinc-900 placeholder-gray-500 border-zinc-300"
            }`}
            rows={3}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={isGenerating || !requirements.generalDescription}
        className={`w-full py-3 rounded-xl transition-colors bg-blue-600 hover:bg-blue-700 text-white font-medium ${
          isGenerating
            ? "animate-glow cursor-not-allowed"
            : !requirements.generalDescription
            ? "opacity-70 cursor-not-allowed"
            : ""
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <FontAwesomeIcon
              icon={faSpinner}
              className="w-4 h-4 animate-spin"
            />
            Generating Website...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faWandSparkles} />
            Generate Website
          </span>
        )}
      </button>
    </div>
  );
};

export default Prompt;
