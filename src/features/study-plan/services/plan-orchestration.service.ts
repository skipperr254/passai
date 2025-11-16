/**
 * Study Plan Generation Orchestration Service
 *
 * Coordinates the complete flow of:
 * 1. Analyzing weak areas
 * 2. Generating AI plan
 * 3. Validating plan
 * 4. Saving to database
 */

import { supabase } from "@/lib/supabase/client";
import {
  generateStudyPlan,
  type GenerateStudyPlanInput,
} from "./ai-plan-generator.service";
import {
  validatePlanStructure,
  ensureTopicCoverage,
  validatePrioritization,
  adjustForTimeConstraints,
  calculatePlanMetadata,
} from "../utils/plan-validator";
import { getWeakTopics } from "./mastery.service";
import { calculateAvailableTime } from "../utils/time-calculations";

// =====================================================
// Types
// =====================================================

export interface GenerateAndSavePlanInput {
  subjectId: string;
  subjectName: string;
  examDate: Date;
  hoursPerDay: number;
  skipWeekends?: boolean;
  targetMastery?: number;
  focusAreas?: string[];
  minimumMasteryThreshold?: number; // For weak topics (default: 60)
  maxWeakTopics?: number; // Maximum weak topics to include (default: 5)
}

export interface GenerateAndSavePlanResponse {
  success: boolean;
  data?: {
    planId: string;
    plan: {
      id: string;
      title: string;
      description: string;
      totalHours: number;
      projectedPassChance: number;
      topicCount: number;
      taskCount: number;
    };
    metadata: ReturnType<typeof calculatePlanMetadata>;
    usedFallback: boolean;
    warnings: string[];
  };
  error?: string;
}

// =====================================================
// Main Orchestration Function
// =====================================================

/**
 * Generate a study plan using AI and save it to the database
 *
 * This is the main entry point for creating a complete study plan
 */
