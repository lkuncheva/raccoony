/** Difficulty levels for tasks */
export type TaskDifficulty = "easy" | "medium" | "hard" | "epic";

/** Kiss rewards by difficulty for one-time tasks */
export const DIFFICULTY_KISS_REWARDS: Record<TaskDifficulty, number> = {
  easy: 3,
  medium: 5,
  hard: 10,
  epic: 20,
};

/** Daily tasks always give 10 kisses */
export const DAILY_KISS_REWARD = 10;

/** Weekly tasks give 10 kisses per required hour */
export const WEEKLY_KISS_PER_HOUR = 10;

/** Difficulty display config */
export const DIFFICULTY_CONFIG: Record<TaskDifficulty, { emoji: string; label: string; color: string }> = {
  easy: { emoji: "🌱", label: "Easy", color: "text-green-500" },
  medium: { emoji: "⭐", label: "Medium", color: "text-yellow-500" },
  hard: { emoji: "🔥", label: "Hard", color: "text-orange-500" },
  epic: { emoji: "💎", label: "Epic", color: "text-purple-500" },
};

/** Core task interface */
export interface Task {
  id: string;
  title: string;
  /** For weekly tasks: hours required per week */
  requiredWeeklyHours: number;
  accumulatedSeconds: number;
  /** Auto-calculated based on type & difficulty — not user-editable */
  kissRewardValue: number;
  isCompleted: boolean;
  taskType: "weekly" | "daily" | "one-time";
  difficulty: TaskDifficulty;
  /** For daily tasks: tracks the last day it was completed */
  lastCompletedDate?: string;
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
  /** Daily streak (consecutive days with at least one task completed) */
  streak: number;
  consecutiveCompletedWeeks: number;
  lastResetTimestamp: number;
  /** Tracks the last date a task was completed for daily streak */
  lastCompletionDate?: string;
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
    kissRewardValue: 50,
    isCompleted: false,
    taskType: "weekly",
    difficulty: "hard",
  },
  {
    id: "exercise",
    title: "🏃‍♀️ Exercise",
    requiredWeeklyHours: 3,
    accumulatedSeconds: 0,
    kissRewardValue: 30,
    isCompleted: false,
    taskType: "weekly",
    difficulty: "medium",
  },
  {
    id: "creative",
    title: "🎨 Creative Time",
    requiredWeeklyHours: 2,
    accumulatedSeconds: 0,
    kissRewardValue: 20,
    isCompleted: false,
    taskType: "weekly",
    difficulty: "medium",
  },
  {
    id: "cleaning",
    title: "🧹 Tidying Up",
    requiredWeeklyHours: 1,
    accumulatedSeconds: 0,
    kissRewardValue: 10,
    isCompleted: false,
    taskType: "daily",
    difficulty: "easy",
  },
];

export const MOOD_CONFIG: Record<MoodOption, { emoji: string; label: string }> = {
  low: { emoji: "😴", label: "Low energy" },
  overwhelmed: { emoji: "😰", label: "Overwhelmed" },
  neutral: { emoji: "😐", label: "Neutral" },
  okay: { emoji: "🙂", label: "Okay" },
  motivated: { emoji: "✨", label: "Motivated" },
};
