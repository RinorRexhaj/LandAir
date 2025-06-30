import { create } from "zustand";

/**
 * Modal Store
 *
 * This store manages global modal states to ensure only one modal is active at a time.
 * Each modal is identified by a unique string ID (e.g., 'delete-project-123', 'rename-project-456').
 *
 * Features:
 * - Only one modal can be active at a time
 * - Click outside to close functionality
 * - Escape key to close functionality
 * - Automatic cleanup when components unmount
 */

interface ModalState {
  activeModal: string | null;
  setActiveModal: (modalId: string | null) => void;
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  setActiveModal: (modalId) => set({ activeModal: modalId }),
  closeAllModals: () => set({ activeModal: null }),
}));
