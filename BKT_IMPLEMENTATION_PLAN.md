# BKT Integration Implementation Plan

**Date**: November 16, 2025  
**Phase**: Critical Priority #2  
**Status**: Planning  
**Prerequisites**: Garden System ✅ Complete

---

## 🎯 Executive Summary

**Goal**: Integrate Bayesian Knowledge Tracking (BKT) with quiz system to calculate accurate pass probabilities and enable adaptive learning.

**Current Status**: BKT algorithm exists but is **not connected** to quiz flow. Code is split between `study-plan/` and `study/` folders with duplicate tables.

**Key Challenge**: Schema confusion - two sets of similar tables (`study_plans` vs `studyy_plans`, etc.)

---

## 📊 Garden System - Completion Audit

### ✅ **PHASE 1-6 COMPLETE**

| Phase       | Feature                    | Status      | Files                                                       |
| ----------- | -------------------------- | ----------- | ----------------------------------------------------------- |
| **Phase 1** | Database Schema            | ✅ Complete | `plant_states.sql`                                          |
| **Phase 2** | Service Layer              | ✅ Complete | `plantStateService.ts`                                      |
| **Phase 3** | Quiz Results Integration   | ✅ Complete | `QuizResultsPage.tsx`, `useGardenUpdate.ts`                 |
| **Phase 4** | Dashboard Integration      | ✅ Complete | `GardenHealthCard.tsx`, `DashboardPage.tsx`                 |
| **Phase 5** | Subject Detail Integration | ✅ Complete | `SubjectGardenCard.tsx`, `SubjectDetailPage.tsx`            |
| **Phase 6** | Emoticon Consistency       | ✅ Complete | 9 files updated, `GARDEN_EMOTICON_SYSTEM.md`                |
| **BONUS**   | Study Sessions Logging     | ✅ Complete | `useLogStudySession.ts`, `STUDY_SESSIONS_IMPLEMENTATION.md` |

### ✅ **Garden System Works**:

- Points awarded after quiz (10 per correct answer)
- Levels increase every 100 points
- Health calculated from 7-day study consistency
- Garden emoticons (🌳🌻🌿🌱💧) used throughout app
- Study sessions logged automatically
- Subjects' `last_studied_at` updated

### 🎉 **Garden System is MVP-Ready!**

Minor future enhancements (Phase 7-9) can be done later:

- Comprehensive testing checklist
- Bug fixes and polish
- Documentation updates

**Decision**: Garden System is **COMPLETE** for now. Moving to BKT Integration! 🚀

---

## 🔍 Current State Analysis - BKT & Study Plan

### **Problem: Code Duplication & Schema Confusion**

#### **Two Separate Implementations Found**:

1. **`src/features/study-plan/`** (Original, More Complete)

   - BKT algorithm implemented
   - Mastery tracking service
   - Study plan generation
   - Tables: `study_plans`, `study_plan_topics`, `study_plan_tasks`, `topic_mastery`
   - **Migration**: `migration_0003_study_plans.sql` ✅ Applied

2. **`src/features/study/`** (Newer, Placeholder)
   - Placeholder SQL schema file
   - Tables: `studyy_plans`, `studyy_plan_topics`, `studyy_plan_tasks`
   - **Status**: Schema file exists but **NOT migrated**
   - **Purpose**: Was supposed to replace study-plan but never finished

#### **Database Tables (Confirmed via migration_0003)**:

```
✅ questions (with concept column added)
✅ study_plans
✅ study_plan_topics
✅ study_plan_tasks
✅ topic_mastery
✅ material_coverage
✅ study_sessions
```

#### **Zombie Tables (NOT in database, only in study/ folder)**:

```
❌ studyy_plans (not migrated)
❌ studyy_plan_topics (not migrated)
❌ studyy_plan_tasks (not migrated)
```

### **File Structure Analysis**:

**`study-plan/` folder** (Keep - has working code):

```
src/features/study-plan/
├── components/          (UI components - not used yet)
├── hooks/
│   └── useSubjectAnalytics.ts ✅ (Keep)
├── services/
│   ├── mastery.service.ts ✅ (CRITICAL - Keep)
│   ├── study-plan.service.ts ✅ (Keep)
│   └── study-sessions.service.ts ✅ (Keep)
├── types/
│   └── analytics.types.ts ✅ (Keep)
└── utils/
    └── bkt.ts ✅ (CRITICAL - BKT Algorithm)
```

**`study/` folder** (Mostly empty/placeholder):

