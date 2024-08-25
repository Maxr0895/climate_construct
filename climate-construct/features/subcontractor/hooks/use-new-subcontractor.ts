import { create } from "zustand";

type NewSubcontractorState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewSubcontractor = create<NewSubcontractorState>((set) => ({
  isOpen: false,
  onOpen: () => {
    console.log("Opening form");
    set({ isOpen: true });
  },
  onClose: () => {
    console.log("Closing form");
    set({ isOpen: false });
  },
}));