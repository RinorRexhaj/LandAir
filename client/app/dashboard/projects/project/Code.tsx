import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useThemeStore } from "@/app/store/useThemeStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCode, faCopy } from "@fortawesome/free-solid-svg-icons";

interface CodeProps {
  file: string;
}

const Code: React.FC<CodeProps> = ({ file }) => {
  const [code, setCode] = useState(file);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const { darkMode } = useThemeStore();

  const saveCode = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Code saved:", code);
    setIsSaving(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 500); // Reset after 1.5s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full rounded-md overflow-hidden relative">
      {/* Top Control Bar */}
      <div
        className={`absolute z-50 top-0 right-0 flex gap-2 p-2 rounded-md border border-zinc-400/20 ${
          darkMode ? "bg-zinc-900" : "bg-gray-100"
        } shadow-lg`}
      >
        {/* Copy Button */}
        <button
          onClick={copyCode}
          className={`justify-center px-3 py-1 flex items-center gap-2 text-sm rounded font-medium transition-colors shadow-lg ${
            copied
              ? "bg-zinc-800 text-white"
              : "bg-zinc-600 hover:bg-zinc-700 text-white"
          }`}
          title="Copy"
        >
          <FontAwesomeIcon icon={faCopy} />
          <span className={`md:hidden ${copied && "animate-fade"}`}>
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>

        {/* Save Button */}
        <button
          onClick={saveCode}
          disabled={isSaving}
          className={`justify-center px-3 py-1 flex items-center gap-2 text-sm rounded font-medium transition-colors shadow-lg ${
            isSaving
              ? "bg-blue-800 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          title="Save"
        >
          <FontAwesomeIcon icon={faFileCode} />
          <span className="md:hidden">{isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="calc(100vh)"
        defaultLanguage="html"
        theme={darkMode ? "vs-dark" : "light"}
        value={code}
        width="100%"
        options={{
          formatOnPaste: true,
          formatOnType: true,
        }}
        onChange={(value) => setCode(value || "")}
      />
    </div>
  );
};

export default Code;
