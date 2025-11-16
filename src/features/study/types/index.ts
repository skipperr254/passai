import type { Tables } from "@/lib/supabase/types";

// Supabase table types
export type Subject = Tables<"subjects">;

// Study Plan Types
export type StudyPlanTopic = {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  priority: "high" | "medium" | "low";
  status: "not-started" | "in-progress" | "completed";
  total_tasks: number;
  completed_tasks: number;
  total_time_minutes: number;
  mastery_level: number | null;
  tasks: StudyPlanTask[];
};

export type StudyPlanTask = {
  id: string;
  topic_id: string;
  title: string;
  description: string | null;
  task_type: "review" | "practice" | "reading" | "exercise" | "video";
  estimated_time_minutes: number;
  order_index: number;
  is_completed: boolean;
  completed_at: string | null;
  resource_links: string[] | null;
};

export type StudyPlan = {
  id: string;
  subject_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  total_hours: number;
  projected_pass_chance: number | null;
  status: "active" | "completed" | "paused";
  topics: StudyPlanTopic[];
};

// UI State Types
export type TaskCompletionUpdate = {
  topicId: string;
  taskId: string;
  isCompleted: boolean;
};

export type TopicExpansionState = {
  [topicId: string]: boolean;
};

// Component Props
export type StudyPlanPageProps = {
  preSelectedSubjectId?: string;
};
