import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Task, TaskDifficulty, DIFFICULTY_CONFIG, DIFFICULTY_KISS_REWARDS, DAILY_KISS_REWARD, WEEKLY_KISS_PER_HOUR } from "@/types/app";
import { useApp } from "@/context/AppContext";

interface Props {
  open: boolean;
  onClose: () => void;
  editingTask?: Task | null;
}

export default function TaskEditor({ open, onClose, editingTask }: Props) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [taskType, setTaskType] = useState<"weekly" | "daily" | "one-time">(editingTask?.taskType ?? "one-time");
  const [hours, setHours] = useState(editingTask?.requiredWeeklyHours?.toString() ?? "1");
  const [difficulty, setDifficulty] = useState<TaskDifficulty>(editingTask?.difficulty ?? "medium");

  /** Calculate kiss reward based on type & difficulty */
  function calcKissReward(type: string, diff: TaskDifficulty, hrs: number): number {
    if (type === "one-time") return DIFFICULTY_KISS_REWARDS[diff];
    if (type === "daily") return DAILY_KISS_REWARD;
    return Math.max(1, hrs) * WEEKLY_KISS_PER_HOUR;
  }

  const previewKiss = calcKissReward(taskType, difficulty, parseFloat(hours) || 1);

  const handleSave = () => {
    const kissRewardValue = calcKissReward(taskType, difficulty, parseFloat(hours) || 1);
    const task: Task = {
      id: editingTask?.id ?? `task-${Date.now()}`,
      title: title.trim() || "Untitled Task",
      requiredWeeklyHours: taskType === "weekly" ? Math.max(0.5, parseFloat(hours) || 1) : 0,
      accumulatedSeconds: editingTask?.accumulatedSeconds ?? 0,
      kissRewardValue,
      isCompleted: editingTask?.isCompleted ?? false,
      taskType,
      difficulty,
    };

    if (editingTask) {
      dispatch({ type: "EDIT_TASK", task });
    } else {
      dispatch({ type: "ADD_TASK", task });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-6 w-full max-w-sm space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">
                {editingTask ? "Edit Task" : "New Task"} 🦝
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Task Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 📚 Reading"
                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Task Type */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {(["one-time", "daily", "weekly"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTaskType(type)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-colors ${
                      taskType === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {type === "one-time" ? "✅ One-Time" : type === "daily" ? "📅 Daily" : "⏱ Weekly"}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty (for one-time tasks) */}
            {taskType === "one-time" && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {(Object.keys(DIFFICULTY_CONFIG) as TaskDifficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                        difficulty === diff
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {DIFFICULTY_CONFIG[diff].emoji} {DIFFICULTY_CONFIG[diff].label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hours (only for weekly) */}
            {taskType === "weekly" && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Weekly Hours Goal</label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  min="0.5"
                  step="0.5"
                  className="mt-1 w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}

            {/* Kiss reward preview (read-only) */}
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">Kiss Reward 💋</p>
              <p className="font-display font-bold text-xl text-primary">{previewKiss}</p>
              <p className="text-[10px] text-muted-foreground">
                {taskType === "one-time" && `Based on ${DIFFICULTY_CONFIG[difficulty].label.toLowerCase()} difficulty`}
                {taskType === "daily" && "Daily tasks always earn 10 kisses"}
                {taskType === "weekly" && `${WEEKLY_KISS_PER_HOUR} kisses per hour`}
              </p>
            </div>

            {/* Save / Delete */}
            <div className="flex gap-2 pt-2">
              {editingTask && (
                <button
                  onClick={() => {
                    dispatch({ type: "DELETE_TASK", taskId: editingTask.id });
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors"
                >
                  Delete
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {editingTask ? "Save Changes" : "Add Task"} 💕
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
