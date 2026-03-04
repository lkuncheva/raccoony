import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AppState, Task, MoodEntry, DEFAULT_TASKS } from "@/types/app";
import { loadState, saveState } from "@/lib/storage";
import { checkWeeklyReset, checkDailyReset } from "@/lib/weeklyReset";

export type Action =
  | { type: "TICK_TIMER"; taskId: string }
  | { type: "COMPLETE_TASK"; taskId: string }
  | { type: "COMPLETE_ONE_TIME"; taskId: string }
  | { type: "COMPLETE_DAILY"; taskId: string }
  | { type: "ADD_MOOD"; entry: MoodEntry }
  | { type: "ACKNOWLEDGE_BIG_REWARD" }
  | { type: "RESET_TOKENS" }
  | { type: "RESET_ALL" }
  | { type: "SET_STATE"; state: AppState }
  | { type: "ADD_TASK"; task: Task }
  | { type: "EDIT_TASK"; task: Task }
  | { type: "DELETE_TASK"; taskId: string }
  | { type: "SET_THEME"; theme: "light" | "dark" };

/** Helper to update daily streak */
function updateStreak(state: AppState): Partial<AppState> {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastCompletionDate === today) return {};
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  
  const newStreak = state.lastCompletionDate === yesterdayStr 
    ? state.streak + 1 
    : 1;
  
  return { streak: newStreak, lastCompletionDate: today };
}

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
    case "COMPLETE_TASK": {
      const task = state.tasks.find((t) => t.id === action.taskId);
      if (!task || task.isCompleted) return state;
      const streakUpdate = updateStreak(state);
      return {
        ...state,
        ...streakUpdate,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, isCompleted: true } : t
        ),
        kissTokens: state.kissTokens + task.kissRewardValue,
      };
    }
    case "COMPLETE_ONE_TIME": {
      const task = state.tasks.find((t) => t.id === action.taskId);
      if (!task || task.isCompleted) return state;
      const streakUpdate = updateStreak(state);
      return {
        ...state,
        ...streakUpdate,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, isCompleted: true } : t
        ),
        kissTokens: state.kissTokens + task.kissRewardValue,
      };
    }
    case "COMPLETE_DAILY": {
      const task = state.tasks.find((t) => t.id === action.taskId);
      if (!task || task.isCompleted) return state;
      const today = new Date().toISOString().slice(0, 10);
      const streakUpdate = updateStreak(state);
      return {
        ...state,
        ...streakUpdate,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId 
            ? { ...t, isCompleted: true, lastCompletedDate: today } 
            : t
        ),
        kissTokens: state.kissTokens + task.kissRewardValue,
      };
    }
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
    const weeklyReset = checkWeeklyReset(loaded);
    const afterWeekly = weeklyReset ?? loaded;
    const dailyReset = checkDailyReset(afterWeekly);
    return dailyReset ?? afterWeekly;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

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
