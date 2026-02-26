import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import RaccoonMascot from "@/components/RaccoonMascot";
import TaskCard from "@/components/TaskCard";
import KissTokens from "@/components/KissTokens";
import StreakDisplay from "@/components/StreakDisplay";
import RewardModal from "@/components/RewardModal";
import RewardProgress from "@/components/RewardProgress";
import MoodHistory from "@/components/MoodHistory";
import SettingsPanel from "@/components/SettingsPanel";
import TaskEditor from "@/components/TaskEditor";
import { RaccoonState, Task } from "@/types/app";
import { Plus } from "lucide-react";

export default function Index() {
  const { state, dispatch } = useApp();
  const [raccoonMessage, setRaccoonMessage] = useState("Hi love! Ready to be amazing today? 🦝💕");
  const [showReward, setShowReward] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const allCompleted = state.tasks.length > 0 && state.tasks.every((t) => t.isCompleted);
  const anyCompleted = state.tasks.some((t) => t.isCompleted);

  let raccoonState: RaccoonState = "idle";
  if (allCompleted) raccoonState = "celebrating";
  else if (anyCompleted) raccoonState = "happy";

  useEffect(() => {
    if (state.bigRewardUnlocked) setShowReward(true);
  }, [state.bigRewardUnlocked]);

  const handleAcknowledgeReward = () => {
    setShowReward(false);
    dispatch({ type: "ACKNOWLEDGE_BIG_REWARD" });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditorOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setEditorOpen(true);
  };

  const completedCount = state.tasks.filter((t) => t.isCompleted).length;
  const totalCount = state.tasks.length;

  return (
    <div className="min-h-screen bg-background pb-8">
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
        <div className="flex justify-center py-2">
          <RaccoonMascot state={raccoonState} message={raccoonMessage} size="lg" />
        </div>

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

        <KissTokens count={state.kissTokens} />

        {/* Secret reward progress */}
        <RewardProgress />

        {/* Tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg">📋 Tasks</h2>
            <button
              onClick={handleNewTask}
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {state.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEncouragementMessage={setRaccoonMessage}
                onEdit={handleEditTask}
              />
            ))}
            {state.tasks.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">
                No tasks yet! Tap + to add one 🦝
              </p>
            )}
          </div>
        </div>

        <MoodHistory history={state.moodHistory} />

        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground/60">
            Made with 💕 for the most wonderful person
          </p>
        </div>
      </main>

      <RewardModal open={showReward} onClose={handleAcknowledgeReward} />
      <TaskEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingTask(null);
        }}
        editingTask={editingTask}
      />
    </div>
  );
}
