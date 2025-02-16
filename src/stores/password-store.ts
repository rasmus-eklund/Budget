import { create } from "zustand";

export const usePasswordStore = create<{
  password: string;
  updatePassword: (password: string) => void;
}>((set) => ({
  password: "",
  updatePassword: (password: string) => {
    set({ password });
  },
}));
