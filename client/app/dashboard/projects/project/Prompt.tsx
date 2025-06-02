import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";
import { useProjectStore } from "@/app/store/useProjectsStore";
import useAuth from "@/app/hooks/useAuth";
import { enhancePrompt, generateWebsite } from "@/app/services/AIService";
import { uploadFile } from "@/app/services/StorageService";

interface WebsiteRequirements {
  generalDescription: string;
  audienceType: string;
  colorScheme: string;
  additionalInfo: string;
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
    additionalInfo: "",
  });
  const [enhancing, setEnhancing] = useState(false);
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
      const content = await generateWebsite(requirements.generalDescription);
      const filePath = `${user?.id}/${selectedProject?.project_name}`;
      await uploadFile(content, filePath);
      setSelectedProject(selectedProject);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
      setProjectFile(true);
    }
  };

  const enhanceDescription = async () => {
    if (!requirements.generalDescription) return;
    setEnhancing(true);
    const enhanced = await enhancePrompt(requirements.generalDescription);
    setRequirements({ ...requirements, generalDescription: enhanced.answer });
    setEnhancing(false);
  };

  return (
    <div
      className={`flex flex-col justify-between h-full w-full mx-auto ${
        darkMode
          ? "bg-zinc-900 border-zinc-600/80"
          : "bg-white border-zinc-600/20"
      } border rounded-xl shadow-md overflow-hidden animate-fade p-6`}
    >
      <div className="space-y-4">
        <div>
          <div className="w-full flex justify-between items-center mb-1">
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              } ${enhancing && "animate-glow"}`}
            >
              {enhancing ? "Enhancing..." : "General Description"}
            </label>
            <button
              className={`p-2 bg-violet-700/80 hover:bg-violet-700 transition-colors rounded-md flex items-center justify-center text-gray-100`}
              disabled={!requirements.generalDescription || isGenerating}
              onClick={enhanceDescription}
            >
              <FontAwesomeIcon
                icon={faWandMagicSparkles}
                className="w-4 h-4"
                beatFade={enhancing}
              />
            </button>
          </div>
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
            } ${enhancing && "animate-glow"}`}
            rows={5}
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-1 ${
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
            className={`block text-sm font-medium mb-1 ${
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
            className={`block text-sm font-medium mb-1 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Additional Info
          </label>
          <textarea
            value={requirements.additionalInfo}
            onChange={(e) =>
              handleInputChange("additionalInfo", e.target.value)
            }
            placeholder="List any contact or other info..."
            className={`w-full rounded-xl px-4 py-2 text-sm leading-relaxed transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-zinc-800 text-white placeholder-gray-400 border-zinc-700"
                : "bg-white text-zinc-900 placeholder-gray-500 border-zinc-300"
            }`}
            rows={2}
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
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Generate Website
          </span>
        )}
      </button>
    </div>
  );
};

export default Prompt;
