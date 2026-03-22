import { create } from "zustand";
import { JobProgress } from "@vedaai/shared";

type State = {
  assignmentId: string | null;
  jobId: string | null;
  status: JobProgress["status"] | "idle";
  progress: number;
  error: string | null;
  socketConnected: boolean;
  resultId: string | null;
  setJob: (payload: Partial<State>) => void;
  reset: () => void;
};

export const useJobStore = create<State>((set) => ({
  assignmentId: null,
  jobId: null,
  status: "idle",
  progress: 0,
  error: null,
  socketConnected: false,
  resultId: null,
  setJob: (payload) => set((state) => ({ ...state, ...payload })),
  reset: () =>
    set({
      assignmentId: null,
      jobId: null,
      status: "idle",
      progress: 0,
      error: null,
      socketConnected: false,
      resultId: null
    })
}));
