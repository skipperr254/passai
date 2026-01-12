-- Migration: Add material reference fields to study_plan_tasks
-- Description: Adds file_name and section columns to support material-based study recommendations
-- Date: 2026-01-12

-- Add file_name column for material reference
ALTER TABLE public.study_plan_tasks
ADD COLUMN IF NOT EXISTS file_name TEXT NULL;

-- Add section column for specific material section reference
ALTER TABLE public.study_plan_tasks
ADD COLUMN IF NOT EXISTS section TEXT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.study_plan_tasks.file_name IS 'Name of the uploaded study material file this task references';
COMMENT ON COLUMN public.study_plan_tasks.section IS 'Specific section or topic within the material to focus on';

-- Index for faster lookup by material
CREATE INDEX IF NOT EXISTS idx_study_plan_tasks_file_name 
ON public.study_plan_tasks(file_name) 
WHERE file_name IS NOT NULL;
