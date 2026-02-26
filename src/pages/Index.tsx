import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import RaccoonMascot from "@/components/RaccoonMascot";
import TaskCard from "@/components/TaskCard";
import KissTokens from "@/components/KissTokens";
import StreakDisplay from "@/components/StreakDisplay";
import RewardModal from "@/components/RewardModal";
import MoodHistory from "@/components/MoodHistory";
import SettingsPanel from "@/components/SettingsPanel";
import { RaccoonState } from "@/types/app";
import { getCompletionMessage } from "@/lib/encouragement";

export default function Index() {
  const { state, dispatch } = useApp();
  const [raccoonMessage, setRaccoonMessage] = useState("Hi love! Ready to be amazing today? 🦝💕");
  const [showReward, setShowReward] = useState(false);

  // Determine raccoon state based on app state
  const anyRunning = false; // We can't easily detect this from state alone
  const allCompleted = state.tasks.every((t) => t.isCompleted);
  const anyCompleted = state.tasks.some((t) => t.isCompleted);

  let raccoonState: RaccoonState = "idle";
  if (allCompleted) raccoonState = "celebrating";
  else if (anyCompleted) raccoonState = "happy";

  // Show big reward modal
  useEffect(() => {
    if (state.bigRewardUnlocked) {
      setShowReward(true);
    }
  }, [state.bigRewardUnlocked]);

  const handleAcknowledgeReward = () => {
    setShowReward(false);
    dispatch({ type: "ACKNOWLEDGE_BIG_REWARD" });
  };

  const handleEncouragementMessage = (msg: string) => {
    setRaccoonMessage(msg);
  };

  // Completion percentage
  const completedCount = state.tasks.filter((t) => t.isCompleted).length;
  const totalCount = state.tasks.length;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/30 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-extrabold text-xl">Raccoonaki 🦝</h1>
            <p className="text-xs text-muted-foreground">Your cozy accountability buddy</p>
          </div>
          <SettingsPanel />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-4 mt-4">
        {/* Mascot section */}
        <div className="flex justify-center py-2">
          <RaccoonMascot state={raccoonState} message={raccoonMessage} size="lg" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <StreakDisplay streak={state.streak} />
          <div className="glass-card p-4 flex flex-col justify-center">
            <p className="text-xs text-muted-foreground font-medium">This Week</p>
            <p className="font-display font-bold text-2xl">
              {completedCount}/{totalCount}
            </p>
            <p className="text-xs text-muted-foreground">tasks done</p>
          </div>
        </div>

        {/* Kiss tokens */}
        <KissTokens count={state.kissTokens} />

        {/* Tasks */}
        <div>
          <h2 className="font-display font-bold text-lg mb-3">📋 Weekly Tasks</h2>
          <div className="space-y-3">
            {state.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEncouragementMessage={handleEncouragementMessage}
              />
            ))}
          </div>
        </div>

        {/* Mood history */}
        <MoodHistory history={state.moodHistory} />

        {/* Footer affirmation */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground/60">
            Made with 💕 for the most wonderful person
          </p>
        </div>
      </main>

      {/* Big reward modal */}
      <RewardModal open={showReward} onClose={handleAcknowledgeReward} />
    </div>
  );
}
