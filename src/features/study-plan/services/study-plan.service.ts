import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";
import type {
  StudyPlan,
  StudyPlanWithDetails,
  CreateStudyPlanInput,
  UpdateStudyPlanInput,
  StudyPlanFilters,
  StudyPlanSortOptions,
} from "../types";
import {
  createStudyPlanSchema,
  updateStudyPlanSchema,
  studyPlanFiltersSchema,
} from "./schemas";

// =============================================
// Types
// =============================================

export type StudyPlanServiceResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// =============================================
// Error Handler
// =============================================

function handleDatabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: string; code?: string }).message;
    const code = (error as { code?: string }).code;

    // Handle specific PostgreSQL error codes
    if (code === "23505") {
      return "A study plan with this name already exists for this subject.";
    }

    if (code === "23503") {
      return "Subject not found. Please select a valid subject.";
    }

    if (message.includes("row-level security")) {
      return "You do not have permission to perform this action.";
    }

    return message;
  }

  return "An unexpected error occurred. Please try again.";
}

// =============================================
// CRUD Operations
// =============================================

/**
 * Create a new study plan
 */
export async function createStudyPlan(
  input: CreateStudyPlanInput
): Promise<StudyPlanServiceResponse<StudyPlan>> {
  try {
    // Validate input
    const validated = createStudyPlanSchema.parse({
      userId: input.userId,
      subjectId: input.subjectId,
      title: input.title,
      description: input.description,
      startDate: input.startDate,
      endDate: input.endDate,
      totalHours: input.totalHours,
      projectedPassChance: input.projectedPassChance,
    });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to create a study plan.",
      };
    }

    // Verify user owns the subject
    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .select("id")
      .eq("id", validated.subjectId)
      .eq("user_id", user.id)
      .single();

    if (subjectError || !subject) {
      return {
        success: false,
        error: "Subject not found or you do not have permission to access it.",
      };
    }

    // Insert study plan
    const { data, error } = await supabase
      .from("study_plans")
      .insert({
        user_id: user.id,
        subject_id: validated.subjectId,
        title: validated.title,
        description: validated.description || null,
        start_date: validated.startDate,
        end_date: validated.endDate,
        total_hours: validated.totalHours,
        projected_pass_chance: validated.projectedPassChance || null,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Failed to create study plan. Please try again.",
      };
    }

    return {
      success: true,
      data: data as StudyPlan,
      message: "Study plan created successfully!",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input data. Please check your form.",
      };
    }
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Get a study plan by ID with all topics and tasks
 */
