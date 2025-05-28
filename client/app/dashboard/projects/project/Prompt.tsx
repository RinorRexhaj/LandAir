import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";
import useApi from "@/app/hooks/useApi";
import { useTimeAgo } from "@/app/hooks/useTimeAgo";

interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: string;
  status: "completed" | "failed" | "generating";
}

interface PromptProps {
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const Prompt: React.FC<PromptProps> = ({ isGenerating, setIsGenerating }) => {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const { darkMode } = useThemeStore();
  const { post } = useApi();
  const { formatTime } = useTimeAgo();
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_CHARS = 500;

  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating) return;

    const newPrompt: PromptHistory = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      timestamp: new Date().toISOString(),
      status: "generating",
    };

    setHistory((prev) => [...prev, newPrompt]);
    setPrompt("");
    setIsGenerating(true);

    try {
      //   await post("/api/generate", { prompt: newPrompt.prompt });

      setHistory((prev) =>
        prev.map((p) =>
          p.id === newPrompt.id ? { ...p, status: "completed" } : p
        )
      );
    } catch (error) {
      console.error(error);
      setHistory((prev) =>
        prev.map((p) =>
          p.id === newPrompt.id ? { ...p, status: "failed" } : p
        )
      );
    } finally {
      setTimeout(() => setIsGenerating(false), 5000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`flex flex-col min-h-full w-full mx-auto ${
        darkMode ? "bg-zinc-900" : "bg-white"
      } border border-zinc-600/80 rounded-xl shadow-md overflow-hidden`}
    >
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((item) => (
          <div key={item.id} className="flex justify-end">
            <div
              className={`max-w-xs rounded-2xl px-4 py-2 relative ${
                darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{item.prompt}</p>
              <div className="flex items-center gap-2 text-xs mt-1 text-white/80">
                <span>{formatTime(new Date(item.timestamp))}</span>
                {item.status === "generating" && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="w-3 h-3 animate-spin"
                  />
                )}
                {item.status === "failed" && (
                  <span className="text-red-300">Failed</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div
              className={`max-w-xs rounded-2xl px-4 py-2 ${
                darkMode
                  ? "bg-zinc-700 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              } animate-pulse`}
            >
              <p className="text-sm">Generating...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        className={`p-4 border-t ${
          darkMode
            ? "border-zinc-800 bg-zinc-900"
            : "bg-zinc-50 border-zinc-200"
        }`}
      >
        <div className="flex gap-2 items-end">
          <input
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className={`flex-grow max-h-10 resize-none rounded-xl px-4 py-2 text-sm leading-relaxed transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-zinc-800 text-white placeholder-gray-400 border-zinc-700"
                : "bg-white text-zinc-900 placeholder-gray-500 border-zinc-300"
            }`}
          />
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isGenerating}
            className={`p-2 h-10 w-10 flex items-center justify-center rounded-xl transition-colors ${
              !prompt.trim() || isGenerating
                ? darkMode
                  ? "bg-zinc-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isGenerating ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className="w-4 h-4 animate-spin"
              />
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
