import React, { useState, useCallback, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faPaperPlane,
  faSpinner,
  // faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import { useCreditStore } from "@/app/store/useCreditStore";
import useApi from "@/app/hooks/useApi";
import useToast from "@/app/hooks/useToast";
// import { Relevance } from "@/app/types/Relevance";
import { ChatMessage } from "@/app/types/Chat";
import SkeletonChatBubble from "./SkeletonChat";
import BotMessage from "./BotMessage";
import { takeScreenshot } from "@/app/utils/Screenshot";
import { Relevance, ToolOutput } from "@/app/types/Relevance";
// import useUnsplash from "@/app/hooks/useUnsplash";

interface PromptProps {
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  setProjectFile: (file: boolean) => void;
  getUrl: () => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

const Prompt: React.FC<PromptProps> = ({
  isGenerating,
  setIsGenerating,
  setProjectFile,
  getUrl,
  iframeRef,
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // const [result, setResult] = useState(false);
  // const [enhancing, setEnhancing] = useState(false);
  const { get, post, put } = useApi();
  const { selectedProject, changeProject } = useProjectStore();
  const { darkMode } = useThemeStore();
  const { credits, setCredits } = useCreditStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskType, setTaskType] = useState("generate");
  const [changing, setChanging] = useState(false);
  const toast = useToast();
  // const { enhanceImages } = useUnsplash();

  useEffect(() => {
    if (!selectedProject) {
      setMessages([]);
      return;
    }
    if (selectedProject.file) {
      setTaskType("changes");
    }
    (async () => {
      setLoading(true);
      try {
        const msgs: ChatMessage[] = await get(
          `/api/chat?projectId=${selectedProject.id}`
        );
        setMessages(msgs);
        setLoading(false);
      } catch {
        setMessages([]);
        setLoading(false);
      }
    })();
  }, [selectedProject, get]);

  const pollGenerationStatus = useCallback(
    async (taskId: string) => {
      try {
        const status: Relevance = await get(
          `/api/relevance?taskId=${taskId}&type=${taskType}`
        );
        return status;
      } catch (error) {
        toast.error("Failed to poll generation status");
        throw error;
      }
    },
    [get, toast, taskType]
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 50;

    setShowScrollButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const updateScreenshot = async () => {
    // Wait until iframeRef.current is available
    await waitForIframe();

    const iframe = iframeRef.current;
    if (!iframe) return;

    const screenshot = await takeScreenshot(iframe);
    if (screenshot) {
      const screenshotData = new FormData();
      screenshotData.append("content", screenshot);
      screenshotData.append(
        "filePath",
        `${selectedProject?.id}/screenshot.png`
      );
      screenshotData.append("type", "image");

      await post(`/api/storage/`, screenshotData);
    }
  };

  // Helper function to wait asynchronously for iframeRef to be set
  const waitForIframe = () => {
    return new Promise<void>((resolve) => {
      if (iframeRef.current) return resolve();

      const checkInterval = setInterval(() => {
        if (iframeRef.current) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100); // Check every 100ms
    });
  };

  const handleSubmit = async () => {
    if (!input || isGenerating || credits < 3 || !selectedProject) return;

    const taskType = messages.length <= 0 ? "generate" : "changes";
    setTaskType(taskType);
    setInput("");
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
    if (taskType === "generate") {
      setIsGenerating(true);
    } else {
      setChanging(true);
    }

    try {
      // Save user message to DB
      await post(`/api/chat`, {
        sender: true,
        message: input,
        projectId: String(selectedProject.id),
      });

      const taskId: string = await post(`/api/relevance`, {
        prompt: input,
        type: taskType,
        code: taskType === "changes" ? selectedProject.file : "",
      });
      await startPolling(taskId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start generation");
      setIsGenerating(false);
      setChanging(false);
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
        if (selectedProject)
          changeProject({
            ...selectedProject,
            id: selectedProject?.id,
            last_edited: new Date(),
          });

        const rawOutput =
          status.updates[status.updates.length - 1]?.output.output;

        let code: string | { selector: string; code: string }[] = "";
        let summary = "";

        if (taskType === "generate") {
          if (
            !rawOutput ||
            typeof rawOutput !== "object" ||
            "output" in rawOutput
          ) {
            toast.error("Expected string answer for generation.");
            setIsGenerating(false);
            setChanging(false);
            return;
          }

          code = rawOutput.answer;

          const generationSummary: { answer: string } = await post(
            `/api/relevance`,
            {
              type: "summary",
              code,
            }
          );

          summary = generationSummary.answer;
        } else if (taskType === "changes") {
          if (isStructuredOutput(rawOutput)) {
            const newCode = rawOutput.output.code;
            console.log(newCode);
            summary = rawOutput.output.summary;
          } else {
            toast.error("Expected structured output with code and summary.");
            setIsGenerating(false);
            setChanging(false);
            return;
          }
        }

        // Add bot message to DB and UI
        const botMsg: ChatMessage = {
          id: Date.now() + 1,
          sender: false,
          message: summary,
          projectId: String(selectedProject?.id || ""),
        };
        setMessages((prev) => [...prev, botMsg]);
        await post(`/api/chat`, botMsg);

        const filePath = `${selectedProject?.id}`;
        const formData = new FormData();
        if (taskType === "generate") {
          formData.append("content", code);
          formData.append("filePath", filePath);
          formData.append("type", "html");

          await post("/api/storage/", formData);
        }
        await put(`/api/projects/${selectedProject?.id}`, {
          new_name: selectedProject?.project_name,
        });

        getUrl();
        setCredits(updatedCredits);
        toast.success("Website Generated!");
        setProjectFile(true);
        setIsGenerating(false);
        setChanging(false);
        await updateScreenshot();
      } else if (status?.type === "failed") {
        toast.error("Generation failed!");
        setIsGenerating(false);
        setChanging(false);
      } else {
        setTimeout(() => startPolling(taskId), 4000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Polling failed!");
      setIsGenerating(false);
    }
  };

  function isStructuredOutput(
    res: ToolOutput
  ): res is {
    output: { code: { selector: string; code: string }[]; summary: string };
  } {
    return typeof res === "object" && res !== null && "output" in res;
  }

  // const enhanceLastMessage = async () => {
  //   if (enhancing || isGenerating) return;

  //   setEnhancing(true);

  //   try {
  //     const enhanced: Relevance = await post(`/api/relevance`, {
  //       type: "enhance",
  //       prompt: input,
  //     });

  //     const newMsg: ChatMessage = {
  //       id: Date.now() + 2,
  //       sender: true,
  //       message: enhanced.answer,
  //       projectId: String(selectedProject?.id || ""),
  //     };
  //     setMessages((prev) => [...prev, newMsg]);
  //     await post(`/api/chat`, newMsg);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to enhance description");
  //   } finally {
  //     setEnhancing(false);
  //   }
  // };

  return (
    <div
      className={`h-full flex flex-col justify-between w-full mx-auto p-2 rounded-md overflow-hidden animate-fade ${
        darkMode ? "bg-zinc-800" : ""
      }`}
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-8 minimal-scrollbar pr-2"
        style={{
          height: "calc(100% - 100px)",
        }}
      >
        {messages.length === 0 ? (
          loading && !isGenerating ? (
            <>
              <SkeletonChatBubble sender={true} />
              <SkeletonChatBubble sender={false} />
              <SkeletonChatBubble sender={true} />
            </>
          ) : (
            <BotMessage
              message={
                "Welcome to your project! Ask us to build your website. Please provide as many details as it helps in generating better websites."
              }
            />
          )
        ) : (
          ""
        )}
        {messages.map((msg, i) => (
          <div
            key={String(msg.id) || String(i)}
            className={`animate-fade [animation-fill-mode:backwards] ${
              msg.sender ? `flex justify-end mb-4` : `flex justify-start mb-6`
            }`}
            style={{ animationDelay: i * 0.1 + "s" }}
          >
            {msg.sender ? (
              // User message - Chat bubble style
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                  darkMode
                    ? "bg-zinc-700 text-white"
                    : "bg-zinc-200/70 text-zinc-900"
                } shadow-sm`}
              >
                {msg.message}
              </div>
            ) : (
              // Bot message - LLM response style
              <BotMessage message={msg.message} />
            )}
          </div>
        ))}
        {(isGenerating || changing) && (
          <div className="relative flex items-center gap-2 text-sm top-2 text-zinc-500 dark:text-zinc-400">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin w-4 h-4"
            />
            {"Generating..."}
          </div>
        )}
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className={`fixed bottom-36 mb-2 mx-auto p-2 h-8 w-8 flex items-center justify-center rounded-full shadow-lg  ${
            darkMode
              ? "bg-zinc-700 text-white hover:bg-zinc-700 border border-zinc-500"
              : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
          } transition animate-fadeFast`}
          title="Scroll to bottom"
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      )}

      <div
        className={`w-full flex gap-4 px-2 py-1 border rounded-lg mt-6 ${
          darkMode ? "bg-zinc-700 border-zinc-700" : "bg-white border-zinc-300"
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
            rows={3}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your website idea..."
            className={`w-full h-fit bg-inherit p-1 text-sm resize-none focus:outline-none placeholder-gray-400 ${
              darkMode ? "text-white" : "text-zinc-900"
            }`}
          />
          <div className="w-full flex items-center gap-0 justify-between">
            <p className="ml-1 mt-4 text-xs flex items-center text-zinc-500">
              {input.length}/500
            </p>
            <div className="flex items-center">
              <p className="mt-4 flex items-center text-zinc-300">(3 C)</p>
              <button
                type="submit"
                className="ml-2 px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                disabled={!input || isGenerating || changing || credits < 3}
                title={credits < 3 ? "Not enough credits" : "Generate"}
              >
                {isGenerating ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} />
                )}
              </button>
              {/* <button
                onClick={(e) => {
                  e.preventDefault();
                  enhanceLastMessage();
                }}
                disabled={enhancing || isGenerating || !input}
                className="ml-2 px-3 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60"
                title="Enhance"
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} />
              </button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Prompt;
