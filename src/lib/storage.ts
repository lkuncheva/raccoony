import { AppState, DEFAULT_TASKS, DIFFICULTY_KISS_REWARDS, DAILY_KISS_REWARD, WEEKLY_KISS_PER_HOUR } from "@/types/app";

const STORAGE_KEY = "raccoonaki-app";

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

/** Load persisted state with migration */
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw);
    const migrated = {
      ...getDefaultState(),
      ...parsed,
      tasks: (parsed.tasks ?? DEFAULT_TASKS).map((t: any) => {
        const taskType = t.taskType ?? "weekly";
        const difficulty = t.difficulty ?? "medium";
        // Recalculate kiss reward based on type
        let kissRewardValue = t.kissRewardValue ?? 5;
        if (taskType === "one-time") {
          kissRewardValue = DIFFICULTY_KISS_REWARDS[difficulty as keyof typeof DIFFICULTY_KISS_REWARDS] ?? 5;
        } else if (taskType === "daily") {
          kissRewardValue = DAILY_KISS_REWARD;
        } else if (taskType === "weekly") {
          kissRewardValue = (t.requiredWeeklyHours ?? 1) * WEEKLY_KISS_PER_HOUR;
        }
        return {
          ...t,
          taskType,
          difficulty,
          kissRewardValue,
        };
      }),
    };
    return migrated;
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
