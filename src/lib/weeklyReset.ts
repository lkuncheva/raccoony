import { AppState } from "@/types/app";

/**
 * Determines if a weekly reset is needed (resets Sunday 00:00).
 * Only resets weekly tasks; one-time completed tasks stay completed.
 */
export function checkWeeklyReset(state: AppState): AppState | null {
  const now = new Date();
  const lastReset = new Date(state.lastResetTimestamp);

  const lastSunday = new Date(now);
  lastSunday.setHours(0, 0, 0, 0);
  lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());

  if (lastReset < lastSunday) {
    // Only weekly tasks count for streak
    const weeklyTasks = state.tasks.filter((t) => t.taskType === "weekly");
    const allWeeklyCompleted = weeklyTasks.length > 0 && weeklyTasks.every((t) => t.isCompleted);

    const newStreak = allWeeklyCompleted ? state.streak + 1 : 0;
    const newConsecutive = allWeeklyCompleted
      ? state.consecutiveCompletedWeeks + 1
      : 0;

    const bigRewardUnlocked = newConsecutive >= 2;

    return {
      ...state,
      tasks: state.tasks.map((t) =>
        t.taskType === "weekly"
          ? { ...t, accumulatedSeconds: 0, isCompleted: false }
          : t // one-time tasks keep their state
      ),
      streak: newStreak,
      consecutiveCompletedWeeks: bigRewardUnlocked ? 0 : newConsecutive,
      bigRewardUnlocked: bigRewardUnlocked || state.bigRewardUnlocked,
      lastResetTimestamp: Date.now(),
    };
  }

  return null;
}