export async function getStudyPlanById(
  id: string
): Promise<StudyPlanServiceResponse<StudyPlanWithDetails>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to view this study plan.",
      };
    }

    // Fetch plan with subject
    const { data: plan, error: planError } = await supabase
      .from("study_plans")
      .select(
        `
        *,
        subject:subjects(id, name, test_date, pass_chance)
      `
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (planError) {
      if (planError.code === "PGRST116") {
        return {
          success: false,
          error: "Study plan not found.",
        };
      }
      return {
        success: false,
        error: handleDatabaseError(planError),
      };
    }

    if (!plan) {
      return {
        success: false,
        error: "Study plan not found.",
      };
    }

    // Fetch topics with tasks
    const { data: topics, error: topicsError } = await supabase
      .from("study_plan_topics")
      .select("*")
      .eq("study_plan_id", id)
      .order("order_index", { ascending: true });

    if (topicsError) {
      return {
        success: false,
        error: handleDatabaseError(topicsError),
      };
    }

    // Fetch all tasks for these topics
    const topicIds = (topics || []).map((t) => t.id);
    type TaskRow = Tables<"study_plan_tasks">;
    let tasks: TaskRow[] = [];

    if (topicIds.length > 0) {
      const { data: tasksData, error: tasksError } = await supabase
        .from("study_plan_tasks")
        .select("*")
        .in("topic_id", topicIds)
        .order("order_index", { ascending: true });

      if (tasksError) {
        return {
          success: false,
          error: handleDatabaseError(tasksError),
        };
      }

      tasks = (tasksData as TaskRow[]) || [];
    }

    // Combine topics with their tasks
    const topicsWithTasks = (topics || []).map((topic) => ({
      ...topic,
      tasks: tasks.filter((task) => task.topic_id === topic.id),
    }));

    const result: StudyPlanWithDetails = {
      ...plan,
      topics: topicsWithTasks,
      subject: plan.subject,
    } as StudyPlanWithDetails;

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Get all study plans for a subject
 */
export async function getStudyPlansBySubject(
  subjectId: string
): Promise<StudyPlanServiceResponse<StudyPlan[]>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to view study plans.",
      };
    }

    const { data, error } = await supabase
      .from("study_plans")
      .select("*")
      .eq("subject_id", subjectId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    return {
      success: true,
      data: (data || []) as StudyPlan[],
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Get all active study plans for the current user
 */
export async function getActiveStudyPlans(): Promise<
  StudyPlanServiceResponse<StudyPlan[]>
> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to view study plans.",
      };
    }

    const { data, error } = await supabase
      .from("study_plans")
      .select(
        `
        *,
        subject:subjects(id, name, test_date)
      `
      )
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("end_date", { ascending: true });

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    return {
      success: true,
      data: (data || []) as StudyPlan[],
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Get study plans with filters and sorting
 */
export async function getStudyPlans(
  filters?: StudyPlanFilters,
  sortOptions?: StudyPlanSortOptions
): Promise<StudyPlanServiceResponse<StudyPlan[]>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to view study plans.",
      };
    }

    // Validate filters
    const validatedFilters = filters
      ? studyPlanFiltersSchema.parse(filters)
      : {};

    let query = supabase.from("study_plans").select("*").eq("user_id", user.id);

    // Apply filters
    if (validatedFilters.subjectId) {
      query = query.eq("subject_id", validatedFilters.subjectId);
    }

    if (validatedFilters.status) {
      if (Array.isArray(validatedFilters.status)) {
        query = query.in("status", validatedFilters.status);
      } else {
        query = query.eq("status", validatedFilters.status);
      }
    }

    if (validatedFilters.startDateFrom) {
      query = query.gte("start_date", validatedFilters.startDateFrom);
    }

    if (validatedFilters.startDateTo) {
      query = query.lte("start_date", validatedFilters.startDateTo);
    }

    if (validatedFilters.endDateFrom) {
      query = query.gte("end_date", validatedFilters.endDateFrom);
    }

    if (validatedFilters.endDateTo) {
      query = query.lte("end_date", validatedFilters.endDateTo);
    }

    // Apply sorting
    if (sortOptions) {
      query = query.order(sortOptions.field, {
        ascending: sortOptions.direction === "asc",
      });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    return {
      success: true,
      data: (data || []) as StudyPlan[],
    };
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid filter parameters.",
      };
    }
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Update a study plan
 */
export async function updateStudyPlan(
  id: string,
  input: UpdateStudyPlanInput
): Promise<StudyPlanServiceResponse<StudyPlan>> {
  try {
    // Validate input
    const validated = updateStudyPlanSchema.parse(input);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to update this study plan.",
      };
    }

    const { data, error } = await supabase
      .from("study_plans")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          success: false,
          error:
            "Study plan not found or you do not have permission to update it.",
        };
      }
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Failed to update study plan. Please try again.",
      };
    }

    return {
      success: true,
      data: data as StudyPlan,
      message: "Study plan updated successfully!",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input data. Please check your form.",
      };
    }
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Archive a study plan (set status to archived)
 */
export async function archiveStudyPlan(
  id: string
): Promise<StudyPlanServiceResponse<StudyPlan>> {
  return updateStudyPlan(id, { status: "archived" });
}

/**
 * Complete a study plan (set status to completed)
 */
export async function completeStudyPlan(
  id: string
): Promise<StudyPlanServiceResponse<StudyPlan>> {
  return updateStudyPlan(id, { status: "completed" });
}

/**
 * Delete a study plan
 * This will cascade delete all topics and tasks
 */
export async function deleteStudyPlan(
  id: string
): Promise<StudyPlanServiceResponse> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to delete this study plan.",
      };
    }

    const { error } = await supabase
      .from("study_plans")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    return {
      success: true,
      message: "Study plan deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Update projected pass chance for a study plan
 */
export async function updateProjectedPassChance(
  id: string,
  projectedPassChance: number
): Promise<StudyPlanServiceResponse> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    const { error } = await supabase
      .from("study_plans")
      .update({
        projected_pass_chance: projectedPassChance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        error: handleDatabaseError(error),
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleDatabaseError(error),
    };
  }
}
