import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Check, Pencil } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { Task, MoodOption } from "@/types/app";
import { useApp } from "@/context/AppContext";
import { getStartingMessage, getAfterTaskMessage } from "@/lib/encouragement";
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

export default function TaskCard({ task, onEncouragementMessage, onEdit }: Props) {
  const { dispatch } = useApp();
  const [showMood, setShowMood] = useState<"before" | "after" | null>(null);

  // One-time tasks don't use timer
  const isOneTime = task.taskType === "one-time";

  // Timer hook (still safe to call for one-time, just won't use it)
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
      const msg = getStartingMessage(mood);
      onEncouragementMessage(msg);
      start();
    } else {
      const msg = getAfterTaskMessage(mood);
      onEncouragementMessage(msg);
    }
    setShowMood(null);
  };

  const handleCompleteOneTime = () => {
    dispatch({ type: "COMPLETE_ONE_TIME", taskId: task.id });
    onEncouragementMessage("You did it! One more thing checked off! 🦝💕");
  };

  const progressPercent = Math.round(progress * 100);

  return (
    <motion.div
      layout
      className={`glass-card p-4 transition-all duration-300 ${
        isRunning ? "ring-2 ring-primary/40 kiss-glow" : ""
      } ${isCompleted ? "opacity-80" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-lg">{task.title}</h3>
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

      {/* One-time task: simple checkbox style */}
      {isOneTime ? (
        <>
          {!isCompleted ? (
            <button
              onClick={handleCompleteOneTime}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Check className="w-4 h-4" />
              Mark Complete
            </button>
          ) : (
            <p className="text-sm text-success font-medium text-center">
              ✨ Done! +{task.kissRewardValue} kiss{task.kissRewardValue > 1 ? "es" : ""}
            </p>
          )}
        </>
      ) : (
        <>
          {/* Progress bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-kiss-glow"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Time info */}
          <div className="flex justify-between text-sm text-muted-foreground mb-3">
            <span>{formatTime(accumulatedSeconds)}</span>
            <span>{task.requiredWeeklyHours}h goal</span>
          </div>

          {/* Mood picker overlay */}
          <AnimatePresence>
            {showMood && (
              <MoodPicker
                type={showMood}
                onSelect={handleMoodSelect}
                onClose={() => setShowMood(null)}
              />
            )}
          </AnimatePresence>

          {/* Controls */}
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
              ✨ Completed! +{task.kissRewardValue} kiss{task.kissRewardValue > 1 ? "es" : ""}
            </p>
          )}
        </>
      )}

      {/* Type badge */}
      <div className="mt-2 flex justify-end">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
          {isOneTime ? "one-time" : "weekly"}
        </span>
      </div>
    </motion.div>
  );
}
