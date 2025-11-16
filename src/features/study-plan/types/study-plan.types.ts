import type { Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/types";

// =====================================================
// Database Types (from Supabase)
// =====================================================

export type StudyPlanRow = Tables<"study_plans">;
export type StudyPlanTopicRow = Tables<"study_plan_topics">;
export type StudyPlanTaskRow = Tables<"study_plan_tasks">;

export type StudyPlanInsert = TablesInsert<"study_plans">;
export type StudyPlanTopicInsert = TablesInsert<"study_plan_topics">;
export type StudyPlanTaskInsert = TablesInsert<"study_plan_tasks">;

export type StudyPlanUpdate = TablesUpdate<"study_plans">;
export type StudyPlanTopicUpdate = TablesUpdate<"study_plan_topics">;
export type StudyPlanTaskUpdate = TablesUpdate<"study_plan_tasks">;

// =====================================================
// Enums & Constants
// =====================================================

export const StudyPlanStatus = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;

export type StudyPlanStatus =
  (typeof StudyPlanStatus)[keyof typeof StudyPlanStatus];

export const TopicStatus = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type TopicStatus = (typeof TopicStatus)[keyof typeof TopicStatus];

export const TaskType = {
  READING: "reading",
  PRACTICE: "practice",
  QUIZ: "quiz",
  REVIEW: "review",
} as const;

export type TaskType = (typeof TaskType)[keyof typeof TaskType];

export const Priority = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

// =====================================================
// Application Types
// =====================================================

/**
 * Study Plan with nested topics and tasks
 */
export interface StudyPlan extends StudyPlanRow {
  topics?: StudyPlanTopic[];
  subject?: {
    id: string;
    name: string;
    test_date: string | null;
  };
}

/**
 * Topic/Concept within a study plan
 */
export interface StudyPlanTopic extends StudyPlanTopicRow {
  tasks?: StudyPlanTask[];
}

/**
 * Individual task within a topic
 */
export type StudyPlanTask = StudyPlanTaskRow;

/**
 * Complete study plan with all nested data
 */
export interface StudyPlanWithDetails extends StudyPlanRow {
  topics: (StudyPlanTopicRow & {
    tasks: StudyPlanTaskRow[];
  })[];
  subject: {
    id: string;
    name: string;
    test_date: string | null;
    pass_chance: number | null;
  };
}

// =====================================================
// Request/Response Types
// =====================================================

/**
 * Request to generate a new study plan
 */
export interface StudyPlanGenerationRequest {
  subjectId: string;
  hoursPerDay: number;
  focusAreas: string[]; // Topic names to focus on
  additionalNotes?: string;
  examDate: string; // ISO date string
  currentPassChance?: number;
}

/**
 * AI-generated study plan structure (before saving to DB)
 */
export interface GeneratedStudyPlan {
  title: string;
  description: string;
  totalHours: number;
  projectedPassChance: number;
  topics: GeneratedTopic[];
}

/**
 * AI-generated topic structure
 */
export interface GeneratedTopic {
  title: string;
  description: string;
  totalTimeMinutes: number;
  priority: Priority;
  tasks: GeneratedTask[];
}

/**
 * AI-generated task structure
 */
export interface GeneratedTask {
  title: string;
  description: string;
  estimatedTimeMinutes: number;
  taskType: TaskType;
  resourceLinks?: string[];
}

/**
 * Projected outcomes if plan is completed
 */
export interface StudyPlanProjection {
  currentPassChance: number;
  projectedPassChance: number;
  improvement: number; // Percentage point increase
  estimatedStudyDays: number;
  averageHoursPerDay: number;
  weakAreasAddressed: string[];
  confidence: "low" | "medium" | "high";
}

/**
 * Summary metrics for a study plan
 */
export interface StudyPlanMetrics {
  totalTopics: number;
  completedTopics: number;
  totalTasks: number;
  completedTasks: number;
  totalTimeMinutes: number;
  timeSpentMinutes: number;
  completionPercentage: number;
  averageMasteryLevel: number;
}

/**
 * Request to create a new study plan
 */
export interface CreateStudyPlanInput {
  userId: string;
  subjectId: string;
  title: string;
  description?: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  totalHours: number;
  projectedPassChance?: number;
}

/**
 * Request to create a new topic
 */
export interface CreateTopicInput {
  studyPlanId: string;
  title: string;
  description?: string;
  orderIndex: number;
  totalTimeMinutes: number;
  priority?: Priority;
}

/**
 * Request to create a new task
 */
export interface CreateTaskInput {
  topicId: string;
  title: string;
  description?: string;
  orderIndex: number;
  estimatedTimeMinutes: number;
  taskType?: TaskType;
  resourceLinks?: string[];
}

/**
 * Request to update a study plan
 */
export interface UpdateStudyPlanInput {
  title?: string;
  description?: string;
  status?: StudyPlanStatus;
  projectedPassChance?: number;
}

/**
 * Request to update a topic
 */
export interface UpdateTopicInput {
  title?: string;
  description?: string;
  status?: TopicStatus;
  masteryLevel?: number;
  priority?: Priority;
}

/**
 * Request to update a task
 */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  estimatedTimeMinutes?: number;
  taskType?: TaskType;
  resourceLinks?: string[];
}

// =====================================================
// Filter & Query Types
// =====================================================

/**
 * Filters for querying study plans
 */
export interface StudyPlanFilters {
  userId?: string;
  subjectId?: string;
  status?: StudyPlanStatus | StudyPlanStatus[];
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

/**
 * Options for sorting study plans
 */
export interface StudyPlanSortOptions {
  field: "created_at" | "start_date" | "end_date" | "title";
  direction: "asc" | "desc";
}

// =====================================================
// UI State Types
// =====================================================

/**
 * State for study plan generation modal
 */
export interface StudyPlanGenerationState {
  isOpen: boolean;
  isGenerating: boolean;
  error: string | null;
  step: "input" | "generating" | "success" | "error";
}

/**
 * State for accordion expansion
 */
export interface AccordionState {
  expandedTopicIds: string[];
}
