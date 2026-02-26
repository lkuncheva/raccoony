import { MoodEntry, MOOD_CONFIG } from "@/types/app";
import { getMoodInsight } from "@/lib/encouragement";

interface Props {
  history: MoodEntry[];
}

export default function MoodHistory({ history }: Props) {
  const recent = history.slice(-10).reverse();
  const insight = getMoodInsight(history);

  if (recent.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <h3 className="font-display font-bold text-sm text-muted-foreground mb-3">
        😊 Mood Journal
      </h3>

      {insight && (
        <p className="text-sm font-medium text-success mb-3 bg-success/10 rounded-xl px-3 py-2">
          {insight}
        </p>
      )}

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {recent.map((entry, i) => {
          const config = MOOD_CONFIG[entry.mood];
          const time = new Date(entry.timestamp).toLocaleString("en-US", {
            weekday: "short",
            hour: "numeric",
            minute: "2-digit",
          });
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{config.emoji}</span>
              <span className="text-muted-foreground">{config.label}</span>
              <span className="text-xs text-muted-foreground/60 ml-auto">
                {entry.type === "before" ? "before" : "after"} · {time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
