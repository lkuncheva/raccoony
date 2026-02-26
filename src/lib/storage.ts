import { AppState, DEFAULT_TASKS } from "@/types/app";

const STORAGE_KEY = "raccoonaki-app";

/** Returns a fresh default state */
function getDefaultState(): AppState {
  return {
    tasks: DEFAULT_TASKS,
    kissTokens: 0,
    streak: 0,
    consecutiveCompletedWeeks: 0,
    lastResetTimestamp: Date.now(),
    bigRewardUnlocked: false,
    moodHistory: [],
    theme: "light",
  };
}

/** Load persisted state from localStorage */
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw);
    const migrated = {
      ...getDefaultState(),
      ...parsed,
      tasks: (parsed.tasks ?? DEFAULT_TASKS).map((t: any) => ({
        ...t,
        taskType: t.taskType ?? "weekly",
      })),
    };
    return migrated;
  } catch {
    return getDefaultState();
  }
}

/** Save state to localStorage */
export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
}

/** Clear all persisted data */
export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
