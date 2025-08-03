import { useThemeStore } from "@/app/store/useThemeStore";
import { Template as TemplateType } from "@/app/types/Template";
import {
  faArrowUpRightFromSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useMemo } from "react";

interface TemplateProps {
  template: TemplateType;
  index: number;
  onUseTemplate: (template: string) => void;
}

const Template = ({ template, index, onUseTemplate }: TemplateProps) => {
  const { darkMode } = useThemeStore();

  const imageUrl = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pages/Templates/${template.name} Template/screenshot.png`,
    [template]
  );

  return (
    <div
      className={`relative rounded-xl group transition-transform hover:-translate-y-1 cursor-pointer animate-slideIn [animation-fill-mode:backwards] bg-gray-100 ${
        darkMode
          ? "bg-zinc-700/30 hover:bg-zinc-700/50"
          : "bg-gray-200/60 hover:bg-gray-200"
      }`}
      style={{
        animationDelay: `${index * 0.3 + 0.2}s`,
      }}
    >
      {/* Screenshot */}
      <div className="w-full h-40 relative rounded-tl-xl rounded-tr-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${template} Template Screenshot`}
          fill
          className="object-cover object-top animate-fade"
          sizes="(max-width: 500px) 100%, (max-width: 1000px) 50%, 25%"
        />
      </div>

      {/* Text and Actions */}
      <div className="w-full flex flex-col gap-1 px-4 py-3">
        <div className="w-full flex justify-between items-center">
          <h3
            className={`text-base font-semibold truncate ${
              darkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            {template.name} Template
          </h3>

          <div className="flex gap-1 items-center">
            {/* Live Preview Button */}
            <a
              href={`https://${template.name}-template.landair.app`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2 py-1 rounded hover:scale-105 transition ${
                darkMode
                  ? "hover:bg-white/10 text-white"
                  : "hover:bg-black/10 text-black"
              }`}
              title="Live Preview"
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>

            {/* Use Button */}
            <button
              onClick={() => onUseTemplate(template.name)}
              className={`px-2 py-1 rounded hover:scale-105 transition ${
                darkMode
                  ? "hover:bg-blue-500/20 text-blue-400"
                  : "hover:bg-blue-500/10 text-blue-600"
              }`}
              title="Use Template"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
        <span
          className={`w-fit px-4 py-1 rounded-full text-sm font-semibold capitalize ${
            template.type === "free"
              ? "bg-blue-600 text-white"
              : "bg-violet-700 text-white"
          }`}
        >
          {template.type}
        </span>
      </div>
    </div>
  );
};

export default Template;
