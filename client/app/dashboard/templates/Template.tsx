import { useThemeStore } from "@/app/store/useThemeStore";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const Template = ({ template, index }: { template: string; index: number }) => {
  const { darkMode } = useThemeStore();

  return (
    <div
      className={`relative rounded-xl group transition-transform hover:-translate-y-1 cursor-pointer animate-slideIn [animation-fill-mode:backwards] bg-gray-100 ${
        darkMode
          ? "bg-zinc-700/30 hover:bg-zinc-700/50"
          : "bg-gray-200/60 hover:bg-gray-200"
      }`}
      style={{
        animationDelay: index * 0.3 + 0.2 + "s",
      }}
      onClick={() => {
        // setSelectedProject(project);
      }}
    >
      {/* Screenshot */}
      <div className="w-full h-40 relative rounded-tl-xl rounded-tr-xl overflow-hidden">
        <Image
          src={`https://ykzubtnhyebwtqzaawan.supabase.co/storage/v1/object/public/pages/Templates/${template}%20Template/screenshot.png`}
          alt={`${template} Template Screenshot`}
          fill
          className="object-cover object-top animate-fade"
          sizes="(max-width: 500px) 100%, (max-width: 1000px) 50%, 25%"
        />
      </div>

      {/* Text Content */}
      <div className="w-full p-4 flex justify-between gap-1">
        <h3
          className={`text-base font-semibold truncate ${
            darkMode ? "text-white" : "text-zinc-900"
          }`}
        >
          {template} Template
        </h3>
        <div>
          <a
            className={`w-full flex gap-2 items-center text-left px-4 py-2 text-sm ${
              darkMode
                ? "hover:bg-red-500/20 text-red-400"
                : "hover:bg-red-500/10 text-red-500"
            }`}
            href={`https://${template}-template.landair.app`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Template;
