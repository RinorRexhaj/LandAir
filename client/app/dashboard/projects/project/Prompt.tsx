import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";
import { useProjectStore } from "@/app/store/useProjectsStore";
import useApi from "@/app/hooks/useApi";
import { Relevance } from "@/app/types/Relevance";
import Image from "next/image";
import { useCreditStore } from "@/app/store/useCreditStore";

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
  getUrl: () => void;
}

const Prompt: React.FC<PromptProps> = ({
  isGenerating,
  setIsGenerating,
  setProjectFile,
  getUrl,
}) => {
  const [requirements, setRequirements] = useState<WebsiteRequirements>({
    generalDescription: "",
    audienceType: "",
    colorScheme: "",
    additionalInfo: "",
  });
  const [enhancing, setEnhancing] = useState(false);
  const { selectedProject } = useProjectStore();
  const { get, post, put } = useApi();
  const { credits, setCredits } = useCreditStore();
  const { darkMode } = useThemeStore();
  const [result, setResult] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleInputChange = (
    field: keyof WebsiteRequirements,
    value: string
  ) => {
    setRequirements((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pollGenerationStatus = useCallback(
    async (taskId: string) => {
      if (result) return;
      try {
        const status: {
          type: string;
          updates: { _id: number; output: { output: { answer: string } } }[];
        } = await get("/api/relevance?taskId=" + taskId);
        return status;
      } catch (error) {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        throw error;
      }
    },
    [get, pollingInterval, result]
  );

  const handleSubmit = async () => {
    if (isGenerating || enhancing) return;
    if (credits < 3) return;

    setIsGenerating(true);

    try {
      const { credits }: { credits: number } = await put(`/api/credits`);
      setCredits(credits);
      const taskId: string = await post(`/api/relevance`, {
        prompt: requirements.generalDescription,
        type: "generate",
      });

      await startPolling(taskId);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  const startPolling = async (taskId: string) => {
    try {
      const status = await pollGenerationStatus(taskId);

      if (status?.type === "complete") {
        setResult(true);
        const filePath = `${selectedProject?.project_name}`;
        const content =
          status.updates[status.updates.length - 1]?.output.output.answer;

        await post(`/api/storage/`, { content, filePath });
        await put(`/api/projects/${selectedProject?.id}`, {
          new_name: selectedProject?.project_name,
        });
        getUrl();
        setProjectFile(true);
        setIsGenerating(false);
        return;
      }

      if (status?.type === "failed") {
        console.error("Generation failed");
        setIsGenerating(false);
        return;
      }

      // Wait 5s then recurse
      setTimeout(() => startPolling(taskId), 5000);
    } catch (error) {
      console.error("Polling error:", error);
      setIsGenerating(false);
    }
  };

  // Cleanup polling interval on component unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const enhanceDescription = async () => {
    if (isGenerating || enhancing) return;
    if (!requirements.generalDescription) return;
    setEnhancing(true);
    const enhanced: Relevance = await post(`/api/relevance`, {
      type: "enhance",
      prompt: requirements.generalDescription,
    });
    setRequirements({ ...requirements, generalDescription: enhanced.answer });
    setEnhancing(false);
  };

  return (
    <div
      className={`flex flex-col justify-between h-full w-full mx-auto ${
        darkMode
          ? "bg-zinc-900 border-zinc-600/80"
          : "bg-white border-zinc-600/20"
      } border rounded-lg shadow-md overflow-hidden animate-fade p-6`}
    >
      <div className="space-y-4">
        <div className="relative">
          <div className="w-full flex justify-between items-center mb-1">
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              } ${enhancing && "animate-glow"}`}
            >
              {enhancing ? "Enhancing..." : "General Description"}
            </label>
            <div className="bg-transparent tb:bg-zinc-900 tb:p-1.5 rounded-md tb:border tb:border-zinc-500/50 tb:absolute tb:top-6 tb:right-0">
              <button
                className={`px-2 py-1.5 bg-violet-700/80 hover:bg-violet-700 transition-colors rounded-md flex items-center justify-center text-gray-100 `}
                disabled={
                  !requirements.generalDescription || isGenerating || enhancing
                }
                onClick={enhanceDescription}
              >
                <FontAwesomeIcon
                  icon={faWandMagicSparkles}
                  className="w-4 h-4"
                  beatFade={enhancing}
                />
              </button>
            </div>
          </div>
          <textarea
            value={requirements.generalDescription}
            onChange={(e) =>
              handleInputChange("generalDescription", e.target.value)
            }
            required
            placeholder="Describe your website's purpose and main features..."
            className={`w-full rounded-lg px-4 py-2 text-sm leading-relaxed transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
            className={`w-full rounded-lg px-4 py-2 text-sm leading-relaxed transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
            className={`w-full rounded-lg px-4 py-2 text-sm leading-relaxed transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
            className={`w-full rounded-lg px-4 py-2 text-sm leading-relaxed transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
        disabled={
          isGenerating || !requirements.generalDescription || credits < 3
        }
        title={
          credits < 3
            ? "Not enough credits"
            : !requirements.generalDescription
            ? "General Description is required"
            : ""
        }
        className={`w-full py-3 rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 text-white font-medium ${
          isGenerating
            ? "animate-glow cursor-not-allowed"
            : !requirements.generalDescription || credits < 3
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
            Generate Website{" "}
            <span className="flex gap-1">
              (3{" "}
              <Image
                src={"credit.svg"}
                alt="Credits"
                width={16}
                height={16}
                className="-mr-1 mt-0.5"
              />
              )
            </span>
          </span>
        )}
      </button>
    </div>
  );
};

export default Prompt;
