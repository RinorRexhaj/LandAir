import { useThemeStore } from "@/app/store/useThemeStore";

const SkeletonChatBubble: React.FC<{ sender: boolean }> = ({ sender }) => {
  const { darkMode } = useThemeStore();
  return (
    <div
      className={`animate-fade [animation-fill-mode:backwards] ${
        sender ? `flex justify-end mb-4` : `flex justify-start mb-6`
      }`}
    >
      {sender ? (
        // User message skeleton - Chat bubble style
        <div
          className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm animate-pulse ${
            darkMode ? "bg-zinc-700/50" : "bg-zinc-200/30"
          } shadow-sm w-[180px] h-[40px]`}
        />
      ) : (
        // Bot message skeleton - LLM response style
        <div className="w-full flex gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-pulse flex-shrink-0" />
          <div
            className={`flex-1 max-w-[85%] rounded-xl p-4 animate-pulse ${
              darkMode
                ? "bg-zinc-800/30 border border-zinc-700/30"
                : "bg-zinc-50/70 border border-zinc-200/30"
            } shadow-sm`}
          >
            <div className="space-y-2">
              <div
                className={`rounded-md ${
                  darkMode ? "bg-zinc-600" : "bg-zinc-300"
                } w-[80%] h-[16px]`}
              />
              <div
                className={`rounded-md ${
                  darkMode ? "bg-zinc-600" : "bg-zinc-300"
                } w-[60%] h-[16px]`}
              />
              <div
                className={`rounded-md ${
                  darkMode ? "bg-zinc-600" : "bg-zinc-300"
                } w-[70%] h-[16px]`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkeletonChatBubble;