```
src/features/study/
├── components/         (Empty placeholder)
├── hooks/             (Empty placeholder)
├── lib/               (Empty placeholder)
├── pages/             (Empty placeholder)
├── services/          (Empty placeholder)
├── supabase/
│   └── study-plan-schema.sql ❌ (NOT migrated, causes confusion)
├── types/             (Empty placeholder)
└── utils/             (Empty placeholder)
```

### **Conclusion**:

- **Keep**: `study-plan/` folder - has all the working BKT code
- **Remove/Clean**: `study/` folder - mostly empty, schema file not migrated
- **Use Tables**: From `migration_0003_study_plans.sql` (already in database)

---

## 🎯 BKT Integration - What's Missing

### **Current State**:

| Component                    | Status               | Notes                                    |
| ---------------------------- | -------------------- | ---------------------------------------- |
| BKT Algorithm                | ✅ Complete          | `study-plan/utils/bkt.ts`                |
| topic_mastery table          | ✅ Exists            | Via migration_0003                       |
| Mastery Service              | ✅ Complete          | `study-plan/services/mastery.service.ts` |
| questions.concept            | ✅ Exists            | Added in migration_0003                  |
| Quiz → Mastery Update        | ❌ **NOT CONNECTED** | **Critical gap**                         |
| Pass Probability Calculation | ❌ Not integrated    | Function exists but not called           |
| Pass Probability Display     | ❌ Not shown         | No UI integration                        |

### **The Core Problem**:

When a student completes a quiz:

```typescript
// Current Flow ✅
Quiz Completion
  └─> completeAttempt() ✅
      └─> logStudySession() ✅
          └─> updatePlantState() ✅

// Missing Flow ❌
Quiz Completion
  └─> completeAttempt()
      └─> updateTopicMastery() ❌ NOT HAPPENING
          └─> calculatePassProbability() ❌ NOT HAPPENING
              └─> updateSubjectStats() ❌ NOT HAPPENING
```

### **What Needs to Happen**:

1. **Extract concepts from quiz questions**

   - Questions already have `concept` field
   - Need to ensure concepts are populated during quiz generation

2. **Update topic mastery after quiz**

   - Call `processQuizAttempt()` from `mastery.service.ts`
   - Update BKT parameters for each concept

3. **Calculate pass probability**

   - Use `getPredictedPassProbability()` from `mastery.service.ts`
   - Store in `subjects.pass_chance`

4. **Display pass probability**
   - Show on SubjectDetailPage
   - Show on Dashboard
   - Show on QuizResultsPage

---

## 🚀 Implementation Plan

### **Phase 1: Code Cleanup (30 min)**

**Goal**: Remove confusion from duplicate folders/schemas

**Tasks**:

1. ✅ Audit complete - identified zombie tables
2. Delete `src/features/study/supabase/study-plan-schema.sql` (not migrated)
3. Add comment in `study/` folder explaining it's for future features
4. Confirm no code references `studyy_plans` tables

**Files to Modify**:

- Delete: `src/features/study/supabase/study-plan-schema.sql`
- Create: `src/features/study/README.md` (explain folder purpose)

---

### **Phase 2: Concept Population in Quiz Generation (1-2 hours)**

**Goal**: Ensure all quiz questions have concepts tagged

**Current State**:

- `questions` table has `concept` field ✅
- Quiz generation doesn't populate it ❌

**Implementation**:

**File**: `src/features/quizzes/services/quizGenerationService.ts`

**Update AI Prompt**:

```typescript
const systemPrompt = `
Generate ${questionCount} quiz questions.

For EACH question, you MUST identify:
1. The main concept/skill being tested
2. Use specific terminology (e.g., "Photosynthesis" not just "Biology")

Return JSON:
{
  "questions": [
    {
      "question_text": "...",
      "concept": "Pythagorean Theorem", // REQUIRED
      "topic": "Geometry",
      "difficulty": "medium",
      // ... rest of question
    }
  ]
}
`;
```

**Validation**:

```typescript
// Add validation when saving questions
if (!question.concept || question.concept.length === 0) {
  throw new Error("Concept is required for BKT tracking");
}
```

---

### **Phase 3: Quiz Completion → Mastery Update (2 hours)**

**Goal**: Connect quiz results to BKT mastery tracking

**Implementation**:

**File**: `src/features/quizzes/hooks/useCompleteQuizAttempt.ts`

**Add mastery update logic**:

