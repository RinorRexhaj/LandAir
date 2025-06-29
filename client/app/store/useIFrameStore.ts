import { create } from "zustand";
interface IFrameStore {
  iframeRef: HTMLIFrameElement | null;
  setIframe: (ref: HTMLIFrameElement | null) => void;
}

export const useIFrameStore = create<IFrameStore>((set) => ({
  iframeRef: null,
  setIframe: (ref) => set({ iframeRef: ref }),
}));
