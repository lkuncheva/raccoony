import { motion } from "framer-motion";
import { RaccoonState } from "@/types/app";
import raccoonHappy from "@/assets/raccoon-happy.png";
import raccoonIdle from "@/assets/raccoon-idle.png";
import raccoonWorking from "@/assets/raccoon-working.png";
import raccoonCelebrating from "@/assets/raccoon-celebrating.png";

const RACCOON_IMAGES: Record<RaccoonState, string> = {
  idle: raccoonIdle,
  working: raccoonWorking,
  celebrating: raccoonCelebrating,
  happy: raccoonHappy,
};

interface Props {
  state: RaccoonState;
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: 80, md: 120, lg: 160 };

export default function RaccoonMascot({ state, message, size = "md" }: Props) {
  const imgSize = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Speech bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="glass-card px-4 py-2 text-sm text-center max-w-[220px] relative"
        >
          <p className="font-medium text-foreground/90">{message}</p>
          {/* Speech bubble arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card/80 border-r border-b border-border/50 rotate-45" />
        </motion.div>
      )}

      {/* Raccoon image with animation */}
      <motion.div
        animate={
          state === "celebrating"
            ? { y: [0, -10, 0], rotate: [0, -5, 5, 0] }
            : state === "working"
            ? { y: [0, -3, 0] }
            : { y: [0, -5, 0] }
        }
        transition={{
          duration: state === "celebrating" ? 0.6 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src={RACCOON_IMAGES[state]}
          alt={`Raccoonaki is ${state}`}
          width={imgSize}
          height={imgSize}
          className="drop-shadow-lg"
        />
      </motion.div>
    </div>
  );
}