```typescript
import { processQuizAttempt } from "@/features/study-plan/services/mastery.service";

export const useCompleteQuizAttempt = () => {
  return useMutation({
    mutationFn: async (params: CompleteAttemptParams) => {
      // 1. Complete the quiz attempt (existing)
      await completeQuizAttempt(...);

      // 2. Get quiz results with concepts
      const results = await getQuizResults(params.attemptId);

      // 3. Update mastery for each concept
      await processQuizAttempt({
        subjectId: params.subjectId, // Need to add this
        results: results.map(r => ({
          concept: r.question.concept,
          isCorrect: r.isCorrect,
          difficulty: r.question.difficulty,
        })),
      });

      return results;
    },
    onSuccess: () => {
      // Invalidate pass probability queries
      queryClient.invalidateQueries({ queryKey: ["passProbability"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};
```

**New Service Function**:

**File**: `src/features/study-plan/services/mastery.service.ts`

**Add**:

```typescript
/**
 * Process quiz attempt and update mastery for all concepts
 * Called after quiz completion
 */
export async function processQuizAttempt(params: {
  subjectId: string;
  results: Array<{
    concept: string;
    isCorrect: boolean;
    difficulty: "easy" | "medium" | "hard";
  }>;
}): Promise<void> {
  for (const result of params.results) {
    await updateMastery({
      userId: getCurrentUserId(), // From auth
      subjectId: params.subjectId,
      topicName: result.concept,
      isCorrect: result.isCorrect,
      difficulty: result.difficulty,
    });
  }
}
```

---

### **Phase 4: Pass Probability Calculation & Storage (1-2 hours)**

**Goal**: Calculate and store pass probability after mastery updates

**Implementation**:

**File**: `src/features/subjects/services/subjectService.ts`

**Add**:

```typescript
/**
 * Update subject's pass chance from BKT mastery
 * Called after quiz completion
 */
export async function updatePassChanceFromBKT(
  subjectId: string
): Promise<SubjectServiceResponse> {
  try {
    // Get pass probability from BKT
    const result = await getPredictedPassProbability(subjectId);

    if (result.error || !result.data) {
      return { success: false, error: result.error || "Failed to calculate" };
    }

    const passChance = result.data.probability;

    // Update subject
    const { error } = await supabase
      .from("subjects")
      .update({
        pass_chance: passChance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subjectId);

    if (error) {
      return { success: false, error: handleDatabaseError(error) };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: handleDatabaseError(error) };
  }
}
```

**Call after mastery update**:

```typescript
// In useCompleteQuizAttempt onSuccess
onSuccess: async (_, variables) => {
  // Update pass chance
  await updatePassChanceFromBKT(variables.subjectId);

  // Invalidate caches
  queryClient.invalidateQueries({ queryKey: ["subjects"] });
};
```

---

### **Phase 5: UI Integration - Display Pass Probability (2 hours)**

**Goal**: Show pass probability throughout the app

#### **A. Subject Detail Page**

**File**: `src/features/subjects/pages/SubjectDetailPage.tsx`

**Update**:

```typescript
// Use actual pass_chance from subject
<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
  <div className="mb-3 flex items-center justify-between">
    <span className="text-sm font-medium text-gray-600">Pass Chance</span>
    <Target className="size-5 text-green-600" />
  </div>
  <div className="mb-2 text-3xl font-bold text-gray-900">
    {subject.pass_chance ?? "--"}%
  </div>
  <p className="text-xs text-gray-500">
    {subject.pass_chance
      ? `Based on ${topicCount} topics analyzed`
      : "Complete quizzes to calculate"}
  </p>
</div>
```

#### **B. Dashboard**

**File**: `src/features/dashboard/pages/DashboardPage.tsx`

**Add Average Pass Chance**:

```typescript
const avgPassChance =
  subjects.length > 0
    ? Math.round(
        subjects
          .filter((s) => s.pass_chance !== null)
          .reduce((sum, s) => sum + (s.pass_chance || 0), 0) /
          subjects.filter((s) => s.pass_chance !== null).length
      )
    : null;

<Card>
  <h3>Average Pass Chance</h3>
  <p className="text-4xl font-bold">
    {avgPassChance ? `${avgPassChance}%` : "--"}
  </p>
  <p className="text-sm text-gray-600">Across all subjects</p>
</Card>;
```

#### **C. Quiz Results Page (Optional)**

**File**: `src/features/quizzes/components/quizresults/QuizResultsPage.tsx`

**Add**:

```typescript
// Fetch updated pass chance
const { data: subject } = useSubject(props.subjectId);

<Card>
  <h3>Your Updated Pass Chance</h3>
  <p className="text-3xl font-bold">{subject?.pass_chance ?? "--"}%</p>
  <p className="text-sm">
    {passChanceIncreased && "🌻 Improved after this quiz!"}
  </p>
</Card>;
```

