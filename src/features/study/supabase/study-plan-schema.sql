-- =====================================================
-- STUDY PLAN FEATURE SCHEMA
-- =====================================================
-- This file contains all the table definitions, RLS policies,
-- and relationships for the AI-powered study plan feature.
-- 
-- Tables:
-- 1. studyy_plans - Main study plan records
-- 2. studyy_plan_topics - Topics within each study plan
-- 3. studyy_plan_tasks - Individual tasks within topics
--
-- Dependencies:
-- - auth.users (Supabase Auth)
-- - public.subjects (existing table)
-- =====================================================

-- =====================================================
-- TABLE: studyy_plans
-- =====================================================
-- Main table for storing AI-generated study plans
-- Each plan is associated with a subject and user
-- =====================================================

CREATE TABLE IF NOT EXISTS public.studyy_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  
  -- Plan metadata
  title TEXT NOT NULL,
  description TEXT,
  
  -- Schedule information
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL, -- Test date
  total_hours INTEGER NOT NULL DEFAULT 0, -- Total study hours allocated
  
  -- AI generation metadata
  projected_pass_chance INTEGER, -- Projected pass chance after completing plan (0-100)
  generation_metadata JSONB, -- Store AI prompt info, quiz performance data, etc.
  
  -- Plan status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_studyy_plans_user_id ON public.studyy_plans(user_id);
CREATE INDEX idx_studyy_plans_subject_id ON public.studyy_plans(subject_id);
CREATE INDEX idx_studyy_plans_status ON public.studyy_plans(status);
CREATE INDEX idx_studyy_plans_user_subject ON public.studyy_plans(user_id, subject_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_studyy_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER studyy_plans_updated_at
  BEFORE UPDATE ON public.studyy_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_studyy_plans_updated_at();

-- =====================================================
-- TABLE: studyy_plan_topics
-- =====================================================
-- Topics within each study plan (e.g., "The French Revolution")
-- Topics group related tasks together
-- =====================================================

CREATE TABLE IF NOT EXISTS public.studyy_plan_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studyy_plan_id UUID NOT NULL REFERENCES public.studyy_plans(id) ON DELETE CASCADE,
  
  -- Topic information
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0, -- For sorting topics in order
  
  -- Progress tracking
  total_tasks INTEGER NOT NULL DEFAULT 0,
  completed_tasks INTEGER NOT NULL DEFAULT 0,
  estimated_hours DECIMAL(5, 2) NOT NULL DEFAULT 0, -- Hours allocated for this topic
  
  -- Status based on task completion
  status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
  
  -- Metadata
  difficulty_level TEXT CHECK (difficulty_level IN ('weak', 'medium', 'strong')), -- Based on quiz performance
  focus_areas TEXT[], -- Array of specific focus areas within the topic
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_studyy_plan_topics_plan_id ON public.studyy_plan_topics(studyy_plan_id);
CREATE INDEX idx_studyy_plan_topics_order ON public.studyy_plan_topics(studyy_plan_id, order_index);
CREATE INDEX idx_studyy_plan_topics_status ON public.studyy_plan_topics(status);

-- Add trigger for updated_at
CREATE TRIGGER studyy_plan_topics_updated_at
  BEFORE UPDATE ON public.studyy_plan_topics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_studyy_plans_updated_at();

-- =====================================================
-- TABLE: studyy_plan_tasks
-- =====================================================
-- Individual tasks within each topic
-- Tasks are the actionable items users complete
-- =====================================================

CREATE TABLE IF NOT EXISTS public.studyy_plan_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.studyy_plan_topics(id) ON DELETE CASCADE,
  
  -- Task information
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0, -- For sorting tasks in order
  
  -- Task metadata
  task_type TEXT NOT NULL CHECK (task_type IN ('review', 'practice', 'reading', 'exercise', 'video')),
  estimated_duration INTEGER NOT NULL DEFAULT 30, -- Duration in minutes
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  
  -- Resource links (optional)
  resource_url TEXT,
  resource_title TEXT,
  
  -- Completion tracking
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_studyy_plan_tasks_topic_id ON public.studyy_plan_tasks(topic_id);
CREATE INDEX idx_studyy_plan_tasks_order ON public.studyy_plan_tasks(topic_id, order_index);
CREATE INDEX idx_studyy_plan_tasks_completed ON public.studyy_plan_tasks(is_completed);
CREATE INDEX idx_studyy_plan_tasks_type ON public.studyy_plan_tasks(task_type);
CREATE INDEX idx_studyy_plan_tasks_priority ON public.studyy_plan_tasks(priority);

-- Add trigger for updated_at
CREATE TRIGGER studyy_plan_tasks_updated_at
  BEFORE UPDATE ON public.studyy_plan_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_studyy_plans_updated_at();

-- =====================================================
-- TRIGGER: Auto-update topic progress when task completed
-- =====================================================
-- Automatically recalculates topic progress when tasks change
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_topic_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the topic's completed_tasks count
  UPDATE public.studyy_plan_topics
  SET 
    completed_tasks = (
      SELECT COUNT(*) 
      FROM public.studyy_plan_tasks 
      WHERE topic_id = COALESCE(NEW.topic_id, OLD.topic_id)
        AND is_completed = TRUE
    ),
    status = CASE
      WHEN (SELECT COUNT(*) FROM public.studyy_plan_tasks WHERE topic_id = COALESCE(NEW.topic_id, OLD.topic_id) AND is_completed = TRUE) = 0 
        THEN 'not-started'
      WHEN (SELECT COUNT(*) FROM public.studyy_plan_tasks WHERE topic_id = COALESCE(NEW.topic_id, OLD.topic_id) AND is_completed = TRUE) = 
           (SELECT COUNT(*) FROM public.studyy_plan_tasks WHERE topic_id = COALESCE(NEW.topic_id, OLD.topic_id))
        THEN 'completed'
      ELSE 'in-progress'
    END,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.topic_id, OLD.topic_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_completion_updates_topic
  AFTER INSERT OR UPDATE OR DELETE ON public.studyy_plan_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_topic_progress();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Ensures users can only access their own study plans
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.studyy_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyy_plan_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyy_plan_tasks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: studyy_plans
-- =====================================================

-- Users can view their own study plans
CREATE POLICY "Users can view their own study plans"
  ON public.studyy_plans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own study plans
CREATE POLICY "Users can create their own study plans"
  ON public.studyy_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own study plans
CREATE POLICY "Users can update their own study plans"
  ON public.studyy_plans
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own study plans
CREATE POLICY "Users can delete their own study plans"
  ON public.studyy_plans
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES: studyy_plan_topics
-- =====================================================

-- Users can view topics from their own study plans
CREATE POLICY "Users can view topics from their own study plans"
  ON public.studyy_plan_topics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.studyy_plans
      WHERE studyy_plans.id = studyy_plan_topics.studyy_plan_id
        AND studyy_plans.user_id = auth.uid()
    )
  );

