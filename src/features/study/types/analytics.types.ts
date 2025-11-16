import type { Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/types";

// =====================================================
// Database Types (from Supabase)
// =====================================================

export type TopicMasteryRow = Tables<"topic_mastery">;
export type MaterialCoverageRow = Tables<"material_coverage">;
export type StudySessionRow = Tables<"study_sessions">;

export type TopicMasteryInsert = TablesInsert<"topic_mastery">;
export type MaterialCoverageInsert = TablesInsert<"material_coverage">;
export type StudySessionInsert = TablesInsert<"study_sessions">;

export type TopicMasteryUpdate = TablesUpdate<"topic_mastery">;
export type MaterialCoverageUpdate = TablesUpdate<"material_coverage">;
export type StudySessionUpdate = TablesUpdate<"study_sessions">;

// =====================================================
// Constants
// =====================================================

export const Mood = {
  CONFIDENT: "confident",
  OKAY: "okay",
  STRUGGLING: "struggling",
  CONFUSED: "confused",
} as const;

export type Mood = (typeof Mood)[keyof typeof Mood];

export const MasteryThreshold = {
  WEAK: 30, // Below 30% is weak
  MODERATE: 60, // 30-60% is moderate
  STRONG: 80, // 60-80% is strong
  MASTERED: 80, // Above 80% is mastered
} as const;

// =====================================================
// Application Types
// =====================================================

/**
 * Topic mastery with BKT parameters
 */
export interface TopicMastery extends TopicMasteryRow {
  subject?: {
    id: string;
    name: string;
  };
}

/**
 * Material coverage tracking
 */
export interface MaterialCoverage extends MaterialCoverageRow {
  material?: {
    id: string;
    file_name: string;
    file_type: string;
  };
}

/**
 * Study session record
 */
export interface StudySession extends StudySessionRow {
  subject?: {
    id: string;
    name: string;
  };
}

// =====================================================
// Analytics Types
// =====================================================

/**
 * Identified weak area needing attention
 */
export interface WeakArea {
  topicName: string;
  masteryLevel: number;
  correctCount: number;
  incorrectCount: number;
  totalAttempts: number;
  lastPracticedAt: string | null;
  priority: "high" | "medium" | "low";
  recommendedStudyTime: number; // minutes
}

/**
 * Pass probability calculation result
 */
export interface PassProbability {
  probability: number; // 0-100
  confidence: "low" | "medium" | "high";
  factors: {
    masteryLevel: number;
    materialCoverage: number;
    timeUntilExam: number; // days
    studyConsistency: number; // 0-100
    recentPerformance: number; // 0-100
  };
  trend: "improving" | "stable" | "declining";
  calculatedAt: string;
}

/**
 * BKT calculation parameters
 */
export interface BKTParameters {
  pInit: number; // P(L0) - Initial knowledge probability
  pTransit: number; // P(T) - Learning rate
  pGuess: number; // P(G) - Guessing rate
  pSlip: number; // P(S) - Slip rate
  pLearned: number; // Current learned probability
  pKnown: number; // Current known probability
}

/**
 * Progress data point for charts
 */
export interface ProgressDataPoint {
  date: string; // ISO date
  passChance: number;
  masteryLevel: number;
  quizScore?: number;
  studyTime?: number;
}

/**
 * Performance trend over time
 */
export interface PerformanceTrend {
  period: "week" | "month" | "all";
  dataPoints: ProgressDataPoint[];
  averageScore: number;
  improvement: number; // Percentage change
  consistency: number; // 0-100, how consistent study has been
}

/**
 * Complete analytics summary for a subject
 */
export interface AnalyticsSummary {
  subjectId: string;
  subjectName: string;
  currentPassChance: number;
  projectedPassChance: number | null;
  materialCoverage: {
    overall: number;
    byMaterial: Array<{
      materialId: string;
      fileName: string;
      coverage: number;
      timeSpent: number;
    }>;
  };
  masteryOverview: {
    average: number;
    byTopic: TopicMastery[];
    weakAreas: WeakArea[];
  };
  studyStats: {
    totalStudyTime: number; // minutes
    sessionsCount: number;
    currentStreak: number; // days
    longestStreak: number; // days
    averageSessionDuration: number; // minutes
  };
  performanceTrend: PerformanceTrend;
  recommendations: string[];
  lastCalculated: string;
}

/**
 * Mastery breakdown by difficulty
 */
export interface MasteryByDifficulty {
  easy: number;
  medium: number;
  hard: number;
}

/**
 * Topic performance details
 */
export interface TopicPerformance {
  topicName: string;
  masteryLevel: number;
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number; // Percentage
  averageTimePerQuestion: number; // seconds
  lastPracticed: string | null;
  difficulty: MasteryByDifficulty;
}

/**
 * Study streak information
 */
export interface StudyStreak {
  current: number; // days
  longest: number; // days
  lastStudyDate: string | null;
  isActiveToday: boolean;
}

/**
 * Time allocation suggestion
 */
export interface TimeAllocation {
  topicName: string;
  recommendedMinutes: number;
  priority: "high" | "medium" | "low";
  reason: string;
}

// =====================================================
// Request/Response Types
// =====================================================

/**
 * Request to update topic mastery
 */
export interface UpdateMasteryInput {
  userId: string;
  subjectId: string;
  topicName: string;
  isCorrect: boolean;
  difficulty: "easy" | "medium" | "hard";
}

/**
 * Request to update material coverage
 */
export interface UpdateCoverageInput {
  userId: string;
  materialId: string;
  subjectId: string;
  coveragePercentage: number;
  timeSpentMinutes: number;
  notes?: string;
}

/**
 * Request to log a study session
 */
export interface LogStudySessionInput {
  userId: string;
  subjectId: string;
  sessionDate: string; // ISO date
  durationMinutes: number;
  topicsCovered?: string[];
  materialsUsed?: string[];
  mood?: Mood;
  notes?: string;
}

/**
 * Query parameters for analytics
 */
export interface AnalyticsQueryParams {
  userId: string;
  subjectId: string;
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  includeProjections?: boolean;
}

/**
 * Mastery calculation result
 */
export interface MasteryCalculationResult {
  topicName: string;
  previousMastery: number;
  newMastery: number;
  change: number;
  bktParams: BKTParameters;
}

// =====================================================
// Chart Data Types
// =====================================================

/**
 * Data for progress line chart
 */
export interface ProgressChartData {
  labels: string[]; // Dates
  datasets: Array<{
    label: string;
    data: number[];
    color: string;
  }>;
}

/**
 * Data for mastery radar chart
 */
export interface MasteryRadarData {
  labels: string[]; // Topic names
  data: number[]; // Mastery levels
  maxValue: 100;
}

/**
 * Data for study time bar chart
 */
export interface StudyTimeChartData {
  labels: string[]; // Dates or days of week
  data: number[]; // Minutes studied
  totalTime: number;
}

/**
 * Data for topic performance bar chart
 */
export interface TopicPerformanceChartData {
  topics: Array<{
    name: string;
    mastery: number;
    color: string; // Based on mastery level
  }>;
  sortedBy: "mastery" | "name";
}
