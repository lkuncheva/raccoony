import { motion } from "framer-motion";
import { Gift, Lock } from "lucide-react";
import { useApp } from "@/context/AppContext";

/**
 * Shows how close the user is to the big secret reward
 * without revealing what it is.
 */
export default function RewardProgress() {
  const { state } = useApp();

  // Need 2 consecutive completed weeks
  const progress = state.consecutiveCompletedWeeks;
  const goal = 2;
  const percent = Math.min((progress / goal) * 100, 100);

  // Check if all tasks are completed this week (counting toward progress)
  const allDoneThisWeek = state.tasks.length > 0 && state.tasks.every((t) => t.isCompleted);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-2"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-celebration/20 flex items-center justify-center">
          {percent >= 100 ? (
            <Gift className="w-4 h-4 text-celebration" />
          ) : (
            <Lock className="w-4 h-4 text-celebration" />
          )}
        </div>
        <div>
          <p className="font-display font-bold text-sm">🎁 Secret Reward</p>
          <p className="text-xs text-muted-foreground">
            {progress}/{goal} weeks completed
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-celebration to-kiss"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      <p className="text-xs text-muted-foreground italic">
        {progress === 0 && !allDoneThisWeek
          ? "Complete all tasks this week to start unlocking something special... 🤫"
          : progress === 0 && allDoneThisWeek
          ? "Amazing week! Keep it up next week too... something special awaits 🌟"
          : progress === 1
          ? "One more week and you'll unlock a mystery surprise! 💕"
          : "You're so close... keep going, beautiful! ✨"}
      </p>
    </motion.div>
  );
}
