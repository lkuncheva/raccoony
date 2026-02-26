import { motion } from "framer-motion";

interface Props {
  count: number;
}

export default function KissTokens({ count }: Props) {
  // Show up to 10 individual kiss icons, then just the count
  const visibleKisses = Math.min(count, 10);

  return (
    <div className="glass-card p-4">
      <h3 className="font-display font-bold text-sm text-muted-foreground mb-2">
        💋 Kiss Tokens
      </h3>
      <div className="flex items-center gap-2 flex-wrap">
        {Array.from({ length: visibleKisses }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.05, type: "spring" }}
            className="text-2xl"
          >
            💋
          </motion.span>
        ))}
        {count > 10 && (
          <span className="text-sm font-bold text-kiss">+{count - 10} more</span>
        )}
        {count === 0 && (
          <p className="text-sm text-muted-foreground">Complete tasks to earn kisses!</p>
        )}
      </div>
      <p className="mt-2 text-lg font-display font-bold text-kiss">{count} total</p>
    </div>
  );
}
