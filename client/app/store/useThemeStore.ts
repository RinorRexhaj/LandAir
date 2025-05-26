import { create } from "zustand";

interface ThemeState {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  darkMode: true,
  setDarkMode: (value: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", value ? "dark" : "light");
    }
    set({ darkMode: value });
  },
}));
