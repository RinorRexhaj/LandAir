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
import ReactMarkdown from "react-markdown";
import Image from "next/image";

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
  // const [enhancing, setEnhancing] = useState(false);
  const { get, post, put } = useApi();
  const { selectedProject, changeProject } = useProjectStore();
  const { darkMode } = useThemeStore();
  const { credits, setCredits } = useCreditStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [taskType, setTaskType] = useState("generate");
  const [changing, setChanging] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!selectedProject) {
      setMessages([]);
      return;
    }
    if (selectedProject.file) {
      setTaskType("changes");
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
          updates: {
            _id: number;
            output: {
              output: { answer: string | { code: string; summary: string } };
            };
          }[];
        } = await get(`/api/relevance?taskId=${taskId}&type=${taskType}`);
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

        let content =
          status.updates[status.updates.length - 1]?.output.output.answer;

        let summary;

        if (taskType === "generate") {
          const generationSummary: { answer: string } = await post(
            `/api/relevance`,
            {
              type: "summary",
              code: typeof content === "string" ? content : content?.code || "",
            }
          );
          summary = generationSummary.answer;
          content = typeof content === "string" ? content : content?.code || "";
        } else {
          console.log(content);
          if (typeof content === "object" && content !== null) {
            summary = content.summary;
            content = content.code;
          } else {
            toast.error("Expected an object with 'code' and 'summary'");
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
        formData.append("content", content);
        formData.append("filePath", filePath);
        formData.append("type", "html");

        await post("/api/storage/", formData);
        await put(`/api/projects/${selectedProject?.id}`, {
          new_name: selectedProject?.project_name,
        });

        getUrl();
        setCredits(updatedCredits);
        toast.success("Website Generated!");
        setProjectFile(true);
        setIsGenerating(false);
        setChanging(false);
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
        {messages.map((msg, i) => (
          <div
            key={String(msg.id) || String(i)}
            className={`py-2 rounded-xl text-sm whitespace-pre-wrap animate-fade [animation-fill-mode:backwards] ${
              msg.sender
                ? `px-4 ${
                    darkMode
                      ? "bg-zinc-700 text-white"
                      : "bg-zinc-200/70 text-zinc-900"
                  } self-end ml-auto max-w-[80%] w-fit`
                : `w-full px-1 left-0 flex gap-4 bg-transparent self-start ${
                    darkMode ? "text-white" : "text-zinc-900"
                  }`
            }`}
            style={{ animationDelay: i * 0.1 + "s" }}
          >
            {!msg.sender && (
              <Image
                src={`/icons${!darkMode ? "-dark" : ""}/favicon-120x120.png`}
                alt="LandAir"
                width={32}
                height={32}
                className="h-8 animate-fade [animation-fill-mode:backwards]"
                style={{
                  animationDelay: "0.25s",
                }}
              />
            )}
            {msg.sender ? (
              msg.message
            ) : (
              <div
                className={`prose prose-sm leading-snug ${
                  darkMode ? "prose-invert" : ""
                } [&>*]:my-0 [&>*]:py-0 [&>ul]:-mt-6 [&>ol]:-mt-6 [&>li]:-mt-4 max-w-none`}
              >
                <ReactMarkdown
                  components={{
                    code({ className, children, ...props }) {
                      const isInline = !className;

                      return (
                        <code
                          className={`bg-zinc-800 text-white rounded ${
                            isInline ? "inline" : "block"
                          }`}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.message}
                </ReactMarkdown>
              </div>
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
            className={`w-full bg-inherit p-1 text-sm resize-none focus:outline-none placeholder-gray-400 ${
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
