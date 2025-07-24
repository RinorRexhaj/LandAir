import { create } from "zustand";

interface ToolbarStore {
  mobile: number;
  setMobile: (mobile: number) => void;
  selector: boolean;
  setSelector: (selector: boolean) => void;
}

export const useToolbarStore = create<ToolbarStore>((set) => ({
  mobile: 0,
  setMobile: (mobile) => set({ mobile }),
  selector: false,
  setSelector: (selector) => set({ selector }),
}));