---

### **Phase 6: Testing & Validation (1-2 hours)**

**Test Flow**:

1. ✅ Create new subject
2. ✅ Upload material
3. ✅ Generate quiz (verify concepts are populated)
4. ✅ Complete quiz
5. ✅ Verify topic_mastery table updated
6. ✅ Verify pass_chance calculated
7. ✅ Verify UI shows updated pass_chance
8. ✅ Complete 2-3 more quizzes
9. ✅ Verify pass_chance changes

**SQL Queries for Validation**:

```sql
-- Check concepts are populated
SELECT concept, COUNT(*)
FROM questions
WHERE quiz_id = 'xxx'
GROUP BY concept;

-- Check mastery updates
SELECT topic_name, mastery_level, p_learned, p_known
FROM topic_mastery
WHERE subject_id = 'xxx'
ORDER BY updated_at DESC;

-- Check pass chance
SELECT name, pass_chance, updated_at
FROM subjects
WHERE id = 'xxx';
```

---

## 📋 File Checklist

### **Files to Create**:

- [ ] `src/features/study/README.md` - Explain folder purpose

### **Files to Modify**:

- [ ] `src/features/quizzes/services/quizGenerationService.ts` - Add concept to prompt
- [ ] `src/features/quizzes/hooks/useCompleteQuizAttempt.ts` - Add mastery update
- [ ] `src/features/study-plan/services/mastery.service.ts` - Add processQuizAttempt()
- [ ] `src/features/subjects/services/subjectService.ts` - Add updatePassChanceFromBKT()
- [ ] `src/features/subjects/pages/SubjectDetailPage.tsx` - Display pass_chance
- [ ] `src/features/dashboard/pages/DashboardPage.tsx` - Display average pass_chance
- [ ] `src/features/quizzes/components/quizresults/QuizResultsPage.tsx` - Optional display

### **Files to Delete**:

- [ ] `src/features/study/supabase/study-plan-schema.sql` - Not migrated, causes confusion

---

## 🎯 Success Criteria

### **Must Have**:

- ✅ All quiz questions have concepts
- ✅ topic_mastery table updates after quiz
- ✅ pass_chance calculates and stores
- ✅ Pass probability displays on Subject Detail
- ✅ Pass probability displays on Dashboard

### **Nice to Have**:

- 🟢 Pass probability shows on Quiz Results
- 🟢 Pass probability trend indicator (↑ improving, → stable, ↓ declining)
- 🟢 Weak concepts identified on Quiz Results
- 🟢 "Review weak concepts" button

---

## ⏱️ Time Estimates

| Phase     | Task                         | Time         |
| --------- | ---------------------------- | ------------ |
| 1         | Code Cleanup                 | 30 min       |
| 2         | Concept Population           | 1-2 hours    |
| 3         | Mastery Update Integration   | 2 hours      |
| 4         | Pass Probability Calculation | 1-2 hours    |
| 5         | UI Integration               | 2 hours      |
| 6         | Testing & Validation         | 1-2 hours    |
| **TOTAL** | **7-10 hours**               | **1-2 days** |

---

## 🚨 Potential Issues & Solutions

### **Issue 1: Questions don't have concepts**

**Solution**: Validate during quiz generation, throw error if missing

### **Issue 2: BKT takes time to be accurate**

**Solution**: Start with default priors (p_init=0.3), show confidence level

### **Issue 3: Pass probability unstable with few quizzes**

**Solution**: Show "Insufficient data" until 3+ quizzes, display confidence level

### **Issue 4: Students confused by changing probability**

**Solution**: Add tooltip explaining BKT, show trend indicator

---

## 📚 Related Documentation

- `GARDEN_IMPLEMENTATION_PLAN.md` - Phase 1-6 complete
- `STUDY_SESSIONS_IMPLEMENTATION.md` - Study session logging
- `GARDEN_EMOTICON_SYSTEM.md` - Emoticon consistency
- `migration_0003_study_plans.sql` - Database schema reference
- `src/features/study-plan/utils/bkt.ts` - BKT algorithm implementation

---

## 🎉 Ready to Implement!

**Next Steps**:

1. Get approval on this plan
2. Start with Phase 1 (Code Cleanup) - 30 min
3. Move to Phase 2 (Concept Population) - quick win
4. Implement phases 3-6 systematically

**Say "Let's implement BKT" to start Phase 1!** 🚀
