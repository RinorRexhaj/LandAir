export const baseButtonClasses =
  "w-fit flex gap-2 items-center py-2 px-3 rounded-lg border shadow-sm transition-colors";

export const getButtonClasses = (isActive: boolean, darkMode: boolean) => {
  if (darkMode) {
    return isActive
      ? "bg-white text-zinc-900 border-gray-200/30"
      : "bg-zinc-900 text-gray-200 border-gray-200/30 hover:bg-white hover:text-zinc-900";
  } else {
    return isActive
      ? "bg-zinc-900 text-white border-zinc-400/40"
      : "text-zinc-900 border-zinc-400/40 hover:bg-zinc-900 hover:text-white";
  }
};
