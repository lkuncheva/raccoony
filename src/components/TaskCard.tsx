import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Check, Pencil } from "lucide-react";
import confetti from "canvas-confetti";
import { useTimer } from "@/hooks/useTimer";
import { Task, MoodOption, DIFFICULTY_CONFIG } from "@/types/app";
import { useApp } from "@/context/AppContext";
import { getStartingMessage, getAfterTaskMessage, getCompletionMessage } from "@/lib/encouragement";
import MoodPicker from "./MoodPicker";

interface Props {
  task: Task;
  onEncouragementMessage: (msg: string) => void;
  onEdit: (task: Task) => void;
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

/** Fire confetti scaled to difficulty */
function celebrate(difficulty: string) {
  const intensity: Record<string, { count: number; spread: number; duration: number }> = {
    easy: { count: 20, spread: 50, duration: 1000 },
    medium: { count: 40, spread: 70, duration: 1500 },
    hard: { count: 60, spread: 90, duration: 2500 },
    epic: { count: 100, spread: 120, duration: 4000 },
  };
  const cfg = intensity[difficulty] ?? intensity.medium;
  const end = Date.now() + cfg.duration;
  const fire = () => {
    confetti({
      particleCount: cfg.count,
      spread: cfg.spread,
      origin: { y: 0.6 },
      colors: ["#e8789a", "#f0b8c8", "#c9a0dc", "#f7d794", "#ff9ff3"],
    });
    if (Date.now() < end) requestAnimationFrame(fire);
  };
  fire();
}

export default function TaskCard({ task, onEncouragementMessage, onEdit }: Props) {
  const { dispatch } = useApp();
  const [showMood, setShowMood] = useState<"before" | "after" | null>(null);

  const isOneTime = task.taskType === "one-time";
  const isDaily = task.taskType === "daily";
  const isTimer = task.taskType === "weekly";

  const { isRunning, start, stop, accumulatedSeconds, requiredSeconds, progress, isCompleted } =
    useTimer(task.id);

  const handlePlay = () => setShowMood("before");
  const handleStop = () => {
    stop();
    setShowMood("after");
  };

  const handleMoodSelect = (mood: MoodOption) => {
    dispatch({
      type: "ADD_MOOD",
      entry: { timestamp: Date.now(), mood, type: showMood!, taskId: task.id },
    });
    if (showMood === "before") {
      onEncouragementMessage(getStartingMessage(mood));
      start();
    } else {
      onEncouragementMessage(getAfterTaskMessage(mood));
    }
    setShowMood(null);
  };

  const handleCompleteCheckbox = () => {
    const actionType = isDaily ? "COMPLETE_DAILY" : "COMPLETE_ONE_TIME";
    dispatch({ type: actionType, taskId: task.id });
    celebrate(task.difficulty);
    onEncouragementMessage(getCompletionMessage());
  };

  const progressPercent = Math.round(progress * 100);
  const diffConfig = DIFFICULTY_CONFIG[task.difficulty];

  return (
    <motion.div
      layout
      className={`glass-card p-4 transition-all duration-300 ${
        isRunning ? "ring-2 ring-primary/40 kiss-glow" : ""
      } ${isCompleted ? "opacity-70" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-bold text-base">{task.title}</h3>
          {isOneTime && (
            <span className={`text-xs ${diffConfig.color}`}>
              {diffConfig.emoji}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-7 h-7 rounded-full bg-success flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-primary-foreground" />
            </motion.div>
          )}
        </div>
      </div>

      {/* One-time or Daily: checkbox-style completion */}
      {(isOneTime || isDaily) && (
        <>
          {!isCompleted ? (
            <button
              onClick={handleCompleteCheckbox}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Check className="w-4 h-4" />
              Mark Complete
            </button>
          ) : (
            <p className="text-sm text-success font-medium text-center">
              ✨ Done! +{task.kissRewardValue} 💋
            </p>
          )}
        </>
      )}

      {/* Weekly timer tasks */}
      {isTimer && (
        <>
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-kiss-glow"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground mb-3">
            <span>{formatTime(accumulatedSeconds)}</span>
            <span>{task.requiredWeeklyHours}h goal</span>
          </div>

          <AnimatePresence>
            {showMood && (
              <MoodPicker
                type={showMood}
                onSelect={handleMoodSelect}
                onClose={() => setShowMood(null)}
              />
            )}
          </AnimatePresence>

          {!isCompleted && !showMood && (
            <div className="flex gap-2">
              {!isRunning ? (
                <button
                  onClick={handlePlay}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Play className="w-4 h-4" />
                  Start
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}
            </div>
          )}

          {isCompleted && (
            <p className="text-sm text-success font-medium text-center">
              ✨ Completed! +{task.kissRewardValue} 💋
            </p>
          )}
        </>
      )}

      {/* Type & reward badge */}
      <div className="mt-2 flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground">
          💋 {task.kissRewardValue} kisses
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
          {isOneTime ? "one-time" : isDaily ? "daily" : "weekly"}
        </span>
      </div>
    </motion.div>
  );
}
