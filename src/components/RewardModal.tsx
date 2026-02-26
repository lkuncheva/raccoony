import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import RaccoonMascot from "./RaccoonMascot";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function RewardModal({ open, onClose }: Props) {
  useEffect(() => {
    if (open) {
      // Fire confetti! 🎉
      const end = Date.now() + 2000;
      const fire = () => {
        confetti({
          particleCount: 30,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#e8789a", "#f0b8c8", "#c9a0dc", "#f7d794", "#ff9ff3"],
        });
        if (Date.now() < end) requestAnimationFrame(fire);
      };
      fire();
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-foreground/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-8 max-w-sm w-full text-center space-y-4"
          >
            <RaccoonMascot state="celebrating" size="lg" />
            <h2 className="font-display font-extrabold text-2xl text-foreground">
              🎉 Surprise Date Unlocked!
            </h2>
            <p className="text-muted-foreground">
              You completed ALL tasks for 2 weeks in a row! You've earned a special surprise date.
              Raccoonaki is throwing a party! 🦝🎊
            </p>
            <p className="text-sm text-kiss font-semibold">
              You are truly incredible. Never forget that. 💕
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
            >
              Yay! Thank you! 💕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
