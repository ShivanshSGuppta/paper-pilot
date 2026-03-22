import { create } from "zustand";

type State = {
  connected: boolean;
  lastEvent: string | null;
  setConnected: (value: boolean) => void;
  setLastEvent: (event: string | null) => void;
};

export const useSocketStore = create<State>((set) => ({
  connected: false,
  lastEvent: null,
  setConnected: (value) => set({ connected: value }),
  setLastEvent: (event) => set({ lastEvent: event })
}));
