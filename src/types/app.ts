/** Core task that tracks weekly time-based goals */
export interface Task {
  id: string;
  title: string;
  /** For weekly tasks: hours required per week. For one-time: ignored */
  requiredWeeklyHours: number;
  accumulatedSeconds: number;
  kissRewardValue: number;
  isCompleted: boolean;
  /** "weekly" resets each week, "one-time" stays completed forever */
  taskType: "weekly" | "one-time";
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
  theme: "light" | "dark";
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
    taskType: "weekly",
  },
  {
    id: "exercise",
    title: "🏃‍♀️ Exercise",
    requiredWeeklyHours: 3,
    accumulatedSeconds: 0,
    kissRewardValue: 2,
    isCompleted: false,
    taskType: "weekly",
  },
  {
    id: "creative",
    title: "🎨 Creative Time",
    requiredWeeklyHours: 2,
    accumulatedSeconds: 0,
    kissRewardValue: 2,
    isCompleted: false,
    taskType: "weekly",
  },
  {
    id: "cleaning",
    title: "🧹 Tidying Up",
    requiredWeeklyHours: 1,
    accumulatedSeconds: 0,
    kissRewardValue: 1,
    isCompleted: false,
    taskType: "weekly",
  },
];

export const MOOD_CONFIG: Record<MoodOption, { emoji: string; label: string }> = {
  low: { emoji: "😴", label: "Low energy" },
  overwhelmed: { emoji: "😰", label: "Overwhelmed" },
  neutral: { emoji: "😐", label: "Neutral" },
  okay: { emoji: "🙂", label: "Okay" },
  motivated: { emoji: "✨", label: "Motivated" },
};
