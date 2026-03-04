import { AppState } from "@/types/app";

/**
 * Weekly reset: runs on Sunday 00:00.
 * Resets weekly tasks, updates consecutiveCompletedWeeks for secret reward.
 */
export function checkWeeklyReset(state: AppState): AppState | null {
  const now = new Date();
  const lastReset = new Date(state.lastResetTimestamp);

  const lastSunday = new Date(now);
  lastSunday.setHours(0, 0, 0, 0);
  lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());

  if (lastReset < lastSunday) {
    const weeklyTasks = state.tasks.filter((t) => t.taskType === "weekly");
    const allWeeklyCompleted = weeklyTasks.length > 0 && weeklyTasks.every((t) => t.isCompleted);

    const newConsecutive = allWeeklyCompleted
      ? state.consecutiveCompletedWeeks + 1
      : 0;

    const bigRewardUnlocked = newConsecutive >= 2;

    return {
      ...state,
      tasks: state.tasks.map((t) =>
        t.taskType === "weekly"
          ? { ...t, accumulatedSeconds: 0, isCompleted: false }
          : t
      ),
      consecutiveCompletedWeeks: bigRewardUnlocked ? 0 : newConsecutive,
      bigRewardUnlocked: bigRewardUnlocked || state.bigRewardUnlocked,
      lastResetTimestamp: Date.now(),
    };
  }

  return null;
}

/**
 * Daily reset: resets daily tasks at midnight each day.
 * Also removes completed one-time tasks from the previous day.
 */
export function checkDailyReset(state: AppState): AppState | null {
  const today = new Date().toISOString().slice(0, 10);
  
  const hasDailyToReset = state.tasks.some(
    (t) => t.taskType === "daily" && t.isCompleted && t.lastCompletedDate !== today
  );

  const hasCompletedOneTime = state.tasks.some(
    (t) => t.taskType === "one-time" && t.isCompleted && t.lastCompletedDate !== today
  );

  if (!hasDailyToReset && !hasCompletedOneTime) return null;

  return {
    ...state,
    // Remove completed one-time tasks from previous days, reset daily tasks
    tasks: state.tasks
      .filter((t) => !(t.taskType === "one-time" && t.isCompleted && t.lastCompletedDate !== today))
      .map((t) =>
        t.taskType === "daily" && t.isCompleted && t.lastCompletedDate !== today
          ? { ...t, isCompleted: false }
          : t
      ),
  };
}
