import { supabase } from "@/lib/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types";
import type {
  StudyPlanTask,
  CreateTaskInput,
  UpdateTaskInput,
} from "../types/study-plan.types";

type TaskInsert = TablesInsert<"study_plan_tasks">;
type TaskUpdate = TablesUpdate<"study_plan_tasks">;

// Response type
type TaskServiceResponse<T> = {
  data: T | null;
  error: string | null;
};

/**
 * Error handler for database operations
 */
function handleDatabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unexpected error occurred";
}

/**
 * Create a new task in a topic
 */
export async function createTask(
  input: CreateTaskInput
): Promise<TaskServiceResponse<StudyPlanTask>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to create a task",
      };
    }

    // Verify the topic belongs to the user (through study plan)
    const { data: topic, error: topicError } = await supabase
      .from("study_plan_topics")
      .select("study_plan_id, study_plans!inner(user_id)")
      .eq("id", input.topicId)
      .single();

    if (topicError || !topic) {
      return {
        data: null,
        error: "Topic not found",
      };
    }

    const studyPlan = Array.isArray(topic.study_plans)
      ? topic.study_plans[0]
      : topic.study_plans;

    if (studyPlan && "user_id" in studyPlan && studyPlan.user_id !== user.id) {
      return {
        data: null,
        error: "You don't have permission to add tasks to this topic",
      };
    }

    // Create the task (map camelCase to snake_case)
    const taskData: TaskInsert = {
      topic_id: input.topicId,
      title: input.title,
      description: input.description ?? null,
      order_index: input.orderIndex,
      estimated_time_minutes: input.estimatedTimeMinutes,
      task_type: input.taskType ?? "reading",
      resource_links: input.resourceLinks ?? null,
      is_completed: false,
      completed_at: null,
    };

    const { data, error } = await supabase
      .from("study_plan_tasks")
      .insert(taskData)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudyPlanTask,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Get all tasks for a topic
 */
export async function getTasksByTopic(
  topicId: string
): Promise<TaskServiceResponse<StudyPlanTask[]>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to view tasks",
      };
    }

    // Verify the topic belongs to the user
    const { data: topic, error: topicError } = await supabase
      .from("study_plan_topics")
      .select("study_plan_id, study_plans!inner(user_id)")
      .eq("id", topicId)
      .single();

    if (topicError || !topic) {
      return {
        data: null,
        error: "Topic not found",
      };
    }

    const studyPlan = Array.isArray(topic.study_plans)
      ? topic.study_plans[0]
      : topic.study_plans;

    if (studyPlan && "user_id" in studyPlan && studyPlan.user_id !== user.id) {
      return {
        data: null,
        error: "You don't have permission to view this topic",
      };
    }

    // Fetch tasks
    const { data, error } = await supabase
      .from("study_plan_tasks")
      .select("*")
      .eq("topic_id", topicId)
      .order("order_index", { ascending: true });

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudyPlanTask[],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  input: UpdateTaskInput
): Promise<TaskServiceResponse<StudyPlanTask>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to update a task",
      };
    }

    // Verify the task belongs to the user (through topic -> study plan)
    const { data: task, error: taskError } = await supabase
      .from("study_plan_tasks")
      .select(
        "topic_id, study_plan_topics!inner(study_plan_id, study_plans!inner(user_id))"
      )
      .eq("id", taskId)
      .single();

    if (taskError || !task) {
      return {
        data: null,
        error: "Task not found",
      };
    }

    const topic = Array.isArray(task.study_plan_topics)
      ? task.study_plan_topics[0]
      : task.study_plan_topics;

    if (topic && "study_plans" in topic) {
      const studyPlan = Array.isArray(topic.study_plans)
        ? topic.study_plans[0]
        : topic.study_plans;

      if (
        studyPlan &&
        "user_id" in studyPlan &&
        studyPlan.user_id !== user.id
      ) {
        return {
          data: null,
          error: "You don't have permission to update this task",
        };
      }
    }

    // Map camelCase input to snake_case database columns
    const taskUpdate: TaskUpdate = {};

    if (input.title !== undefined) taskUpdate.title = input.title;
    if (input.description !== undefined)
      taskUpdate.description = input.description;
    if (input.isCompleted !== undefined)
      taskUpdate.is_completed = input.isCompleted;
    if (input.estimatedTimeMinutes !== undefined)
      taskUpdate.estimated_time_minutes = input.estimatedTimeMinutes;
    if (input.taskType !== undefined) taskUpdate.task_type = input.taskType;
    if (input.resourceLinks !== undefined)
      taskUpdate.resource_links = input.resourceLinks;

    const { data, error } = await supabase
      .from("study_plan_tasks")
      .update(taskUpdate)
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudyPlanTask,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Toggle task completion status
 * Note: The database trigger automatically handles setting/clearing completed_at timestamp
 */
export async function toggleTaskCompletion(
  taskId: string,
  isCompleted: boolean
): Promise<TaskServiceResponse<StudyPlanTask>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to update a task",
      };
    }

    // Verify the task belongs to the user
    const { data: task, error: taskError } = await supabase
      .from("study_plan_tasks")
      .select(
        "topic_id, study_plan_topics!inner(study_plan_id, study_plans!inner(user_id))"
      )
      .eq("id", taskId)
      .single();

    if (taskError || !task) {
      return {
        data: null,
        error: "Task not found",
      };
    }

    const topic = Array.isArray(task.study_plan_topics)
      ? task.study_plan_topics[0]
      : task.study_plan_topics;

    if (topic && "study_plans" in topic) {
      const studyPlan = Array.isArray(topic.study_plans)
        ? topic.study_plans[0]
        : topic.study_plans;

      if (
        studyPlan &&
        "user_id" in studyPlan &&
        studyPlan.user_id !== user.id
      ) {
        return {
          data: null,
          error: "You don't have permission to update this task",
        };
      }
    }

    // Toggle completion (completed_at is automatically managed by database trigger)
    const { data, error } = await supabase
      .from("study_plan_tasks")
      .update({ is_completed: isCompleted })
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudyPlanTask,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Delete a task
 */
export async function deleteTask(
  taskId: string
): Promise<TaskServiceResponse<boolean>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to delete a task",
      };
    }

    // Verify the task belongs to the user
    const { data: task, error: taskError } = await supabase
      .from("study_plan_tasks")
      .select(
        "topic_id, study_plan_topics!inner(study_plan_id, study_plans!inner(user_id))"
      )
      .eq("id", taskId)
      .single();

    if (taskError || !task) {
      return {
        data: null,
        error: "Task not found",
      };
    }

    const topic = Array.isArray(task.study_plan_topics)
      ? task.study_plan_topics[0]
      : task.study_plan_topics;

    if (topic && "study_plans" in topic) {
      const studyPlan = Array.isArray(topic.study_plans)
        ? topic.study_plans[0]
        : topic.study_plans;

      if (
        studyPlan &&
        "user_id" in studyPlan &&
        studyPlan.user_id !== user.id
      ) {
        return {
          data: null,
          error: "You don't have permission to delete this task",
        };
      }
    }

    // Delete the task
    const { error } = await supabase
      .from("study_plan_tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: true,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}
