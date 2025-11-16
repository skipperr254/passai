import { supabase } from "@/lib/supabase/client";
import type { StudyPlan } from "../types";
import type { Tables } from "@/lib/supabase/types";

type QuizAttempt = Tables<"quiz_attempts">;

/**
 * Service layer for study plan API interactions
 */

/**
 * Check if user has any completed quiz attempts for a specific subject
 * Returns the most recent completed attempt if found
 */
export const getCompletedQuizAttemptsForSubject = async (
  subjectId: string
): Promise<{ hasAttempts: boolean; latestAttempt: QuizAttempt | null }> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get completed quiz attempts for this subject
    const { data: attempts, error } = await supabase
      .from("quiz_attempts")
      .select(
        `
        *,
        quizzes!inner (
          id,
          subject_id,
          title
        )
      `
      )
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("quizzes.subject_id", subjectId)
      .order("completed_date", { ascending: false })
      .limit(1);

    if (error) throw error;

    return {
      hasAttempts: (attempts?.length || 0) > 0,
      latestAttempt: attempts?.[0] || null,
    };
  } catch (error) {
    console.error("Error checking quiz attempts:", error);
    throw error;
  }
};

/**
 * Check if user already has an active study plan for the subject
 */
export const hasActiveStudyPlan = async (
  subjectId: string
): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("studyy_plans")
      .select("id")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .eq("status", "active")
      .limit(1);

    if (error) throw error;

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error("Error checking study plan:", error);
    throw error;
  }
};

/**
 * Save generated study plan to database
 * Handles inserting to studyy_plans, studyy_plan_topics, and studyy_plan_tasks tables
 */
export const saveStudyPlanToDatabase = async (
  studyPlan: {
    title: string;
    description: string;
    total_hours: number;
    projected_pass_chance: number;
    topics: Array<{
      title: string;
      description: string;
      priority: string;
      total_time_minutes: number;
      tasks: Array<{
        title: string;
        description: string;
        task_type: string;
        estimated_time_minutes: number;
      }>;
    }>;
  },
  subjectId: string,
  testDate: string | null
): Promise<string> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const now = new Date();
    const endDate = testDate
      ? new Date(testDate)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Validate test date is in the future
    if (endDate <= now) {
      throw new Error(
        "Cannot create study plan for a test date in the past. Please set a future test date."
      );
    }

    // Insert study plan
    const { data: plan, error: planError } = await supabase
      .from("studyy_plans")
      .insert({
        user_id: user.id,
        subject_id: subjectId,
        title: studyPlan.title,
        description: studyPlan.description,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        total_hours: studyPlan.total_hours,
        projected_pass_chance: studyPlan.projected_pass_chance,
        status: "active",
      })
      .select()
      .single();

    if (planError) throw planError;

    // Insert topics and tasks
    for (let i = 0; i < studyPlan.topics.length; i++) {
      const topic = studyPlan.topics[i];

      const { data: topicData, error: topicError } = await supabase
        .from("studyy_plan_topics")
        .insert({
          studyy_plan_id: plan.id,
          title: topic.title,
          description: topic.description,
          order_index: i,
          priority: topic.priority,
          total_time_minutes: topic.total_time_minutes,
          total_tasks: topic.tasks.length,
          status: "not-started",
        })
        .select()
        .single();

      if (topicError) throw topicError;

      // Insert tasks for this topic
      const tasksToInsert = topic.tasks.map((task, taskIndex) => ({
        topic_id: topicData.id,
        title: task.title,
        description: task.description,
        task_type: task.task_type,
        estimated_time_minutes: task.estimated_time_minutes,
        order_index: taskIndex,
        is_completed: false,
      }));

      const { error: tasksError } = await supabase
        .from("studyy_plan_tasks")
        .insert(tasksToInsert);

      if (tasksError) throw tasksError;
    }

    return plan.id;
  } catch (error) {
    console.error("Error saving study plan to database:", error);
    throw new Error("Failed to save study plan");
  }
};

/**
 * Fetch study plans for a specific subject with nested topics and tasks
 */
export const fetchStudyPlans = async (
  subjectId: string
): Promise<StudyPlan[]> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch study plans with topics
    const { data: plans, error: plansError } = await supabase
      .from("studyy_plans")
      .select(
        `
        *,
        studyy_plan_topics (
          *,
          studyy_plan_tasks (*)
        )
      `
      )
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (plansError) throw plansError;

    // Transform database structure to match our StudyPlan type
    const transformedPlans: StudyPlan[] = (plans || []).map((plan) => {
      const planTopics =
        (plan.studyy_plan_topics as unknown as Array<{
          id: string;
          title: string;
          description: string;
          order_index: number;
          priority: string;
          status: string;
          total_tasks: number;
          total_time_minutes: number;
          mastery_level: number | null;
          studyy_plan_tasks: unknown;
        }>) || [];

      const topics = planTopics.map((topic) => {
        const topicTasks =
          (topic.studyy_plan_tasks as unknown as Array<{
            id: string;
            topic_id: string;
            title: string;
            description: string;
            task_type: string;
            estimated_time_minutes: number;
            order_index: number;
            is_completed: boolean;
            completed_at: string | null;
            resource_links: string[] | null;
          }>) || [];
        const completedTasksCount = topicTasks.filter(
          (t) => t.is_completed
        ).length;

        return {
          id: topic.id,
          title: topic.title,
          description: topic.description,
          order_index: topic.order_index,
          priority: topic.priority as "high" | "medium" | "low",
          status: topic.status as "not-started" | "in-progress" | "completed",
          total_tasks: topic.total_tasks,
          completed_tasks: completedTasksCount,
          total_time_minutes: topic.total_time_minutes,
          mastery_level: topic.mastery_level,
          tasks: topicTasks.map((task) => ({
            id: task.id,
            topic_id: task.topic_id,
            title: task.title,
            description: task.description,
            task_type: task.task_type as
              | "review"
              | "practice"
              | "reading"
              | "exercise"
              | "video",
            estimated_time_minutes: task.estimated_time_minutes,
            order_index: task.order_index,
            is_completed: task.is_completed,
            completed_at: task.completed_at,
            resource_links: task.resource_links,
          })),
        };
      });

      return {
        id: plan.id,
        subject_id: plan.subject_id,
        title: plan.title,
        description: plan.description,
        start_date: plan.start_date,
        end_date: plan.end_date,
        total_hours: plan.total_hours,
        projected_pass_chance: plan.projected_pass_chance,
        status: plan.status as "active" | "completed" | "paused",
        topics,
      };
    });

    return transformedPlans;
  } catch (error) {
    console.error("Error fetching study plans:", error);
    throw error;
  }
};

/**
 * Update task completion status
 */
export const updateTaskCompletion = async (
  taskId: string,
  isCompleted: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("studyy_plan_tasks")
      .update({
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      })
      .eq("id", taskId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating task completion:", error);
    throw error;
  }
};
