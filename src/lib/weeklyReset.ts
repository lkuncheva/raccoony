import { AppState } from "@/types/app";

/**
 * Determines if a weekly reset is needed (resets Sunday 00:00).
 * Returns the updated state if a reset occurred, or null if no reset needed.
 */
export function checkWeeklyReset(state: AppState): AppState | null {
  const now = new Date();
  const lastReset = new Date(state.lastResetTimestamp);

  // Find the most recent Sunday 00:00
  const lastSunday = new Date(now);
  lastSunday.setHours(0, 0, 0, 0);
  // Go back to Sunday
  lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());

  // If we haven't reset since the last Sunday boundary
  if (lastReset < lastSunday) {
    const allCompleted = state.tasks.every((t) => t.isCompleted);

    const newStreak = allCompleted ? state.streak + 1 : 0;
    const newConsecutive = allCompleted
      ? state.consecutiveCompletedWeeks + 1
      : 0;

    // Check big reward: 2 consecutive completed weeks
    const bigRewardUnlocked = newConsecutive >= 2;

    return {
      ...state,
      tasks: state.tasks.map((t) => ({
        ...t,
        accumulatedSeconds: 0,
        isCompleted: false,
      })),
      streak: newStreak,
      consecutiveCompletedWeeks: bigRewardUnlocked ? 0 : newConsecutive,
      bigRewardUnlocked: bigRewardUnlocked || state.bigRewardUnlocked,
      lastResetTimestamp: Date.now(),
    };
  }

  return null;
}
