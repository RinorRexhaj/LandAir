import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

type SortOption = "Edited" | "Created" | "alphabetical";

interface CustomSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  options: { value: SortOption; label: string }[];
  darkMode: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  darkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      className="relative mb-3 animate-fade [animation-fill-mode:backwards]"
      style={{
        animationDelay: "0.15s",
      }}
      ref={selectRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-fit justify-between items-center gap-2 pr-3 py-2 rounded-lg font-medium transition-colors bg-inherit ${
          darkMode ? "hover:text-white" : "hover:text-zinc-900"
        }`}
      >
        <span>{selectedOption?.label}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-3 h-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-1 w-40 rounded-lg shadow-xl p-1 overflow-hidden z-10 ${
            darkMode
              ? "bg-zinc-900 border border-zinc-800"
              : "bg-white border border-gray-200"
          }`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-3 py-1 rounded text-left transition-colors ${
                darkMode
                  ? "hover:bg-zinc-600 text-white"
                  : "hover:bg-gray-50 text-zinc-900"
              } ${value === option.value ? "font-medium" : ""}`}
            >
              <FontAwesomeIcon
                icon={faCheck}
                className={`${value !== option.value && "opacity-0"}`}
              />
              <p className="w-32 relative right-0">{option.label}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