-- Users can create topics in their own study plans
CREATE POLICY "Users can create topics in their own study plans"
  ON public.studyy_plan_topics
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.studyy_plans
      WHERE studyy_plans.id = studyy_plan_topics.studyy_plan_id
        AND studyy_plans.user_id = auth.uid()
    )
  );

-- Users can update topics in their own study plans
CREATE POLICY "Users can update topics in their own study plans"
  ON public.studyy_plan_topics
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.studyy_plans
      WHERE studyy_plans.id = studyy_plan_topics.studyy_plan_id
        AND studyy_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.studyy_plans
      WHERE studyy_plans.id = studyy_plan_topics.studyy_plan_id
        AND studyy_plans.user_id = auth.uid()
    )
  );

-- Users can delete topics from their own study plans
CREATE POLICY "Users can delete topics from their own study plans"
  ON public.studyy_plan_topics
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.studyy_plans
      WHERE studyy_plans.id = studyy_plan_topics.studyy_plan_id
        AND studyy_plans.user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES: studyy_plan_tasks
-- =====================================================

-- Users can view tasks from their own study plans
CREATE POLICY "Users can view tasks from their own study plans"
  ON public.studyy_plan_tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.studyy_plan_topics
      JOIN public.studyy_plans ON studyy_plans.id = studyy_plan_topics.studyy_plan_id
      WHERE studyy_plan_topics.id = studyy_plan_tasks.topic_id
        AND studyy_plans.user_id = auth.uid()
    )
  );

-- Users can create tasks in their own study plans
CREATE POLICY "Users can create tasks in their own study plans"
  ON public.studyy_plan_tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.studyy_plan_topics
      JOIN public.studyy_plans ON studyy_plans.id = studyy_plan_topics.studyy_plan_id
      WHERE studyy_plan_topics.id = studyy_plan_tasks.topic_id
        AND studyy_plans.user_id = auth.uid()
    )
  );

-- Users can update tasks in their own study plans
CREATE POLICY "Users can update tasks in their own study plans"
  ON public.studyy_plan_tasks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.studyy_plan_topics
      JOIN public.studyy_plans ON studyy_plans.id = studyy_plan_topics.studyy_plan_id
      WHERE studyy_plan_topics.id = studyy_plan_tasks.topic_id
        AND studyy_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.studyy_plan_topics
      JOIN public.studyy_plans ON studyy_plans.id = studyy_plan_topics.studyy_plan_id
      WHERE studyy_plan_topics.id = studyy_plan_tasks.topic_id
        AND studyy_plans.user_id = auth.uid()
    )
  );

-- Users can delete tasks from their own study plans
CREATE POLICY "Users can delete tasks from their own study plans"
  ON public.studyy_plan_tasks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.studyy_plan_topics
      JOIN public.studyy_plans ON studyy_plans.id = studyy_plan_topics.studyy_plan_id
      WHERE studyy_plan_topics.id = studyy_plan_tasks.topic_id
        AND studyy_plans.user_id = auth.uid()
    )
  );

-- =====================================================
-- HELPFUL QUERIES FOR TESTING
-- =====================================================
-- Uncomment to test after running migration

-- Get all study plans with topic and task counts
/*
SELECT 
  sp.id,
  sp.title,
  sp.status,
  COUNT(DISTINCT spt.id) as topic_count,
  COUNT(spk.id) as total_tasks,
  COUNT(CASE WHEN spk.is_completed THEN 1 END) as completed_tasks,
  sp.start_date,
  sp.end_date
FROM public.studyy_plans sp
LEFT JOIN public.studyy_plan_topics spt ON spt.studyy_plan_id = sp.id
LEFT JOIN public.studyy_plan_tasks spk ON spk.topic_id = spt.id
WHERE sp.user_id = auth.uid()
GROUP BY sp.id;
*/

-- Get detailed breakdown of a specific study plan
/*
SELECT 
  sp.title as plan_title,
  spt.title as topic_title,
  spt.status as topic_status,
  spt.completed_tasks || '/' || spt.total_tasks as topic_progress,
  spk.title as task_title,
  spk.task_type,
  spk.is_completed
FROM public.studyy_plans sp
JOIN public.studyy_plan_topics spt ON spt.studyy_plan_id = sp.id
JOIN public.studyy_plan_tasks spk ON spk.topic_id = spt.id
WHERE sp.id = '<your-plan-id>'
ORDER BY spt.order_index, spk.order_index;
*/
