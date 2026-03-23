import { create } from "zustand";
import { QUESTION_TYPE_OPTIONS } from "../lib/constants";

export type QuestionRow = {
  id: string;
  type: (typeof QUESTION_TYPE_OPTIONS)[number]["value"];
  count: number;
  marksPerQuestion: number;
};

export type FileMeta = {
  name: string;
  type: "pdf" | "txt";
  size: number;
};

type State = {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  questionRows: QuestionRow[];
  additionalInstructions: string;
  fileMeta: FileMeta | null;
  isSubmitting: boolean;
  totalQuestions: number;
  totalMarks: number;
  setTitle: (value: string) => void;
  setSubject: (value: string) => void;
  setClassName: (value: string) => void;
  setDueDate: (value: string) => void;
  setInstructions: (value: string) => void;
  setFileMeta: (value: FileMeta | null) => void;
  addQuestionRow: () => void;
  updateQuestionRow: (id: string, patch: Partial<QuestionRow>) => void;
  removeQuestionRow: (id: string) => void;
  reset: () => void;
  setSubmitting: (value: boolean) => void;
  hydrateDemo: () => void;
  syncTotals: () => void;
};

const defaultRows: QuestionRow[] = [
  { id: createRowId(), type: "mcq", count: 4, marksPerQuestion: 1 },
  { id: createRowId(), type: "short_answer", count: 3, marksPerQuestion: 2 },
  { id: createRowId(), type: "diagram", count: 5, marksPerQuestion: 5 },
  { id: createRowId(), type: "numerical", count: 5, marksPerQuestion: 5 }
];

function createRowId() {
  return globalThis.crypto?.randomUUID?.() ?? `row_${Math.random().toString(36).slice(2, 10)}`;
}

function calculate(rows: QuestionRow[]) {
  return rows.reduce(
    (acc, row) => ({
      totalQuestions: acc.totalQuestions + row.count,
      totalMarks: acc.totalMarks + row.count * row.marksPerQuestion
    }),
    { totalQuestions: 0, totalMarks: 0 }
  );
}

export const useAssignmentFormStore = create<State>((set, get) => ({
  title: "Science Assessment",
  subject: "General",
  className: "Not specified",
  dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().slice(0, 10),
  questionRows: defaultRows,
  additionalInstructions: "Generate a balanced paper with clear wording and one application-focused question.",
  fileMeta: null,
  isSubmitting: false,
  totalQuestions: calculate(defaultRows).totalQuestions,
  totalMarks: calculate(defaultRows).totalMarks,
  setTitle: (value) => set({ title: value }),
  setSubject: (value) => set({ subject: value }),
  setClassName: (value) => set({ className: value }),
  setDueDate: (value) => set({ dueDate: value }),
  setInstructions: (value) => set({ additionalInstructions: value }),
  setFileMeta: (value) => set({ fileMeta: value }),
  addQuestionRow: () => {
    const next = [
      ...get().questionRows,
      {
        id: createRowId(),
        type: "short_answer" as QuestionRow["type"],
        count: 1,
        marksPerQuestion: 2
      }
    ];
    const totals = calculate(next);
    set({ questionRows: next, ...totals });
  },
  updateQuestionRow: (id, patch) => {
    const next = get().questionRows.map((row) => (row.id === id ? { ...row, ...patch } : row));
    const totals = calculate(next);
    set({ questionRows: next, ...totals });
  },
  removeQuestionRow: (id) => {
    const next = get().questionRows.filter((row) => row.id !== id);
    const totals = calculate(next.length ? next : defaultRows.slice(0, 1));
    set({ questionRows: next.length ? next : defaultRows.slice(0, 1), ...totals });
  },
  reset: () => set({
    title: "Science Assessment",
    subject: "General",
    className: "Not specified",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().slice(0, 10),
    questionRows: defaultRows,
    additionalInstructions: "Generate a balanced paper with clear wording and one application-focused question.",
    fileMeta: null,
    isSubmitting: false,
    ...calculate(defaultRows)
  }),
  setSubmitting: (value) => set({ isSubmitting: value }),
  hydrateDemo: () => set({
    title: "Science Assessment",
    subject: "General",
    className: "Not specified",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().slice(0, 10),
    questionRows: defaultRows,
    additionalInstructions: "Generate a balanced paper with clear wording and one application-focused question.",
    fileMeta: null,
    ...calculate(defaultRows)
  }),
  syncTotals: () => {
    const totals = calculate(get().questionRows);
    set({ ...totals });
  }
}));
