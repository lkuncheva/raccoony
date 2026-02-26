import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AppState, Task, MoodEntry, DEFAULT_TASKS } from "@/types/app";
import { loadState, saveState } from "@/lib/storage";
import { checkWeeklyReset } from "@/lib/weeklyReset";

export type Action =
  | { type: "TICK_TIMER"; taskId: string }
  | { type: "COMPLETE_TASK"; taskId: string }
  | { type: "ADD_KISS_TOKENS"; amount: number }
  | { type: "ADD_MOOD"; entry: MoodEntry }
  | { type: "ACKNOWLEDGE_BIG_REWARD" }
  | { type: "RESET_TOKENS" }
  | { type: "RESET_ALL" }
  | { type: "SET_STATE"; state: AppState }
  | { type: "ADD_TASK"; task: Task }
  | { type: "EDIT_TASK"; task: Task }
  | { type: "DELETE_TASK"; taskId: string }
  | { type: "COMPLETE_ONE_TIME"; taskId: string }
  | { type: "SET_THEME"; theme: "light" | "dark" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "TICK_TIMER":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? { ...t, accumulatedSeconds: t.accumulatedSeconds + 1 }
            : t
        ),
      };
    case "COMPLETE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, isCompleted: true } : t
        ),
        kissTokens:
          state.kissTokens +
          (state.tasks.find((t) => t.id === action.taskId)?.kissRewardValue ?? 0),
      };
    case "COMPLETE_ONE_TIME":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, isCompleted: true } : t
        ),
        kissTokens:
          state.kissTokens +
          (state.tasks.find((t) => t.id === action.taskId)?.kissRewardValue ?? 0),
      };
    case "ADD_KISS_TOKENS":
      return { ...state, kissTokens: state.kissTokens + action.amount };
    case "ADD_MOOD":
      return { ...state, moodHistory: [...state.moodHistory, action.entry] };
    case "ACKNOWLEDGE_BIG_REWARD":
      return { ...state, bigRewardUnlocked: false };
    case "RESET_TOKENS":
      return { ...state, kissTokens: 0 };
    case "RESET_ALL":
      return {
        tasks: DEFAULT_TASKS,
        kissTokens: 0,
        streak: 0,
        consecutiveCompletedWeeks: 0,
        lastResetTimestamp: Date.now(),
        bigRewardUnlocked: false,
        moodHistory: [],
        theme: state.theme,
      };
    case "SET_STATE":
      return action.state;
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.task] };
    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.task.id ? action.task : t)),
      };
    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.taskId) };
    case "SET_THEME":
      return { ...state, theme: action.theme };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    const loaded = loadState();
    const resetState = checkWeeklyReset(loaded);
    return resetState ?? loaded;
  });

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  // Persist state on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
