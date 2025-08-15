import { useThemeStore } from "@/app/store/useThemeStore";
import React from "react";
import ReactMarkdown from "react-markdown";

const BotMessage: React.FC<{ message: string }> = ({ message }) => {
  const { darkMode } = useThemeStore();
  if (!message) return;
  return (
    <div className="w-full flex items-start gap-0">
      <div
        className={`flex-1 w-full rounded-xl px-2 ${
          darkMode ? "bg-zinc-800/50" : "bg-zinc-50"
        } shadow-sm`}
      >
        <div
          className={`prose animate-fadeFast [animation-fill-mode:backwards] prose-sm max-w-none ${
            darkMode ? "prose-invert" : ""
          } [&>*]:my-0 [&>*]:py-0 [&>ul]:mt-2 [&>ol]:mt-2 [&>li]:mt-1 [&>p]:mb-2 [&>p]:last:mb-0 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-3 [&>h1]:mt-4 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-2 [&>h2]:mt-4 [&>h3]:text-sm [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:mt-4 [&>blockquote]:border-l-4 [&>blockquote]:border-zinc-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-zinc-600 [&>blockquote]:dark:text-zinc-400 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-1 [&>code]:bg-zinc-100 [&>code]:dark:bg-zinc-700 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>pre]:bg-zinc-900 [&>pre]:text-zinc-100 [&>pre]:p-3 [&>pre]:rounded-lg [&>pre_code]:bg-transparent [&>pre_code]:p-0`}
        >
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BotMessage;
