import { create } from "zustand";

type Toast = {
  id: string;
  title: string;
  description?: string;
  tone?: "default" | "success" | "error";
};

type State = {
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
  toasts: Toast[];
  setSidebarOpen: (value: boolean) => void;
  toggleSidebar: () => void;
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  setMobileNavOpen: (value: boolean) => void;
};

export const useUiStore = create<State>((set) => ({
  sidebarOpen: false,
  mobileNavOpen: false,
  toasts: [],
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  pushToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }]
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    })),
  setMobileNavOpen: (value) => set({ mobileNavOpen: value })
}));