export async function generateAndSaveStudyPlan(
  input: GenerateAndSavePlanInput
): Promise<GenerateAndSavePlanResponse> {
  try {
    // 1. Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be logged in to generate a study plan",
      };
    }

    // 2. Get weak areas for the subject
    console.log("Fetching weak topics...");
    const weakAreasResponse = await getWeakTopics(
      input.subjectId,
      input.minimumMasteryThreshold || 60,
      input.maxWeakTopics || 5
    );

    if (weakAreasResponse.error || !weakAreasResponse.data) {
      return {
        success: false,
        error: weakAreasResponse.error || "Failed to fetch weak topics",
      };
    }

    const weakAreas = weakAreasResponse.data;

    if (weakAreas.length === 0) {
      return {
        success: false,
        error:
          "No weak areas identified. Complete some quizzes first to identify areas for improvement.",
      };
    }

    // 3. Calculate available time
    const totalHoursAvailable = calculateAvailableTime(
      input.examDate,
      input.hoursPerDay,
      input.skipWeekends
    );

    // 4. Generate plan with AI
    console.log("Generating study plan with AI...");
    const aiInput: GenerateStudyPlanInput = {
      subjectId: input.subjectId,
      subjectName: input.subjectName,
      weakAreas,
      examDate: input.examDate,
      hoursPerDay: input.hoursPerDay,
      skipWeekends: input.skipWeekends,
      targetMastery: input.targetMastery,
      focusAreas: input.focusAreas,
    };

    const planResponse = await generateStudyPlan(aiInput);

    if (planResponse.error || !planResponse.data) {
      return {
        success: false,
        error: planResponse.error || "Failed to generate study plan",
      };
    }

    let generatedPlan = planResponse.data;
    const usedFallback = planResponse.usedFallback;

    // 5. Validate plan structure
    console.log("Validating plan structure...");
    const structureValidation = validatePlanStructure(generatedPlan);
    const warnings: string[] = [...structureValidation.warnings];

    if (!structureValidation.isValid) {
      console.error(
        "Plan structure validation failed:",
        structureValidation.errors
      );
      return {
        success: false,
        error: `Generated plan has validation errors: ${structureValidation.errors.join(
          ", "
        )}`,
      };
    }

    // 6. Validate topic coverage
    const coverageAnalysis = ensureTopicCoverage(generatedPlan, weakAreas);
    if (!coverageAnalysis.isAdequate) {
      warnings.push(
        `Plan only covers ${
          coverageAnalysis.coveragePercentage
        }% of weak areas. Missing: ${coverageAnalysis.topicsMissing.join(", ")}`
      );
    }

    // 7. Validate prioritization
    const prioritizationValidation = validatePrioritization(
      generatedPlan,
      weakAreas
    );
    warnings.push(...prioritizationValidation.warnings);

    // 8. Adjust for time constraints if needed
    if (!generatedPlan.feasibility.isRealistic) {
      console.log("Adjusting plan for time constraints...");
      generatedPlan = adjustForTimeConstraints(
        generatedPlan,
        totalHoursAvailable
      );
      warnings.push("Plan was adjusted to fit available time constraints.");
    }

    // 9. Calculate metadata
    const metadata = calculatePlanMetadata(generatedPlan);

    // 10. Save to database
    console.log("Saving plan to database...");
    const savedPlanResponse = await savePlanToDatabase(
      user.id,
      input.subjectId,
      generatedPlan
    );

    if (!savedPlanResponse.success || !savedPlanResponse.data) {
      return {
        success: false,
        error: savedPlanResponse.error || "Failed to save plan to database",
      };
    }

    const planId = savedPlanResponse.data.planId;

    // 11. Return success with plan details
    return {
      success: true,
      data: {
        planId,
        plan: {
          id: planId,
          title: generatedPlan.title,
          description: generatedPlan.description,
          totalHours: generatedPlan.totalHoursEstimated,
          projectedPassChance: generatedPlan.projectedPassChance,
          topicCount: metadata.totalTopics,
          taskCount: metadata.totalTasks,
        },
        metadata,
        usedFallback,
        warnings,
      },
    };
  } catch (error) {
    console.error("Error in generateAndSaveStudyPlan:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// =====================================================
// Database Persistence
// =====================================================

/**
 * Save the generated plan to the database
 */
async function savePlanToDatabase(
  userId: string,
  subjectId: string,
  plan: {
    title: string;
    description: string;
    topics: Array<{
      name: string;
      description: string;
      order: number;
      estimatedHours: number;
      currentMastery: number;
      targetMastery: number;
      priority: number;
      tasks: Array<{
        title: string;
        description: string;
        order: number;
        estimatedMinutes: number;
        taskType: string;
        resources?: string[];
      }>;
    }>;
    totalHoursEstimated: number;
    projectedPassChance: number;
  }
): Promise<{ success: boolean; data?: { planId: string }; error?: string }> {
  try {
    // 1. Insert study plan
    const now = new Date();
    const startDate = now.toISOString().split("T")[0]; // Today
    const endDate = plan.topics[0]?.name ? startDate : startDate; // Will be overridden if we have exam date

    const { data: studyPlan, error: planError } = await supabase
      .from("study_plans")
      .insert({
        user_id: userId,
        subject_id: subjectId,
        title: plan.title,
        description: plan.description,
        start_date: startDate,
        end_date: endDate,
        total_hours: Math.round(plan.totalHoursEstimated),
        projected_pass_chance: Math.round(plan.projectedPassChance),
        status: "active",
      })
      .select("id")
      .single();

    if (planError || !studyPlan) {
      console.error("Error creating study plan:", planError);
      return {
        success: false,
        error: handleDatabaseError(planError),
      };
    }

    const planId = studyPlan.id;

    // 2. Insert topics
    for (const topic of plan.topics) {
      const totalTimeMinutes = Math.round(topic.estimatedHours * 60);
      const totalTasks = topic.tasks.length;

      // Map priority number (1-5) to string (low/medium/high)
      const priorityString =
        topic.priority >= 4 ? "high" : topic.priority >= 3 ? "medium" : "low";

      const { data: savedTopic, error: topicError } = await supabase
        .from("study_plan_topics")
        .insert({
          study_plan_id: planId,
          title: topic.name,
          description: topic.description,
          order_index: topic.order,
          total_time_minutes: totalTimeMinutes,
          total_tasks: totalTasks,
          mastery_level: Math.round(topic.currentMastery),
          priority: priorityString,
          status: "not_started",
        })
        .select("id")
        .single();

      if (topicError || !savedTopic) {
        console.error("Error creating topic:", topicError);
        // Rollback: delete the plan
        await supabase.from("study_plans").delete().eq("id", planId);
        return {
          success: false,
          error: `Failed to save topic "${topic.name}": ${handleDatabaseError(
            topicError
          )}`,
        };
      }

      const topicId = savedTopic.id;

      // 3. Insert tasks for this topic
      const tasksToInsert = topic.tasks.map((task) => ({
        topic_id: topicId,
        title: task.title,
        description: task.description,
        order_index: task.order,
        estimated_time_minutes: task.estimatedMinutes,
        task_type: task.taskType,
        resource_links: task.resources || [],
        is_completed: false,
      }));

      const { error: tasksError } = await supabase
        .from("study_plan_tasks")
        .insert(tasksToInsert);

      if (tasksError) {
        console.error("Error creating tasks:", tasksError);
        // Rollback: delete the plan (cascade will delete topics and tasks)
        await supabase.from("study_plans").delete().eq("id", planId);
        return {
          success: false,
          error: `Failed to save tasks for topic "${
            topic.name
          }": ${handleDatabaseError(tasksError)}`,
        };
      }
    }

    return {
      success: true,
      data: { planId },
    };
  } catch (error) {
    console.error("Error in savePlanToDatabase:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save plan",
    };
  }
}

/**
 * Handle database errors
 */
function handleDatabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: string; code?: string }).message;
    const code = (error as { code?: string }).code;

    // Handle specific PostgreSQL error codes
    if (code === "23505") {
      return "A study plan with this name already exists.";
    }

    if (code === "23503") {
      return "Referenced entity not found (subject or plan).";
    }

    if (message.includes("row-level security")) {
      return "You do not have permission to perform this action.";
    }

    return message;
  }

  return "An unexpected database error occurred";
}
