/** Core task that tracks weekly time-based goals */
export interface Task {
  id: string;
  title: string;
  requiredWeeklyHours: number;
  accumulatedSeconds: number;
  kissRewardValue: number;
  isCompleted: boolean;
}

/** Mood options for before/after tracking */
export type MoodOption = "low" | "overwhelmed" | "neutral" | "okay" | "motivated";

export interface MoodEntry {
  timestamp: number;
  mood: MoodOption;
  type: "before" | "after";
  taskId?: string;
}

/** Raccoon's current expression state */
export type RaccoonState = "idle" | "working" | "celebrating" | "happy";

/** Full persisted app state */
export interface AppState {
  tasks: Task[];
  kissTokens: number;
  streak: number;
  consecutiveCompletedWeeks: number;
  lastResetTimestamp: number;
  bigRewardUnlocked: boolean;
  moodHistory: MoodEntry[];
}

/** Default tasks to start with */
export const DEFAULT_TASKS: Task[] = [
  {
    id: "study",
    title: "📚 Study / Learning",
    requiredWeeklyHours: 5,
    accumulatedSeconds: 0,
    kissRewardValue: 3,
    isCompleted: false,
  },
  {
    id: "exercise",
    title: "🏃‍♀️ Exercise",
    requiredWeeklyHours: 3,
    accumulatedSeconds: 0,
    kissRewardValue: 2,
    isCompleted: false,
  },
  {
    id: "creative",
    title: "🎨 Creative Time",
    requiredWeeklyHours: 2,
    accumulatedSeconds: 0,
    kissRewardValue: 2,
    isCompleted: false,
  },
  {
    id: "cleaning",
    title: "🧹 Tidying Up",
    requiredWeeklyHours: 1,
    accumulatedSeconds: 0,
    kissRewardValue: 1,
    isCompleted: false,
  },
];

export const MOOD_CONFIG: Record<MoodOption, { emoji: string; label: string }> = {
  low: { emoji: "😴", label: "Low energy" },
  overwhelmed: { emoji: "😰", label: "Overwhelmed" },
  neutral: { emoji: "😐", label: "Neutral" },
  okay: { emoji: "🙂", label: "Okay" },
  motivated: { emoji: "✨", label: "Motivated" },
};
