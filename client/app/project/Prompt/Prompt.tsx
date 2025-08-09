import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRotateRight,
  faArrowUp,
  faSpinner,
  faWandMagicSparkles,
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
// import { takeScreenshot } from "@/app/utils/Screenshot";
import {
  // ChangeOutput,
  Enhancement,
  // RelevanceOutput,
  // ToolOutput,
} from "@/app/types/Relevance";
// import makeChanges from "@/app/utils/Changes";
import { ElementPos } from "@/app/types/Element";
import Image from "next/image";
import { useCompletion } from "@ai-sdk/react";
// import useAuth from "@/app/hooks/useAuth";
import { supabase } from "@/app/utils/Supabase";
import useGenerate from "@/app/hooks/useGenerate";
// import useUnsplash from "@/app/hooks/useUnsplash";

interface PromptProps {
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  setProjectFile: (file: boolean) => void;
  getUrl: () => Promise<void>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  selectedElement: ElementPos | null;
}

const Prompt: React.FC<PromptProps> = ({
  isGenerating,
  setIsGenerating,
  // setProjectFile,
  // getUrl,
  // iframeRef,
  selectedElement,
}) => {
  // const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // const [result, setResult] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const { get, post } = useApi();
  const { selectedProject } = useProjectStore();
  const { darkMode } = useThemeStore();
  const { credits } = useCreditStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskType, setTaskType] = useState("generate");
  const [changing, setChanging] = useState(false);
  const toast = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const { enhanceImages } = useUnsplash();
  const [lastFailedInput, setLastFailedInput] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { generateWebsite } = useGenerate();
  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: "/api/prompt",
    body: {
      type: taskType,
    },
    headers: { Authorization: `Bearer ${token}` },
  });

  // Get the Supabase access token on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const accessToken = data?.session?.access_token;
      if (accessToken) {
        setToken(accessToken);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedProject?.id) {
      setMessages([]);
      return;
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
  }, [selectedProject?.id, get]);

  // Helper function to auto-resize textarea
  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleFormSubmit(); // Submit form
    }
  };

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

  const handleFormSubmit = async () => {
    textareaRef.current?.blur();
    if (!input || isGenerating || credits < 3 || !selectedProject) return;

    setIsGenerating(true);
    const taskType = "start";
    setTaskType(taskType);
    setInput("");
    setLastFailedInput(null);

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: true,
      message: input,
      projectId: String(selectedProject.id),
    };

    // Add user message + placeholder bot message
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: Date.now() + 10,
        sender: false,
        message: "",
        projectId: String(selectedProject.id),
      },
    ]);

    try {
      await post(`/api/chat`, userMessage); // save user msg
      handleSubmit(); // start streaming
      generateWebsite(input);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start generation");
      setIsGenerating(false);
      setChanging(false);

      const lastMsg = messages[messages.length - 1];
      setLastFailedInput(lastMsg.id);
    } finally {
      setIsGenerating(false);
    }
  };

  // Keep placeholder updated with live text
  useEffect(() => {
    if (!messages.length || taskType === "generate") return;
    setMessages((prev) =>
      prev.map((m, i) =>
        i === prev.length - 1 && !m.sender ? { ...m, message: completion } : m
      )
    );
  }, [completion, messages.length, taskType]);

  // When streaming ends, freeze and save
  useEffect(() => {
    if (!isLoading && completion) {
      if (taskType !== "generate") {
        const finalText = String(completion);
        const finalMsg = {
          id: Date.now() + 20,
          sender: false,
          message: finalText,
          projectId: String(selectedProject?.id),
        };

        // Update message to frozen text
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 && !m.sender
              ? { ...m, message: finalText }
              : m
          )
        );

        // Save bot message
        post(`/api/chat`, finalMsg).catch(console.error);
      }
    }
  }, [isLoading, completion, selectedProject?.id, post, taskType]);

  // Auto-resize textarea whenever input changes
  useEffect(() => {
    resizeTextarea();
  }, [input]);

  const enhanceLastMessage = async () => {
    if (enhancing || isGenerating) return;

    setEnhancing(true);

    try {
      const enhanced: Enhancement = await post(`/api/relevance`, {
        type: "enhance",
        prompt: input,
      });

      setInput(enhanced.answer);
      // resizeTextarea(); // Remove direct call
    } catch (err) {
      console.error(err);
      toast.error("Failed to enhance description");
    } finally {
      setEnhancing(false);
    }
  };

  // const handleRetry = () => {
  //   if (lastFailedInput) {
  //     const lastMsg: ChatMessage = messages[messages.length - 1];
  //     setLastFailedInput(lastMsg.id); // Set for retry
  //   }
  // };

  return (
    <div
      className={`h-full sm:-mt-1.5 flex flex-col justify-between w-full mx-auto p-2 rounded-md overflow-hidden animate-fade ${
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
            <div className="w-full">
              <BotMessage
                message={
                  "Welcome to your project! Ask us to build your website. Please provide as many details as it helps in generating better websites."
                }
              />
            </div>
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
                {lastFailedInput === msg.id && (
                  <FontAwesomeIcon icon={faArrowRotateRight} />
                )}
                {msg.message}
              </div>
            ) : (
              // Bot message - LLM response style
              <BotMessage message={msg.message} />
            )}
          </div>
        ))}
        {(isGenerating || changing || isLoading) && (
          <div className="relative flex items-center gap-2 text-sm top-2 left-2 text-zinc-500 dark:text-zinc-400">
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
            handleFormSubmit();
          }}
          className="flex flex-col items-center flex-1"
        >
          <textarea
            ref={textareaRef}
            value={input}
            rows={2}
            maxLength={2000}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              !selectedProject?.file
                ? "Describe your website idea..."
                : "Describe the changes clearly. Use the selector to highlight the section you want changed..."
            }
            className={`w-full h-auto max-h-32 overflow-y-auto mb-2 bg-inherit p-1 text-sm resize-none minimal-scrollbar focus:outline-none placeholder-gray-400 ${
              darkMode ? "text-white" : "text-zinc-900"
            } ${enhancing && "animate-glow"}`}
          />

          <div className="w-full flex items-center gap-0 justify-between">
            <div className="flex">
              <div className="bg-zinc-600  p-2 text-xs rounded-lg font-semibold flex items-center gap-0.5 text-zinc-300">
                <p className="text-sm">3</p>
                <Image
                  src={"/img/credit.svg"}
                  alt="Credits"
                  height={14}
                  width={14}
                />
              </div>{" "}
              {selectedElement && (
                <div className="py-2 px-3 ml-1.5 min-w-10 rounded-lg bg-zinc-900/80 outline outline-1 outline-zinc-600 text-sm font-semibold flex items-center justify-center text-zinc-300 lowercase">
                  {selectedElement?.element.tagName}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="ml-1.5 px-2.5 py-1.5 rounded-lg  bg-inherit text-white disabled:opacity-60"
                disabled={
                  !input ||
                  input.length < 10 ||
                  isGenerating ||
                  enhancing ||
                  changing
                }
                title={"Enhance"}
                onClick={enhanceLastMessage}
              >
                <FontAwesomeIcon
                  icon={faWandMagicSparkles}
                  className={`${enhancing && "animate-pulse"} ${
                    !darkMode && "text-zinc-900"
                  }`}
                />
              </button>
              <button
                type="submit"
                className="ml-1.5 px-3 py-1.5 rounded-lg outline outline-zinc-600 bg-zinc-900 text-white disabled:opacity-60"
                disabled={
                  !input || isGenerating || enhancing || changing || credits < 3
                }
                title={credits < 3 ? "Not enough credits" : "Generate"}
              >
                {isGenerating ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faArrowUp} />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Prompt;
