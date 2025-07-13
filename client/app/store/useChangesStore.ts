import { create } from "zustand";

interface ElementChange {
  element: HTMLElement;
  originalHTML: string;
  newHTML: string;
  type: "edit" | "delete";
}

interface ChangesStore {
  changes: ElementChange[];
  addChange: (change: ElementChange) => void;
  updateChange: (element: HTMLElement, newHTML: string) => void;
  removeLastChange: () => ElementChange | null;
  clearChanges: () => void;
  getChangesCount: () => number;
}

export const useChangesStore = create<ChangesStore>((set, get) => ({
  changes: [],

  addChange: (change: ElementChange) => {
    set((state) => ({
      changes: [...state.changes, change],
    }));
  },

  updateChange: (element: HTMLElement, newHTML: string) => {
    set((state) => {
      const existingChangeIndex = state.changes.findIndex(
        (change) => change.element === element
      );

      if (existingChangeIndex >= 0) {
        const updatedChanges = [...state.changes];
        updatedChanges[existingChangeIndex] = {
          ...updatedChanges[existingChangeIndex],
          newHTML,
        };
        return { changes: updatedChanges };
      } else {
        return state;
      }
    });
  },

  removeLastChange: () => {
    const { changes } = get();
    if (changes.length === 0) return null;

    const lastChange = changes[changes.length - 1];
    const remainingChanges = changes.slice(0, -1);

    set({ changes: remainingChanges });
    return lastChange;
  },

  clearChanges: () => {
    set({ changes: [] });
  },

  getChangesCount: () => {
    return get().changes.length;
  },
}));
