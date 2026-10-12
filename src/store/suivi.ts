import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PLAN_ITEMS, type Status } from "@/data/plan";

export type LogEntry = {
  id: string;
  itemId: string;
  title: string;
  to: Status;
  at: string;
};

type SuiviState = {
  status: Record<string, Status>;
  notes: Record<string, string>;
  checks: Record<string, boolean>;
  log: LogEntry[];
  setStatus: (itemId: string, title: string, to: Status) => void;
  setNote: (itemId: string, note: string) => void;
  toggleCheck: (key: string) => void;
  reset: () => void;
};

const defaults: Record<string, Status> = Object.fromEntries(
  PLAN_ITEMS.map((item) => [item.id, item.initial]),
);

const empty = {
  status: defaults,
  notes: {} as Record<string, string>,
  checks: {} as Record<string, boolean>,
  log: [] as LogEntry[],
};

export const useSuivi = create<SuiviState>()(
  persist(
    (set) => ({
      ...empty,
      setStatus: (itemId, title, to) =>
        set((state) => {
          if (state.status[itemId] === to) return state;
          const entry: LogEntry = {
            id: crypto.randomUUID(),
            itemId,
            title,
            to,
            at: new Date().toISOString(),
          };
          return {
            status: { ...state.status, [itemId]: to },
            log: [entry, ...state.log].slice(0, 40),
          };
        }),
      setNote: (itemId, note) =>
        set((state) => ({ notes: { ...state.notes, [itemId]: note } })),
      toggleCheck: (key) =>
        set((state) => ({
          checks: { ...state.checks, [key]: !state.checks[key] },
        })),
      reset: () => set({ ...empty, status: { ...defaults } }),
    }),
    {
      name: "digifemmes-feuille-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<SuiviState>;
        return {
          ...current,
          status: { ...defaults, ...saved.status },
          notes: saved.notes ?? {},
          checks: saved.checks ?? {},
          log: saved.log ?? [],
        };
      },
    },
  ),
);
