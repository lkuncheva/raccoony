import { useRef, useState, useCallback, useEffect } from "react";
import { useApp } from "@/context/AppContext";

/**
 * Timer hook for tracking time on a specific task.
 * Ticks every second and dispatches to context.
 */
export function useTimer(taskId: string) {
  const { state, dispatch } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const task = state.tasks.find((t) => t.id === taskId);
  const requiredSeconds = (task?.requiredWeeklyHours ?? 0) * 3600;
  const accumulatedSeconds = task?.accumulatedSeconds ?? 0;
  const isCompleted = task?.isCompleted ?? false;

  // Check if task just reached goal
  const justCompleted = requiredSeconds > 0 && accumulatedSeconds >= requiredSeconds && !isCompleted;

  const start = useCallback(() => {
    if (isRunning || isCompleted) return;
    setIsRunning(true);
  }, [isRunning, isCompleted]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Handle the interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK_TIMER", taskId });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, taskId, dispatch]);

  // Auto-complete when time is reached
  useEffect(() => {
    if (justCompleted) {
      stop();
      dispatch({ type: "COMPLETE_TASK", taskId });
    }
  }, [justCompleted, stop, dispatch, taskId]);

  const progress = requiredSeconds > 0 ? Math.min(accumulatedSeconds / requiredSeconds, 1) : 0;

  return {
    isRunning,
    start,
    stop,
    accumulatedSeconds,
    requiredSeconds,
    progress,
    isCompleted,
    justCompleted,
  };
}
