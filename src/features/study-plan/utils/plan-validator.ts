/**
 * Study Plan Validation Utilities
 *
 * Validates plan structure, ensures topic coverage, and verifies time estimates
 */

import type {
  AIGeneratedPlan,
  AIGeneratedTopic,
} from "../services/ai-plan-generator.service";
import type { WeakArea } from "../types/analytics.types";

// =====================================================
// Validation Types
// =====================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CoverageAnalysis {
  topicsCovered: string[];
  topicsMissing: string[];
  coveragePercentage: number;
  isAdequate: boolean;
}

// =====================================================
// Plan Structure Validation
// =====================================================

/**
 * Validate the complete plan structure
 */
export function validatePlanStructure(plan: AIGeneratedPlan): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!plan.title || plan.title.trim().length === 0) {
    errors.push("Plan must have a title");
  } else if (plan.title.length > 100) {
    warnings.push("Plan title is very long (> 100 characters)");
  }

  // Description validation
  if (!plan.description || plan.description.trim().length === 0) {
    warnings.push("Plan should have a description");
  }

  // Topics validation
  if (!plan.topics || plan.topics.length === 0) {
    errors.push("Plan must have at least one topic");
  } else {
    // Validate each topic
    plan.topics.forEach((topic, idx) => {
      const topicValidation = validateTopic(topic, idx);
      errors.push(...topicValidation.errors);
      warnings.push(...topicValidation.warnings);
    });

    // Check for duplicate topic names
    const topicNames = plan.topics.map((t) => t.name.toLowerCase());
    const duplicates = topicNames.filter(
      (name, idx) => topicNames.indexOf(name) !== idx
    );
    if (duplicates.length > 0) {
      warnings.push(`Duplicate topic names found: ${duplicates.join(", ")}`);
    }
  }

  // Time estimation validation
  if (plan.totalHoursEstimated <= 0) {
    errors.push("Total hours estimated must be greater than 0");
  } else if (plan.totalHoursEstimated > 1000) {
    warnings.push(
      "Total hours estimated seems unrealistically high (> 1000 hours)"
    );
  }

  // Calculate actual total from topics
  const calculatedTotal = plan.topics.reduce(
    (sum, topic) => sum + topic.estimatedHours,
    0
  );
  const difference = Math.abs(calculatedTotal - plan.totalHoursEstimated);
  if (difference > 0.5) {
    errors.push(
      `Total hours mismatch: plan says ${
        plan.totalHoursEstimated
      }h but topics sum to ${calculatedTotal.toFixed(1)}h`
    );
  }

  // Pass chance validation
  if (plan.projectedPassChance < 0 || plan.projectedPassChance > 100) {
    errors.push("Projected pass chance must be between 0 and 100");
  } else if (plan.projectedPassChance < 50) {
    warnings.push(
      "Projected pass chance is below 50%. Consider adjusting the plan to improve outcomes."
    );
  }

  // Feasibility validation
  if (!plan.feasibility) {
    warnings.push("Plan should include feasibility analysis");
  } else if (!plan.feasibility.isRealistic) {
    warnings.push("Plan is not realistic given time constraints");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a single topic
 */
function validateTopic(topic: AIGeneratedTopic, idx: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const prefix = `Topic ${idx + 1}`;

  // Name validation
  if (!topic.name || topic.name.trim().length === 0) {
    errors.push(`${prefix}: Must have a name`);
  } else if (topic.name.length > 100) {
    warnings.push(`${prefix}: Name is very long (> 100 characters)`);
  }

  // Hours validation
  if (topic.estimatedHours <= 0) {
    errors.push(`${prefix}: Estimated hours must be greater than 0`);
  } else if (topic.estimatedHours > 100) {
    warnings.push(
      `${prefix}: Estimated hours seems very high (> 100 hours for one topic)`
    );
  }

  // Mastery validation
  if (topic.currentMastery < 0 || topic.currentMastery > 100) {
    errors.push(`${prefix}: Current mastery must be between 0 and 100`);
  }

  if (topic.targetMastery < 0 || topic.targetMastery > 100) {
    errors.push(`${prefix}: Target mastery must be between 0 and 100`);
  }

  if (topic.targetMastery <= topic.currentMastery) {
    warnings.push(
      `${prefix}: Target mastery (${topic.targetMastery}) should be higher than current (${topic.currentMastery})`
    );
  }

  // Priority validation
  if (topic.priority < 1 || topic.priority > 5) {
    errors.push(`${prefix}: Priority must be between 1 and 5`);
  }

  // Tasks validation
  if (!topic.tasks || topic.tasks.length === 0) {
    errors.push(`${prefix}: Must have at least one task`);
  } else {
    // Calculate total task time
    const totalTaskMinutes = topic.tasks.reduce(
      (sum, task) => sum + task.estimatedMinutes,
      0
    );
    const totalTaskHours = totalTaskMinutes / 60;
    const difference = Math.abs(totalTaskHours - topic.estimatedHours);

    if (difference > topic.estimatedHours * 0.2) {
      // Allow 20% difference
      warnings.push(
        `${prefix}: Task times (${totalTaskHours.toFixed(
          1
        )}h) don't match topic estimate (${topic.estimatedHours}h)`
      );
    }

    // Validate each task
    topic.tasks.forEach((task, taskIdx) => {
      if (!task.title || task.title.trim().length === 0) {
        errors.push(`${prefix}, Task ${taskIdx + 1}: Must have a title`);
      }

      if (task.estimatedMinutes <= 0) {
        errors.push(
          `${prefix}, Task ${
            taskIdx + 1
          }: Estimated minutes must be greater than 0`
        );
      } else if (task.estimatedMinutes > 480) {
        // 8 hours
        warnings.push(
          `${prefix}, Task ${
            taskIdx + 1
          }: Estimated time is very long (> 8 hours). Consider breaking it down.`
        );
      }

      const validTaskTypes = [
        "review",
        "practice",
        "quiz",
        "research",
        "other",
      ];
      if (!validTaskTypes.includes(task.taskType)) {
        errors.push(
          `${prefix}, Task ${taskIdx + 1}: Invalid task type "${task.taskType}"`
        );
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// =====================================================
// Topic Coverage Validation
// =====================================================

/**
 * Ensure plan covers the identified weak areas
 */
export function ensureTopicCoverage(
  plan: AIGeneratedPlan,
  weakAreas: WeakArea[]
): CoverageAnalysis {
  const planTopics = plan.topics.map((t) => t.name.toLowerCase().trim());
  const weakTopics = weakAreas.map((w) => w.topicName.toLowerCase().trim());

  const topicsCovered: string[] = [];
  const topicsMissing: string[] = [];

  weakAreas.forEach((weakArea) => {
    const weakTopicName = weakArea.topicName.toLowerCase().trim();

    // Check for exact match or partial match
    const isCovered = planTopics.some((planTopic) => {
      return (
        planTopic === weakTopicName ||
        planTopic.includes(weakTopicName) ||
        weakTopicName.includes(planTopic)
      );
    });

    if (isCovered) {
      topicsCovered.push(weakArea.topicName);
    } else {
      topicsMissing.push(weakArea.topicName);
    }
  });

  const coveragePercentage =
    weakTopics.length > 0
      ? Math.round((topicsCovered.length / weakTopics.length) * 100)
      : 100;

  // Coverage is adequate if at least 70% of weak areas are covered
  const isAdequate = coveragePercentage >= 70;

  return {
    topicsCovered,
    topicsMissing,
    coveragePercentage,
    isAdequate,
  };
}

/**
 * Check if plan prioritizes the weakest areas
 */
export function validatePrioritization(
  plan: AIGeneratedPlan,
  weakAreas: WeakArea[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Sort weak areas by mastery (lowest first)
  const sortedWeakAreas = [...weakAreas].sort(
    (a, b) => a.masteryLevel - b.masteryLevel
  );

  // Check if the highest priority topics in the plan correspond to the weakest areas
  const highPriorityTopics = plan.topics
    .filter((t) => t.priority >= 4)
    .map((t) => t.name.toLowerCase());

  const weakestTopics = sortedWeakAreas
    .slice(0, 3)
    .map((w) => w.topicName.toLowerCase());

  const weakestCoveredInHighPriority = weakestTopics.filter((weakTopic) =>
    highPriorityTopics.some(
      (highPriorityTopic) =>
        highPriorityTopic.includes(weakTopic) ||
        weakTopic.includes(highPriorityTopic)
    )
  );

  if (weakestCoveredInHighPriority.length === 0 && weakestTopics.length > 0) {
    warnings.push(
      "None of the weakest topics are marked as high priority in the plan. Consider prioritizing them."
    );
  }

  // Check if topics are ordered by priority (high to low)
  const priorities = plan.topics.map((t) => t.priority);
  let isOrdered = true;
  for (let i = 1; i < priorities.length; i++) {
    if (priorities[i] > priorities[i - 1]) {
      isOrdered = false;
      break;
    }
  }

  if (!isOrdered) {
    warnings.push(
      "Topics should be ordered by priority (highest priority first) for better focus."
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// =====================================================
// Time Estimate Validation
// =====================================================

/**
 * Verify time estimates are realistic for the mastery improvement goals
 */
export function validateTimeEstimates(plan: AIGeneratedPlan): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  plan.topics.forEach((topic, idx) => {
    const masteryGap = topic.targetMastery - topic.currentMastery;

    if (masteryGap <= 0) {
      warnings.push(
        `Topic ${idx + 1} (${
          topic.name
        }): No mastery improvement needed, but time allocated.`
      );
      return;
    }

    // Very rough heuristic: 0.1 hours per mastery point minimum
    const minHoursNeeded = masteryGap * 0.05;
    const maxHoursReasonable = masteryGap * 0.5;

    if (topic.estimatedHours < minHoursNeeded) {
      warnings.push(
        `Topic ${idx + 1} (${topic.name}): Time allocated (${
          topic.estimatedHours
        }h) may be too low for ${masteryGap}% improvement. Consider at least ${minHoursNeeded.toFixed(
          1
        )}h.`
      );
    }

    if (topic.estimatedHours > maxHoursReasonable) {
      warnings.push(
        `Topic ${idx + 1} (${topic.name}): Time allocated (${
          topic.estimatedHours
        }h) seems excessive for ${masteryGap}% improvement. Consider around ${(
          maxHoursReasonable / 2
        ).toFixed(1)}h.`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Adjust plan for time constraints if it's not realistic
 */
export function adjustForTimeConstraints(
  plan: AIGeneratedPlan,
  maxHoursAvailable: number
): AIGeneratedPlan {
  // If plan is already within constraints, return as-is
  if (plan.totalHoursEstimated <= maxHoursAvailable) {
    return plan;
  }

  // Calculate scaling factor
  const scaleFactor = maxHoursAvailable / plan.totalHoursEstimated;

  // Scale down all topic hours proportionally
  const adjustedTopics = plan.topics.map((topic) => {
    const scaledHours = Math.max(0.5, topic.estimatedHours * scaleFactor); // Minimum 0.5 hours
    const scaledTarget = Math.max(
      topic.currentMastery + 5, // At least 5% improvement
      topic.currentMastery +
        (topic.targetMastery - topic.currentMastery) * scaleFactor
    );

    // Scale task times proportionally
    const taskScaleFactor = scaledHours / topic.estimatedHours;
    const adjustedTasks = topic.tasks.map((task) => ({
      ...task,
      estimatedMinutes: Math.max(
        5,
        Math.round(task.estimatedMinutes * taskScaleFactor)
      ),
    }));

    return {
      ...topic,
      estimatedHours: Math.round(scaledHours * 2) / 2, // Round to nearest 0.5
      targetMastery: Math.round(scaledTarget),
      tasks: adjustedTasks,
    };
  });

  // Recalculate total
  const newTotal = adjustedTopics.reduce(
    (sum, topic) => sum + topic.estimatedHours,
    0
  );

  // Adjust projected pass chance (lower expectations)
  const adjustedPassChance = Math.max(
    40,
    Math.round(plan.projectedPassChance * scaleFactor)
  );

  return {
    ...plan,
    topics: adjustedTopics,
    totalHoursEstimated: newTotal,
    projectedPassChance: adjustedPassChance,
    recommendations: [
      ...plan.recommendations,
      `Plan has been adjusted to fit ${maxHoursAvailable}h available time (was ${plan.totalHoursEstimated}h).`,
      "Consider increasing study hours per day to achieve better outcomes.",
    ],
  };
}

// =====================================================
// Plan Metadata Calculation
// =====================================================

/**
 * Calculate comprehensive plan metadata
 */
export function calculatePlanMetadata(plan: AIGeneratedPlan): {
  totalTopics: number;
  totalTasks: number;
  totalHours: number;
  averageHoursPerTopic: number;
  highPriorityTopics: number;
  averageCurrentMastery: number;
  averageTargetMastery: number;
  averageMasteryImprovement: number;
  taskTypeDistribution: Record<string, number>;
} {
  const totalTopics = plan.topics.length;
  const totalTasks = plan.topics.reduce(
    (sum, topic) => sum + topic.tasks.length,
    0
  );
  const totalHours = plan.totalHoursEstimated;
  const averageHoursPerTopic = totalTopics > 0 ? totalHours / totalTopics : 0;

  const highPriorityTopics = plan.topics.filter((t) => t.priority >= 4).length;

  const averageCurrentMastery =
    totalTopics > 0
      ? plan.topics.reduce((sum, t) => sum + t.currentMastery, 0) / totalTopics
      : 0;

  const averageTargetMastery =
    totalTopics > 0
      ? plan.topics.reduce((sum, t) => sum + t.targetMastery, 0) / totalTopics
      : 0;

  const averageMasteryImprovement =
    averageTargetMastery - averageCurrentMastery;

  // Count tasks by type
  const taskTypeDistribution: Record<string, number> = {
    review: 0,
    practice: 0,
    quiz: 0,
    research: 0,
    other: 0,
  };

  plan.topics.forEach((topic) => {
    topic.tasks.forEach((task) => {
      taskTypeDistribution[task.taskType] =
        (taskTypeDistribution[task.taskType] || 0) + 1;
    });
  });

  return {
    totalTopics,
    totalTasks,
    totalHours,
    averageHoursPerTopic: Math.round(averageHoursPerTopic * 10) / 10,
    highPriorityTopics,
    averageCurrentMastery: Math.round(averageCurrentMastery),
    averageTargetMastery: Math.round(averageTargetMastery),
    averageMasteryImprovement: Math.round(averageMasteryImprovement),
    taskTypeDistribution,
  };
}

/**
 * Calculate projected outcome if plan is completed
 */
export function calculateProjectedOutcome(
  plan: AIGeneratedPlan,
  currentPassChance: number
): {
  currentPassChance: number;
  projectedPassChance: number;
  improvement: number;
  improvementPercentage: number;
  confidence: "low" | "medium" | "high";
} {
  const projectedPassChance = plan.projectedPassChance;
  const improvement = projectedPassChance - currentPassChance;
  const improvementPercentage =
    currentPassChance > 0
      ? Math.round((improvement / currentPassChance) * 100)
      : 0;

  // Determine confidence based on plan comprehensiveness
  const metadata = calculatePlanMetadata(plan);
  let confidence: "low" | "medium" | "high" = "medium";

  if (metadata.totalHours < 10 || metadata.totalTopics < 3) {
    confidence = "low";
  } else if (
    metadata.totalHours >= 30 &&
    metadata.totalTopics >= 5 &&
    plan.feasibility.isRealistic
  ) {
    confidence = "high";
  }

  return {
    currentPassChance,
    projectedPassChance,
    improvement,
    improvementPercentage,
    confidence,
  };
}
