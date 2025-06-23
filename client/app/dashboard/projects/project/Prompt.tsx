import React, { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faSpinner,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import { useCreditStore } from "@/app/store/useCreditStore";
import useApi from "@/app/hooks/useApi";
import useToast from "@/app/hooks/useToast";
import { Relevance } from "@/app/types/Relevance";
import { ChatMessage } from "@/app/types/Chat";

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
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // const [result, setResult] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const { get, post, put } = useApi();
  const { selectedProject, changeProject } = useProjectStore();
  const { darkMode } = useThemeStore();
  const { credits, setCredits } = useCreditStore();
  const toast = useToast();

  useEffect(() => {
    if (!selectedProject) {
      setMessages([]);
      return;
    }
    (async () => {
      try {
        const msgs: ChatMessage[] = await get(
          `/api/chat?projectId=${selectedProject.id}`
        );
        setMessages(msgs);
      } catch {
        setMessages([]);
      }
    })();
  }, [selectedProject, get]);

  const pollGenerationStatus = useCallback(
    async (taskId: string) => {
      try {
        const status: {
          type: string;
          updates: { _id: number; output: { output: { answer: string } } }[];
        } = await get("/api/relevance?taskId=" + taskId);
        return status;
      } catch (error) {
        toast.error("Failed to poll generation status");
        throw error;
      }
    },
    [get, toast]
  );

  const handleSubmit = async () => {
    if (!input || isGenerating || enhancing || credits < 3 || !selectedProject)
      return;

    // Optimistically add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: true,
        message: input,
        projectId: String(selectedProject.id),
      },
    ]);
    setIsGenerating(true);

    try {
      // Save user message to DB
      await post(`/api/chat`, {
        sender: true,
        message: input,
        projectId: String(selectedProject.id),
      });

      const taskId: string = await post(`/api/relevance`, {
        prompt: input,
        type: "generate",
      });
      await startPolling(taskId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start generation");
      setIsGenerating(false);
    }

    setInput("");
  };

  const startPolling = async (taskId: string) => {
    try {
      const status = await pollGenerationStatus(taskId);

      if (status?.type === "complete") {
        // setResult(true);
        const { credits: updatedCredits }: { credits: number } = await put(
          `/api/credits`
        );
        setCredits(updatedCredits);
        toast.success("Website Generated!");
        setIsGenerating(false);
        if (selectedProject)
          changeProject({
            ...selectedProject,
            id: selectedProject?.id,
            last_edited: new Date(),
          });

        const content =
          status.updates[status.updates.length - 1]?.output.output.answer;
        // Add bot message to DB and UI
        const botMsg: ChatMessage = {
          id: Date.now() + 1,
          sender: false,
          message:
            "The website has been generated successfully! We hope it's to your liking. If you need any changes, don't hesitate to ask!",
          projectId: String(selectedProject?.id || ""),
        };
        setMessages((prev) => [...prev, botMsg]);
        await post(`/api/chat`, botMsg);

        const filePath = `${selectedProject?.project_name}`;
        const formData = new FormData();
        formData.append("content", content);
        formData.append("filePath", filePath);
        formData.append("type", "html");

        await post("/api/storage/", formData);
        await put(`/api/projects/${selectedProject?.id}`, {
          new_name: selectedProject?.project_name,
        });

        getUrl();
        setProjectFile(true);
      } else if (status?.type === "failed") {
        toast.error("Generation failed!");
        setIsGenerating(false);
      } else {
        setTimeout(() => startPolling(taskId), 4000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Polling failed!");
      setIsGenerating(false);
    }
  };

  const enhanceLastMessage = async () => {
    if (enhancing || isGenerating || !messages.length) return;

    const last = messages[messages.length - 1];
    if (!last.sender) return;

    setEnhancing(true);

    try {
      const enhanced: Relevance = await post(`/api/relevance`, {
        type: "enhance",
        prompt: last.message,
      });

      const botMsg: ChatMessage = {
        id: Date.now() + 2,
        sender: false,
        message: `✨ Enhanced Idea: ${enhanced.answer}`,
        projectId: String(selectedProject?.id || ""),
      };
      setMessages((prev) => [...prev, botMsg]);
      await post(`/api/chat`, botMsg);
    } catch (err) {
      console.error(err);
      toast.error("Failed to enhance description");
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div
      className={`flex flex-col justify-between h-full w-full mx-auto border rounded-lg shadow-md overflow-hidden animate-fade p-4 ${
        darkMode ? "bg-zinc-900 border-zinc-600/80" : "bg-white border-zinc-200"
      }`}
    >
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 max-h-[60vh]">
        {messages.map((msg, i) => (
          <div
            key={String(msg.id) || String(i)}
            className={`px-4 py-2 rounded-xl max-w-[80%] w-fit text-sm whitespace-pre-wrap animate-fade [animation-fill-mode:backwards] ${
              msg.sender
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white self-start mr-auto"
            }`}
            style={{ animationDelay: i * 0.1 + "s" }}
          >
            {msg.message}
          </div>
        ))}
        {(isGenerating || enhancing) && (
          <div className="relative flex items-center gap-2 text-sm top-2 text-zinc-500 dark:text-zinc-400">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin w-4 h-4"
            />
            {enhancing ? "Enhancing..." : "Generating..."}
          </div>
        )}
      </div>

      <div
        className={`w-full flex gap-4 p-2 border rounded-lg mt-2 ${
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-300"
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col items-center flex-1"
        >
          <textarea
            value={input}
            rows={2}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your website idea..."
            className={`w-full bg-transparent px-2 py-2 text-sm focus:outline-none placeholder-gray-400 ${
              darkMode ? "text-white" : "text-zinc-900"
            }`}
          />
          <div className="w-full flex items-center gap-0 justify-between">
            <p className="ml-2 flex items-center text-zinc-500">
              {input.length}/500
            </p>
            <div>
              <button
                type="submit"
                className="ml-2 px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                disabled={!input || isGenerating || credits < 3}
                title={credits < 3 ? "Not enough credits" : "Generate"}
              >
                {isGenerating ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} />
                )}
              </button>
              <button
                onClick={enhanceLastMessage}
                disabled={enhancing || isGenerating || !input}
                className="ml-2 px-3 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60"
                title="Enhance"
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Prompt;
