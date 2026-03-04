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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RaccoonState, Task } from "@/types/app";
import { Plus } from "lucide-react";

/** Sort tasks: incomplete first (newest on top), completed at bottom */
function sortTasks(tasks: Task[]): Task[] {
  const incomplete = tasks.filter((t) => !t.isCompleted);
  const completed = tasks.filter((t) => t.isCompleted);
  return [...incomplete.reverse(), ...completed];
}

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

  // Separate and sort tasks by type
  const oneTimeTasks = sortTasks(state.tasks.filter((t) => t.taskType === "one-time"));
  const dailyTasks = sortTasks(state.tasks.filter((t) => t.taskType === "daily"));
  const weeklyTasks = sortTasks(state.tasks.filter((t) => t.taskType === "weekly"));

  const completedCount = state.tasks.filter((t) => t.isCompleted).length;
  const totalCount = state.tasks.length;

  const renderTaskList = (tasks: Task[], emptyMsg: string) => {
    if (tasks.length === 0) {
      return (
        <p className="text-center text-muted-foreground text-sm py-8">
          {emptyMsg}
        </p>
      );
    }
    return (
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEncouragementMessage={setRaccoonMessage}
            onEdit={handleEditTask}
          />
        ))}
      </div>
    );
  };

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
            <p className="text-xs text-muted-foreground font-medium">Today</p>
            <p className="font-display font-bold text-2xl">
              {completedCount}/{totalCount}
            </p>
            <p className="text-xs text-muted-foreground">tasks done</p>
          </div>
        </div>

        <KissTokens count={state.kissTokens} />
        <RewardProgress />

        {/* Add task button */}
        <div className="flex justify-end">
          <button
            onClick={handleNewTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* Tabbed sections */}
        <Tabs defaultValue="one-time" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="one-time" className="text-xs">✅ One-Time</TabsTrigger>
            <TabsTrigger value="daily" className="text-xs">📅 Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs">⏱ Weekly</TabsTrigger>
            <TabsTrigger value="mood" className="text-xs">💭 Mood</TabsTrigger>
          </TabsList>

          <TabsContent value="one-time">
            {renderTaskList(oneTimeTasks, "No one-time tasks yet! Tap + to add one 🦝")}
          </TabsContent>

          <TabsContent value="daily">
            {renderTaskList(dailyTasks, "No daily tasks yet! Tap + to add one 🦝")}
          </TabsContent>

          <TabsContent value="weekly">
            {renderTaskList(weeklyTasks, "No weekly tasks yet! Tap + to add one 🦝")}
          </TabsContent>

          <TabsContent value="mood">
            <MoodHistory history={state.moodHistory} />
          </TabsContent>
        </Tabs>

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
