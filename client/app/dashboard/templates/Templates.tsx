import React from "react";
import { useThemeStore } from "../../store/useThemeStore";
import Template from "./Template";
import { Template as TemplateType } from "@/app/types/Template";

const templates: TemplateType[] = [
  { name: "Portfolio", type: "free" },
  { name: "Marketing", type: "premium" },
  { name: "E-Commerce", type: "premium" },
  { name: "SaaS", type: "free" },
];

const Templates = () => {
  const { darkMode } = useThemeStore();

  return (
    <div className="flex flex-col gap-4">
      <h2
        className={`text-xl flex items-end gap-2 font-semibold ${
          darkMode ? "text-white" : "text-zinc-900"
        } transition-all animate-fade [animation-fill-mode:backwards]`}
        style={{
          animationDelay: "0.1s",
        }}
      >
        Templates <p className="text-lg text-zinc-100/60"></p>
      </h2>
      <div className="grid sm:grid-cols-1 tb:grid-cols-2 grid-cols-4 gap-6 animate-fade [animation-fill-mode:backwards]">
        {templates.map((template, index) => (
          <Template
            key={template.name + "-template"}
            template={template}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Templates;
