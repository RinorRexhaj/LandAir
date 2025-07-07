import { useThemeStore } from "@/app/store/useThemeStore";
import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";

const BotMessage: React.FC<{ message: string }> = ({ message }) => {
  const { darkMode } = useThemeStore();
  return (
    <div className="w-full flex gap-3">
      <Image
        src={`/icons${!darkMode ? "-dark" : ""}/favicon-120x120.png`}
        alt="LandAir"
        width={32}
        height={32}
        className="h-8 w-8 flex-shrink-0 animate-fade [animation-fill-mode:backwards]"
        style={{
          animationDelay: "0.25s",
        }}
      />
      <div
        className={`flex-1 max-w-[85%] rounded-xl px-4 ${
          darkMode ? "bg-zinc-800/50" : "bg-zinc-50"
        } shadow-sm`}
      >
        <div
          className={`prose prose-sm max-w-none ${
            darkMode ? "prose-invert" : ""
          } [&>*]:my-0 [&>*]:py-0 [&>ul]:mt-2 [&>ol]:mt-2 [&>li]:mt-1 [&>p]:mb-2 [&>p]:last:mb-0 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-3 [&>h1]:mt-4 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-2 [&>h2]:mt-4 [&>h3]:text-sm [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:mt-4 [&>blockquote]:border-l-4 [&>blockquote]:border-zinc-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-zinc-600 [&>blockquote]:dark:text-zinc-400 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-1 [&>code]:bg-zinc-100 [&>code]:dark:bg-zinc-700 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>pre]:bg-zinc-900 [&>pre]:text-zinc-100 [&>pre]:p-3 [&>pre]:rounded-lg [&>pre_code]:bg-transparent [&>pre_code]:p-0`}
        >
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const isInline = !className;
                return (
                  <code
                    className={`${
                      isInline
                        ? `${
                            darkMode
                              ? "bg-zinc-700 text-zinc-100"
                              : "bg-zinc-100 text-zinc-800"
                          } px-1.5 py-0.5 rounded text-xs font-mono`
                        : "block bg-zinc-900 text-zinc-100 p-3 rounded-lg overflow-x-auto text-xs font-mono"
                    }`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              h1: ({ children, ...props }) => (
                <h1
                  className={`text-lg font-bold mb-3 mt-4 ${
                    darkMode ? "text-white" : "text-zinc-900"
                  }`}
                  {...props}
                >
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2
                  className={`text-base font-semibold mb-2 mt-4 ${
                    darkMode ? "text-white" : "text-zinc-900"
                  }`}
                  {...props}
                >
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3
                  className={`text-sm font-medium mb-2 mt-4 ${
                    darkMode ? "text-white" : "text-zinc-900"
                  }`}
                  {...props}
                >
                  {children}
                </h3>
              ),
              ul: ({ children, ...props }) => (
                <ul
                  className={`list-disc pl-5 mt-2 mb-2 ${
                    darkMode ? "text-zinc-200" : "text-zinc-700"
                  }`}
                  {...props}
                >
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol
                  className={`list-decimal pl-5 mt-2 mb-2 ${
                    darkMode ? "text-zinc-200" : "text-zinc-700"
                  }`}
                  {...props}
                >
                  {children}
                </ol>
              ),
              li: ({ children, ...props }) => (
                <li
                  className={`mb-1 ${
                    darkMode ? "text-zinc-200" : "text-zinc-700"
                  }`}
                  {...props}
                >
                  {children}
                </li>
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote
                  className={`border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic text-zinc-600 dark:text-zinc-400 my-2`}
                  {...props}
                >
                  {children}
                </blockquote>
              ),
              p: ({ children, ...props }) => (
                <p
                  className={`mb-2 last:mb-0 ${
                    darkMode ? "text-zinc-200" : "text-zinc-700"
                  }`}
                  {...props}
                >
                  {children}
                </p>
              ),
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BotMessage;
