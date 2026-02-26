import { MoodOption } from "@/types/app";

/** Encouragement templates organized by context */
const MESSAGES = {
  starting: {
    low: [
      "Even a tiny step counts. Raccoonaki believes in you 🦝💕",
      "You showed up — that's the hardest part. Let's go slow together.",
      "Low energy is okay. Just start, and we'll see how it goes.",
    ],
    overwhelmed: [
      "Take a deep breath. One thing at a time. You've got this.",
      "Raccoonaki is sitting right next to you. No rush.",
      "It's okay to feel this way. Just being here is brave.",
    ],
    neutral: [
      "Ready when you are! Let's do this 🌸",
      "A little progress goes a long way. Let's begin!",
      "Raccoonaki is cheering for you already!",
    ],
    okay: [
      "Good vibes! Let's make the most of this energy ✨",
      "You're feeling okay — let's turn that into great!",
      "Every minute counts. Let's go! 🦝",
    ],
    motivated: [
      "YES! Channel that energy! You're unstoppable! 🔥",
      "Motivation mode activated! Raccoonaki is SO excited!",
      "Let's ride this wave together! 🌊✨",
    ],
  },
  midSession: [
    "You're doing amazing, keep going! 🌟",
    "Raccoonaki is watching with heart eyes 🥺",
    "Look at you, being all productive and wonderful!",
    "Every second is progress. You're incredible.",
    "This is your time. Own it! 💪",
  ],
  completion: [
    "That's another kiss earned 💋",
    "Raccoonaki is SO proud of you! 🦝✨",
    "You did it! Time for a little celebration!",
    "Look at you go! A star! 🌟",
    "Task complete! You're amazing and don't forget it.",
  ],
  streakCelebration: [
    "🔥 Streak power! You're on fire!",
    "Consistency is your superpower! Keep shining!",
    "Raccoonaki can't believe how amazing you are! 🦝🔥",
  ],
  streakReset: [
    "Fresh start! Every journey has pauses. Let's go again 🌱",
    "It's okay. What matters is you're here now. 💕",
    "Raccoonaki still loves you just the same 🦝❤️",
    "New week, new possibilities. You've got this!",
  ],
  afterTask: {
    low: [
      "You did it even on a hard day. That takes real strength 💪",
      "See? You're more capable than you think, even on low days.",
    ],
    overwhelmed: [
      "You pushed through the overwhelm. That's incredible courage.",
      "The hardest sessions build the strongest you. 🌸",
    ],
    neutral: [
      "Nice work! Steady progress is still progress!",
      "Another session done! Raccoonaki approves 🦝👍",
    ],
    okay: [
      "Great session! Feeling even better now?",
      "You showed up and delivered. Love that for you! 💕",
    ],
    motivated: [
      "That energy was EVERYTHING! Incredible session!",
      "You crushed it! Raccoonaki is doing a happy dance! 🦝💃",
    ],
  },
};

/** Pick a random item from an array */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getStartingMessage(mood: MoodOption): string {
  return pickRandom(MESSAGES.starting[mood]);
}

export function getMidSessionMessage(): string {
  return pickRandom(MESSAGES.midSession);
}

export function getCompletionMessage(): string {
  return pickRandom(MESSAGES.completion);
}

export function getStreakMessage(isReset: boolean): string {
  return pickRandom(isReset ? MESSAGES.streakReset : MESSAGES.streakCelebration);
}

export function getAfterTaskMessage(mood: MoodOption): string {
  return pickRandom(MESSAGES.afterTask[mood]);
}

export function getMoodInsight(history: { type: string; mood: MoodOption }[]): string | null {
  const befores = history.filter((m) => m.type === "before");
  const afters = history.filter((m) => m.type === "after");
  if (befores.length < 3 || afters.length < 3) return null;

  const moodValues: Record<MoodOption, number> = {
    low: 1, overwhelmed: 1, neutral: 3, okay: 4, motivated: 5,
  };

  const avgBefore = befores.reduce((s, m) => s + moodValues[m.mood], 0) / befores.length;
  const avgAfter = afters.reduce((s, m) => s + moodValues[m.mood], 0) / afters.length;

  if (avgAfter > avgBefore + 0.5) {
    return "You usually feel better after starting. That's powerful. 🌟";
  }
  return null;
}
