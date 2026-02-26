import { motion } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";

interface Props {
  streak: number;
}

export default function StreakDisplay({ streak }: Props) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <motion.div
        animate={streak > 0 ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          streak > 0 ? "bg-streak/20 streak-glow" : "bg-muted"
        }`}
      >
        {streak > 0 ? (
          <Flame className="w-6 h-6 text-streak" />
        ) : (
          <Sparkles className="w-6 h-6 text-muted-foreground" />
        )}
      </motion.div>
      <div>
        <p className="font-display font-bold text-2xl">
          {streak}
        </p>
        <p className="text-xs text-muted-foreground">
          {streak === 0
            ? "Start your streak!"
            : streak === 1
            ? "week streak!"
            : `week streak! 🔥`}
        </p>
      </div>
    </div>
  );
}
