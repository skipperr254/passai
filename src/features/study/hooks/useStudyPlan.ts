import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { StudyPlan, StudyPlanTopic, TopicExpansionState } from "../types";
import { fetchStudyPlans, updateTaskCompletion } from "../services/studyPlanService";
import { toast } from "sonner";

/**
 * Custom hook to manage study plan state
 * Handles task completion, topic expansion, and progress calculations
 * Integrates with database for persistence
 */
export const useStudyPlan = (initialPlan: StudyPlan | null) => {
  // State for topic expansion
  const [expandedTopics, setExpandedTopics] = useState<TopicExpansionState>({});

  // State for the study plan with updated task completion
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(initialPlan);

  // Update local state when initialPlan changes
  useEffect(() => {
    if (initialPlan) {
      setStudyPlan(initialPlan);
    }
  }, [initialPlan]);

  // Toggle topic expansion
  const toggleTopic = useCallback((topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  }, []);

  // Check if topic is expanded
  const isTopicExpanded = useCallback(
    (topicId: string): boolean => {
      return expandedTopics[topicId] || false;
    },
    [expandedTopics]
  );

  // Toggle task completion
  const toggleTask = useCallback(
    async (topicId: string, taskId: string) => {
      if (!studyPlan) return;

      // Find the task to get its current state
      const topic = studyPlan.topics.find((t) => t.id === topicId);
      const task = topic?.tasks.find((t) => t.id === taskId);
      if (!task) return;

      const newCompletedState = !task.is_completed;

      // Optimistic update
      setStudyPlan((prevPlan) => {
        if (!prevPlan) return prevPlan;

        const updatedTopics = prevPlan.topics.map((topic) => {
          if (topic.id !== topicId) return topic;

          const updatedTasks = topic.tasks.map((task) => {
            if (task.id !== taskId) return task;

            return {
              ...task,
              is_completed: newCompletedState,
              completed_at: newCompletedState ? new Date().toISOString() : null,
            };
          });

          const completedTasksCount = updatedTasks.filter(
            (task) => task.is_completed
          ).length;

          // Determine topic status based on completion
          let status: StudyPlanTopic["status"] = "not-started";
          if (completedTasksCount === updatedTasks.length) {
            status = "completed";
          } else if (completedTasksCount > 0) {
            status = "in-progress";
          }

          return {
            ...topic,
            tasks: updatedTasks,
            completed_tasks: completedTasksCount,
            status,
          };
        });

        return {
          ...prevPlan,
          topics: updatedTopics,
        };
      });

      // Update database
      try {
        await updateTaskCompletion(taskId, newCompletedState);
      } catch (error) {
        console.error("Error updating task:", error);
        toast.error("Failed to update task", {
          description: "Your progress may not be saved.",
        });

        // Revert optimistic update on error
        setStudyPlan(studyPlan);
      }
    },
    [studyPlan]
  );

  // Calculate total and completed tasks across all topics
  const { totalTasks, completedTasks } = useMemo(() => {
    if (!studyPlan) {
      return { totalTasks: 0, completedTasks: 0 };
    }

    return studyPlan.topics.reduce(
      (acc, topic) => ({
        totalTasks: acc.totalTasks + topic.total_tasks,
        completedTasks: acc.completedTasks + topic.completed_tasks,
      }),
      { totalTasks: 0, completedTasks: 0 }
    );
  }, [studyPlan]);

  return {
    studyPlan,
    expandedTopics,
    totalTasks,
    completedTasks,
    toggleTopic,
    toggleTask,
    isTopicExpanded,
  };
};

/**
 * Hook for fetching study plans from the backend using React Query
 */
export const useStudyPlans = (subjectId: string | undefined) => {
  return useQuery({
    queryKey: ["studyPlans", subjectId],
    queryFn: () => fetchStudyPlans(subjectId!),
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
