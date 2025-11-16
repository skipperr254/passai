import { supabase } from "@/lib/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types";
import type {
  StudyPlanTopic,
  CreateTopicInput,
  UpdateTopicInput,
  TopicStatus,
} from "../types/study-plan.types";

type TopicInsert = TablesInsert<"study_plan_topics">;
type TopicUpdate = TablesUpdate<"study_plan_topics">;

// Response type
type TopicServiceResponse<T> = {
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
 * Create a new topic in a study plan
 */
export async function createTopic(
  input: CreateTopicInput
): Promise<TopicServiceResponse<StudyPlanTopic>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to create a topic",
      };
    }

    // Verify the study plan belongs to the user
    const { data: plan, error: planError } = await supabase
      .from("study_plans")
      .select("user_id")
      .eq("id", input.studyPlanId)
      .single();

    if (planError || !plan) {
      return {
        data: null,
        error: "Study plan not found",
      };
    }

    if (plan.user_id !== user.id) {
      return {
        data: null,
        error: "You don't have permission to add topics to this study plan",
      };
    }

    // Create the topic (map camelCase to snake_case)
    const topicData: TopicInsert = {
      study_plan_id: input.studyPlanId,
      title: input.title,
      description: input.description ?? null,
      order_index: input.orderIndex,
      total_time_minutes: input.totalTimeMinutes,
      total_tasks: 0,
      status: "not_started",
      mastery_level: null,
      priority: input.priority ?? "medium",
    };

    const { data, error } = await supabase
      .from("study_plan_topics")
      .insert(topicData)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudyPlanTopic,
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
 * Get all topics for a study plan
 */
export async function getTopicsByPlan(
  studyPlanId: string
): Promise<TopicServiceResponse<StudyPlanTopic[]>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to view topics",
      };
    }

    // Verify the study plan belongs to the user
    const { data: plan, error: planError } = await supabase
      .from("study_plans")
      .select("user_id")
      .eq("id", studyPlanId)
      .single();

    if (planError || !plan) {
      return {
        data: null,
        error: "Study plan not found",
      };
    }

    if (plan.user_id !== user.id) {
      return {
        data: null,
        error: "You don't have permission to view this study plan",
      };
    }

    // Fetch topics
    const { data, error } = await supabase
      .from("study_plan_topics")
      .select("*")
      .eq("study_plan_id", studyPlanId)
      .order("order_index", { ascending: true });

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudyPlanTopic[],
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
 * Update a topic
 */
export async function updateTopic(
  topicId: string,
  input: UpdateTopicInput
): Promise<TopicServiceResponse<StudyPlanTopic>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to update a topic",
      };
    }

    // Verify the topic belongs to the user (through the study plan)
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
        error: "You don't have permission to update this topic",
      };
    }

    // Map camelCase input to snake_case database columns
    const topicUpdate: TopicUpdate = {};

    if (input.title !== undefined) topicUpdate.title = input.title;
    if (input.description !== undefined)
      topicUpdate.description = input.description;
    if (input.status !== undefined) topicUpdate.status = input.status;
    if (input.masteryLevel !== undefined)
      topicUpdate.mastery_level = input.masteryLevel;
    if (input.priority !== undefined) topicUpdate.priority = input.priority;

    const { data, error } = await supabase
      .from("study_plan_topics")
      .update(topicUpdate)
      .eq("id", topicId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudyPlanTopic,
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
 * Update topic mastery level in study_plan_topics table
 * @param masteryLevel - Value from 0-100 representing mastery percentage
 */
export async function updateTopicMasteryLevel(
  topicId: string,
  masteryLevel: number
): Promise<TopicServiceResponse<StudyPlanTopic>> {
  try {
    // Validate mastery level (0-100 scale in database)
    if (masteryLevel < 0 || masteryLevel > 100) {
      return {
        data: null,
        error: "Mastery level must be between 0 and 100",
      };
    }

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to update mastery",
      };
    }

    // Verify the topic belongs to the user (through the study plan)
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
        error: "You don't have permission to update this topic",
      };
    }

    // Update mastery (database uses mastery_level 0-100)
    const { data, error } = await supabase
      .from("study_plan_topics")
      .update({ mastery_level: Math.round(masteryLevel) })
      .eq("id", topicId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudyPlanTopic,
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
 * Update topic status
 */
export async function updateTopicStatus(
  topicId: string,
  status: TopicStatus
): Promise<TopicServiceResponse<StudyPlanTopic>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to update topic status",
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
        error: "You don't have permission to update this topic",
      };
    }

    // Update status
    const { data, error } = await supabase
      .from("study_plan_topics")
      .update({ status })
      .eq("id", topicId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudyPlanTopic,
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
 * Delete a topic
 */
export async function deleteTopic(
  topicId: string
): Promise<TopicServiceResponse<boolean>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to delete a topic",
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
        error: "You don't have permission to delete this topic",
      };
    }

    // Delete the topic (CASCADE will handle related tasks)
    const { error } = await supabase
      .from("study_plan_topics")
      .delete()
      .eq("id", topicId);

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
