import { z } from "zod";
import {
  StudyPlanStatus,
  TopicStatus,
  TaskType,
  Priority,
} from "../types/study-plan.types";
import { Mood } from "../types/analytics.types";

// =====================================================
// Study Plan Schemas
// =====================================================

export const studyPlanSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable(),
  generated_date: z.string().datetime(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  total_hours: z.number().int().positive(),
  status: z.enum([
    StudyPlanStatus.ACTIVE,
    StudyPlanStatus.COMPLETED,
    StudyPlanStatus.ARCHIVED,
  ]),
  projected_pass_chance: z.number().int().min(0).max(100).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createStudyPlanSchema = z.object({
  userId: z.string().uuid(),
  subjectId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  totalHours: z.number().int().positive(),
  projectedPassChance: z.number().int().min(0).max(100).optional(),
});

export const updateStudyPlanSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  status: z
    .enum([
      StudyPlanStatus.ACTIVE,
      StudyPlanStatus.COMPLETED,
      StudyPlanStatus.ARCHIVED,
    ])
    .optional(),
  projectedPassChance: z.number().int().min(0).max(100).nullable().optional(),
});

// =====================================================
// Topic Schemas
// =====================================================

export const studyPlanTopicSchema = z.object({
  id: z.string().uuid(),
  study_plan_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable(),
  order_index: z.number().int().min(0),
  total_time_minutes: z.number().int().positive(),
  total_tasks: z.number().int().min(0),
  status: z.enum([
    TopicStatus.NOT_STARTED,
    TopicStatus.IN_PROGRESS,
    TopicStatus.COMPLETED,
  ]),
  mastery_level: z.number().int().min(0).max(100).nullable(),
  priority: z.enum([Priority.HIGH, Priority.MEDIUM, Priority.LOW]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createTopicSchema = z.object({
  studyPlanId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  orderIndex: z.number().int().min(0),
  totalTimeMinutes: z.number().int().positive(),
  priority: z.enum([Priority.HIGH, Priority.MEDIUM, Priority.LOW]).optional(),
});

export const updateTopicSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  status: z
    .enum([
      TopicStatus.NOT_STARTED,
      TopicStatus.IN_PROGRESS,
      TopicStatus.COMPLETED,
    ])
    .optional(),
  masteryLevel: z.number().int().min(0).max(100).nullable().optional(),
  priority: z.enum([Priority.HIGH, Priority.MEDIUM, Priority.LOW]).optional(),
});

// =====================================================
// Task Schemas
// =====================================================

export const studyPlanTaskSchema = z.object({
  id: z.string().uuid(),
  topic_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable(),
  order_index: z.number().int().min(0),
  estimated_time_minutes: z.number().int().positive(),
  is_completed: z.boolean(),
  completed_at: z.string().datetime().nullable(),
  task_type: z.enum([
    TaskType.READING,
    TaskType.PRACTICE,
    TaskType.QUIZ,
    TaskType.REVIEW,
  ]),
  resource_links: z.array(z.string().url()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createTaskSchema = z.object({
  topicId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  orderIndex: z.number().int().min(0),
  estimatedTimeMinutes: z.number().int().positive(),
  taskType: z
    .enum([TaskType.READING, TaskType.PRACTICE, TaskType.QUIZ, TaskType.REVIEW])
    .optional(),
  resourceLinks: z.array(z.string().url()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  isCompleted: z.boolean().optional(),
  estimatedTimeMinutes: z.number().int().positive().optional(),
  taskType: z
    .enum([TaskType.READING, TaskType.PRACTICE, TaskType.QUIZ, TaskType.REVIEW])
    .optional(),
  resourceLinks: z.array(z.string().url()).nullable().optional(),
});

// =====================================================
// Study Plan Generation Schemas
// =====================================================

export const studyPlanGenerationRequestSchema = z
  .object({
    subjectId: z.string().uuid(),
    hoursPerDay: z.number().positive().max(12),
    focusAreas: z.array(z.string().min(1)).min(1),
    additionalNotes: z.string().max(1000).optional(),
    examDate: z.string().date(),
    currentPassChance: z.number().int().min(0).max(100).optional(),
  })
  .refine(
    (data) => {
      const examDate = new Date(data.examDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return examDate >= today;
    },
    {
      message: "Exam date must be in the future",
      path: ["examDate"],
    }
  );

export const generatedTopicSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  totalTimeMinutes: z.number().int().positive(),
  priority: z.enum([Priority.HIGH, Priority.MEDIUM, Priority.LOW]),
  tasks: z.array(
    z.object({
      title: z.string().min(1).max(200),
      description: z.string().min(1).max(1000),
      estimatedTimeMinutes: z.number().int().positive(),
      taskType: z.enum([
        TaskType.READING,
        TaskType.PRACTICE,
        TaskType.QUIZ,
        TaskType.REVIEW,
      ]),
      resourceLinks: z.array(z.string().url()).optional(),
    })
  ),
});

export const generatedStudyPlanSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  totalHours: z.number().int().positive(),
  projectedPassChance: z.number().int().min(0).max(100),
  topics: z.array(generatedTopicSchema),
});

// =====================================================
// Analytics Schemas
// =====================================================

export const topicMasterySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  topic_name: z.string().min(1).max(200),
  mastery_level: z.number().int().min(0).max(100),
  correct_count: z.number().int().min(0),
  incorrect_count: z.number().int().min(0),
  total_attempts: z.number().int().min(0),
  last_practiced_at: z.string().datetime().nullable(),
  p_learned: z.number().min(0).max(1),
  p_known: z.number().min(0).max(1),
  p_init: z.number().min(0).max(1),
  p_transit: z.number().min(0).max(1),
  p_guess: z.number().min(0).max(1),
  p_slip: z.number().min(0).max(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const updateMasterySchema = z.object({
  userId: z.string().uuid(),
  subjectId: z.string().uuid(),
  topicName: z.string().min(1).max(200),
  isCorrect: z.boolean(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const materialCoverageSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  material_id: z.string().uuid(),
  coverage_percentage: z.number().int().min(0).max(100),
  time_spent_minutes: z.number().int().min(0),
  last_accessed_at: z.string().datetime().nullable(),
  notes: z.string().max(2000).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const updateCoverageSchema = z.object({
  userId: z.string().uuid(),
  materialId: z.string().uuid(),
  subjectId: z.string().uuid(),
  coveragePercentage: z.number().int().min(0).max(100),
  timeSpentMinutes: z.number().int().min(0),
  notes: z.string().max(2000).optional(),
});

export const studySessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  session_date: z.string().date(),
  duration_minutes: z.number().int().positive(),
  topics_covered: z.array(z.string()).nullable(),
  materials_used: z.array(z.string().uuid()).nullable(),
  mood: z
    .enum([Mood.CONFIDENT, Mood.OKAY, Mood.STRUGGLING, Mood.CONFUSED])
    .nullable(),
  notes: z.string().max(2000).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const logStudySessionSchema = z
  .object({
    userId: z.string().uuid(),
    subjectId: z.string().uuid(),
    sessionDate: z.string().date(),
    durationMinutes: z.number().int().positive(),
    topicsCovered: z.array(z.string().min(1)).optional(),
    materialsUsed: z.array(z.string().uuid()).optional(),
    mood: z
      .enum([Mood.CONFIDENT, Mood.OKAY, Mood.STRUGGLING, Mood.CONFUSED])
      .optional(),
    notes: z.string().max(2000).optional(),
  })
  .refine(
    (data) => {
      const sessionDate = new Date(data.sessionDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return sessionDate <= today;
    },
    {
      message: "Session date cannot be in the future",
      path: ["sessionDate"],
    }
  );

export const analyticsQuerySchema = z.object({
  userId: z.string().uuid(),
  subjectId: z.string().uuid(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  includeProjections: z.boolean().optional(),
});

// =====================================================
// Filter Schemas
// =====================================================

export const studyPlanFiltersSchema = z.object({
  userId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  status: z
    .union([
      z.enum([
        StudyPlanStatus.ACTIVE,
        StudyPlanStatus.COMPLETED,
        StudyPlanStatus.ARCHIVED,
      ]),
      z.array(
        z.enum([
          StudyPlanStatus.ACTIVE,
          StudyPlanStatus.COMPLETED,
          StudyPlanStatus.ARCHIVED,
        ])
      ),
    ])
    .optional(),
  startDateFrom: z.string().date().optional(),
  startDateTo: z.string().date().optional(),
  endDateFrom: z.string().date().optional(),
  endDateTo: z.string().date().optional(),
});

// =====================================================
// Type Exports (inferred from schemas)
// =====================================================

export type StudyPlanSchemaType = z.infer<typeof studyPlanSchema>;
export type CreateStudyPlanSchemaType = z.infer<typeof createStudyPlanSchema>;
export type UpdateStudyPlanSchemaType = z.infer<typeof updateStudyPlanSchema>;
export type StudyPlanTopicSchemaType = z.infer<typeof studyPlanTopicSchema>;
export type CreateTopicSchemaType = z.infer<typeof createTopicSchema>;
export type UpdateTopicSchemaType = z.infer<typeof updateTopicSchema>;
export type StudyPlanTaskSchemaType = z.infer<typeof studyPlanTaskSchema>;
export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchemaType = z.infer<typeof updateTaskSchema>;
export type StudyPlanGenerationRequestSchemaType = z.infer<
  typeof studyPlanGenerationRequestSchema
>;
export type GeneratedStudyPlanSchemaType = z.infer<
  typeof generatedStudyPlanSchema
>;
export type TopicMasterySchemaType = z.infer<typeof topicMasterySchema>;
export type UpdateMasterySchemaType = z.infer<typeof updateMasterySchema>;
export type MaterialCoverageSchemaType = z.infer<typeof materialCoverageSchema>;
export type UpdateCoverageSchemaType = z.infer<typeof updateCoverageSchema>;
export type StudySessionSchemaType = z.infer<typeof studySessionSchema>;
export type LogStudySessionSchemaType = z.infer<typeof logStudySessionSchema>;
export type AnalyticsQuerySchemaType = z.infer<typeof analyticsQuerySchema>;
export type StudyPlanFiltersSchemaType = z.infer<typeof studyPlanFiltersSchema>;
