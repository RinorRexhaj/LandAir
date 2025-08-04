import useApi from "@/app/hooks/useApi";
import useToast from "@/app/hooks/useToast";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import { Template as TemplateType } from "@/app/types/Template";
import {
  faArrowUpRightFromSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useMemo, useState } from "react";

interface TemplateProps {
  template: TemplateType;
  index: number;
}

const Template = ({ template, index }: TemplateProps) => {
  const { darkMode } = useThemeStore();
  const { createProject } = useProjectStore();
  const toast = useToast();
  const { post, get } = useApi();
  const [creating, setCreating] = useState(false);

  const imageUrl = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pages/Templates/${template.name}/screenshot.png`,
    [template]
  );

  return (
    <div
      className={`relative rounded-xl group transition-transform hover:-translate-y-1 cursor-pointer animate-fade-in-slow [animation-fill-mode:backwards] `}
      style={{
        animationDelay: `${index * 0.2 + 0.1}s`,
      }}
    >
      {/* Screenshot */}
      <div
        className={`aspect-[16/9] w-full relative rounded-lg border ${
          darkMode ? "border-zinc-800" : "border-zinc-200"
        } overflow-hidden shadow ${creating && "animate-glow"}`}
      >
        {/* Dark overlay when hovering */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-60 transition-opacity duration-300 z-10" />
        <Image
          src={imageUrl}
          alt={`${template} Template Screenshot`}
          fill
          className={`object-cover object-top animate-fade`}
          sizes="(max-width: 500px) 100%, (max-width: 1000px) 50%, 25%"
        />
      </div>

      {/* Text and Actions */}
      <div className="w-full flex flex-col gap-1 p-2">
        <div className="w-full flex justify-between items-center">
          <h3
            className={`text-base font-semibold truncate ${
              darkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            {template.name}
          </h3>

          <div
            className={`
              absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4
              flex flex-col gap-2 items-center
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
              backdrop-blur-md bg-black/40 p-4 rounded-xl z-20 shadow-lg
            `}
          >
            {/* Live Preview Button */}
            <a
              href={`https://${template.name}-template.landair.app`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-md w-32 
               bg-white text-zinc-900 font-semibold text-sm shadow hover:bg-zinc-100
               transition duration-200"
              title="Live Preview"
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              <span>Preview</span>
            </a>

            {/* Use Button */}
            <button
              onClick={() =>
                createProject(toast, post, setCreating, template.name, get)
              }
              className="flex items-center gap-2 px-4 py-2 rounded-md w-32
               bg-zinc-700 text-white font-semibold text-sm shadow hover:bg-zinc-800
               transition duration-200"
              title="Use Template"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Use</span>
            </button>
          </div>

          <span
            className={`w-fit px-3 py-1 -mr-1 rounded-lg text-xs font-semibold capitalize ${
              template.type === "free"
                ? "bg-blue-600/80 text-blue-100"
                : "bg-violet-700/80 text-violet-100"
            }`}
          >
            {template.type}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Template;
