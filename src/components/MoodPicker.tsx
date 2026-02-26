import { motion } from "framer-motion";
import { MoodOption, MOOD_CONFIG } from "@/types/app";
import { X } from "lucide-react";

interface Props {
  type: "before" | "after";
  onSelect: (mood: MoodOption) => void;
  onClose: () => void;
}

export default function MoodPicker({ type, onSelect, onClose }: Props) {
  const moods = Object.entries(MOOD_CONFIG) as [MoodOption, { emoji: string; label: string }][];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="mt-2"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-foreground/80">
          {type === "before" ? "How are you feeling?" : "How do you feel now?"}
        </p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {moods.map(([key, { emoji, label }]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-muted hover:bg-secondary transition-colors text-sm"
          >
            <span className="text-xl">{emoji}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
