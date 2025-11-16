# Study Plan Feature

This feature provides a personalized study plan interface for students to track their progress and follow a structured learning schedule.

## Structure

```
study/
├── components/          # Reusable UI components
│   ├── SubjectSelector.tsx       # Dropdown to select subject
│   ├── StatsCards.tsx            # Display pass chance and days until test
│   ├── ProgressBar.tsx           # Overall progress tracker
│   ├── StudyTopicCard.tsx        # Expandable topic card with tasks
│   ├── StudySchedule.tsx         # Main schedule layout
│   └── index.ts                  # Component exports
├── hooks/               # Custom React hooks
│   ├── useStudyPlan.ts           # Manages study plan state and interactions
│   └── index.ts                  # Hook exports
├── pages/               # Page components
│   └── StudyPlanPage.tsx         # Main study plan page
├── services/            # API service layer
│   └── studyPlanService.ts       # Supabase API calls (ready for implementation)
├── types/               # TypeScript types
│   └── index.ts                  # Type definitions
└── utils/               # Utility functions
    └── mockData.ts               # Mock data for development

```

## Features

### ✅ Implemented

- Subject selection with dropdown
- Pass chance and test date statistics
- Overall progress tracking with visual progress bar
- Expandable topic cards with task checklists
- Task completion tracking with automatic progress updates
- Responsive design for mobile and desktop
- Clean, maintainable component structure
- Mock data for development

### 🚧 Ready for Backend Integration

- `useStudyPlans` hook in `hooks/useStudyPlan.ts`
- Service functions in `services/studyPlanService.ts`
- Type definitions aligned with Supabase schema

## Usage

### Basic Implementation

```tsx
import { StudyPlanPage } from "@/features/study/pages/StudyPlanPage";

// In your router
<Route path="/study-plan" element={<StudyPlanPage />} />;
```

### Using Individual Components

```tsx
import {
  SubjectSelector,
  StatsCards,
  ProgressBar,
  StudySchedule,
} from "@/features/study/components";

// Use components individually in custom layouts
```

### Custom Hook Usage

```tsx
import { useStudyPlan } from "@/features/study/hooks";
import { mockStudyPlan } from "@/features/study/utils/mockData";

function MyComponent() {
  const {
    studyPlan,
    expandedTopics,
    totalTasks,
    completedTasks,
    toggleTopic,
    toggleTask,
  } = useStudyPlan(mockStudyPlan);

  // Use the hook data and functions
}
```

## Backend Integration Guide

### 1. Update Service Functions

Replace mock implementations in `services/studyPlanService.ts` with actual Supabase calls:

```typescript
export const fetchStudyPlans = async (subjectId: string) => {
  const { data, error } = await supabase
    .from("study_plans")
    .select(
      `
      *,
      study_plan_topics (
        *,
        study_plan_tasks (*)
      )
    `
    )
    .eq("subject_id", subjectId)
    .eq("status", "active");

  if (error) throw error;
  return data;
};
```

### 2. Update Custom Hook

Replace the `useStudyPlans` placeholder in `hooks/useStudyPlan.ts`:

```typescript
export const useStudyPlans = (subjectId: string | undefined) => {
  return useQuery({
    queryKey: ["studyPlans", subjectId],
    queryFn: () => fetchStudyPlans(subjectId!),
    enabled: !!subjectId,
  });
};
```

### 3. Update Page Component

Replace mock data in `pages/StudyPlanPage.tsx`:

```typescript
// Replace this:
const { studyPlan, ... } = useStudyPlan(mockStudyPlan);

// With this:
const { data: studyPlans } = useStudyPlans(selectedSubject?.id);
const { studyPlan, ... } = useStudyPlan(studyPlans?.[0]);
```

### 4. Add Mutation for Task Updates

```typescript
const updateTaskMutation = useMutation({
  mutationFn: ({ taskId, isCompleted }) =>
    updateTaskCompletion(taskId, isCompleted),
  onSuccess: () => {
    queryClient.invalidateQueries(["studyPlans"]);
  },
});
```

## Database Schema Requirements

The feature expects the following Supabase tables (already defined in your schema):

- `study_plans` - Main study plan data
- `study_plan_topics` - Topics within a plan
- `study_plan_tasks` - Individual tasks for each topic

Refer to `src/lib/supabase/types.ts` for complete type definitions.

## Design Patterns

### Single Responsibility Principle

Each component has one clear purpose:

- `SubjectSelector` - Only handles subject selection
- `StatsCards` - Only displays statistics
- `ProgressBar` - Only shows progress visualization
- `StudyTopicCard` - Only manages topic display and expansion
- `StudySchedule` - Only arranges topics in a layout

### State Management

- Local state managed by `useStudyPlan` hook
- Ready for React Query integration
- State changes trigger automatic UI updates

### Styling

- Uses Tailwind CSS utility classes
- Responsive design with `lg:` breakpoints
- Consistent color scheme matching the app
- Smooth transitions and hover states

## Future Enhancements

- [ ] Drag-and-drop to reorder topics
- [ ] Time tracking for each task
- [ ] AI-generated study recommendations
- [ ] Calendar integration
- [ ] Study reminders/notifications
- [ ] Spaced repetition algorithm
- [ ] Performance analytics
