# BKT Integration Implementation Plan (REVISED)

**Date**: November 16, 2025  
**Phase**: Critical Priority #2  
**Status**: Planning Complete - Ready for Implementation  
**Prerequisites**: Garden System ✅ Complete

---

## 🎯 Executive Summary

**Goal**: Integrate Bayesian Knowledge Tracking (BKT) with quiz system to calculate accurate pass probabilities and enable adaptive learning.

**Strategy**: Migrate BKT code from zombie `study-plan/` folder to active `study/` folder, update to use `studyy_*` tables (with double-y), and integrate with quiz completion flow.

---

## ✅ Code Structure - CORRECTED UNDERSTANDING

### **ACTIVE Implementation** 🟢

**Location**: `src/features/study/`  
**Database Tables**: `studyy_plans`, `studyy_plan_topics`, `studyy_plan_tasks` (with **double-y**)  
**Status**: LIVE in production with real user data  
**Schema Source**: `study/supabase/study-plan-schema.sql` (manually migrated to Supabase)  
**Current Code**: `services/studyPlanService.ts` (basic implementation)

### **ZOMBIE Implementation** 💀

**Location**: `src/features/study-plan/`  
**Tables Referenced**: `study_plans`, `study_plan_topics`, `study_plan_tasks` (without double-y)  
**Status**: NOT used in live app (more complete but inactive)

**Valuable Code to Migrate**:

- ✅ `utils/bkt.ts` - Bayesian Knowledge Tracking algorithm (310 lines)
- ✅ `services/mastery.service.ts` - Mastery tracking logic
- ✅ `services/study-sessions.service.ts` - Study session utilities
- ✅ Types and interfaces for analytics

### **Database Reality**

**LIVE Tables** ✅:

- `studyy_plans` (with double-y) ← **ACTIVE**
- `studyy_plan_topics` (with double-y) ← **ACTIVE**
- `studyy_plan_tasks` (with double-y) ← **ACTIVE**
- `topic_mastery` (shared, active)
- `study_sessions` (shared, active)
- `questions` (has `concept` field ready for BKT)

**Zombie Tables** 💀:

- `study_plans` (from migration_0003, not actively used)
- `study_plan_topics`
- `study_plan_tasks`

---

## 📋 Implementation Phases

### **Phase 1: Migrate BKT Code to Active Folder** 🚀

**Objective**: Copy BKT algorithm and mastery service from zombie folder to active folder, update table references.

#### Tasks:

1. **Copy BKT Algorithm**

   - Source: `study-plan/utils/bkt.ts`
   - Destination: `study/utils/bkt.ts`
   - Changes: None needed (algorithm is table-agnostic)
   - Verification: Confirm types and interfaces are correct

2. **Copy Mastery Service**

   - Source: `study-plan/services/mastery.service.ts`
   - Destination: `study/services/mastery.service.ts`
   - **CRITICAL Changes**:
     - Update all `study_plans` → `studyy_plans`
     - Update all `study_plan_topics` → `studyy_plan_topics`
     - Update all `study_plan_tasks` → `studyy_plan_tasks`
   - Update imports to reference `study/` folder
   - Ensure compatibility with existing `studyPlanService.ts`

3. **Copy Analytics Types**

   - Source: `study-plan/types/analytics.types.ts`
   - Destination: `study/types/analytics.types.ts`
   - Changes: Review and ensure compatibility

4. **Verification Checklist**:
   - [ ] All files compile without errors
   - [ ] No references to zombie `study_plans` tables (without double-y)
   - [ ] Imports point to `study/` folder
   - [ ] Types are properly exported/imported
   - [ ] No circular dependencies

---

### **Phase 2: Populate Concept Field in Quiz Generation** 📝

**Objective**: Ensure every question has a concept tag for BKT tracking.

#### Current State:

- `questions` table has `concept: TEXT` field ✅
- Quiz generation doesn't populate it ❌

#### Tasks:

1. **Update AI Quiz Generation Prompt**

   - Location: `quizzes/services/quiz-generation.service.ts`
   - Add instruction: "For each question, identify the specific concept/topic being tested"
   - Example concepts: "Photosynthesis", "Mitochondrial Function", "Cell Division"

2. **Update Quiz Generation Response Schema**

   - Ensure response includes `concept` field for each question
   - Validate concept is not null/empty

3. **Store Concept in Database**

   - When inserting questions, populate `concept` field
   - Ensure RLS policies allow updates

4. **Backfill Existing Questions** (Optional for later)
   - Generate concepts for existing questions using AI
   - Update in batches

#### Verification:

- [ ] New quizzes have concept field populated
- [ ] Concepts are specific and meaningful
- [ ] No null/empty concepts in new questions

---

### **Phase 3: Integrate Mastery Updates into Quiz Completion** 🔗

**Objective**: Call BKT algorithm after quiz completion to update mastery levels.

#### Data Flow:

```
User completes quiz
  ↓
Quiz results calculated
  ↓
Garden system updated (✅ already done)
  ↓
Study session logged (✅ already done)
  ↓
FOR EACH question answered:
  - Get concept from question
  - Get current mastery from topic_mastery table
  - Call BKT algorithm to calculate new mastery
  - Update topic_mastery table
  ↓
Calculate overall pass probability
  ↓
Update subjects.pass_chance
```

#### Tasks:

1. **Hook into Quiz Completion**

   - Location: `QuizSession.tsx` already has completion handler
   - After garden update, call mastery service
   - Pass: user_id, subject_id, quiz_attempt_id

2. **Implement processQuizAttempt()**

   - Use migrated mastery service from Phase 1
   - Query all user_answers for this quiz_attempt
   - For each answer:
     - Get question.concept
     - Get current mastery from topic_mastery
     - Call `updateMasteryFromPerformance()` from BKT
     - Upsert new mastery to topic_mastery table

3. **Handle topic_mastery Table**

   - Ensure RLS policies allow inserts/updates
   - Use upsert pattern (INSERT ... ON CONFLICT UPDATE)
   - Track: user_id, subject_id, topic/concept, p_mastery, attempts

4. **Link to studyy_plan_topics**
   - Ensure topics in study plan match concepts in questions
   - Create mapping if needed

#### Code Structure:

```typescript
// study/services/mastery.service.ts
export async function processQuizAttempt(
  userId: string,
  subjectId: string,
  quizAttemptId: string
): Promise<void> {
  // 1. Get all answers for this quiz
  const answers = await getUserAnswers(quizAttemptId);

  // 2. Group by concept
  const conceptPerformance = groupByConcept(answers);

  // 3. For each concept, update mastery
  for (const [concept, performance] of conceptPerformance) {
    const currentMastery = await getMastery(userId, subjectId, concept);
    const newMastery = updateMasteryFromPerformance(
      currentMastery,
      performance.correctCount,
      performance.totalCount
    );
    await upsertMastery(userId, subjectId, concept, newMastery);
  }
}
```

#### Verification:

- [ ] topic_mastery table populates after quiz
- [ ] Mastery values are between 0 and 1
- [ ] Multiple quizzes update same topic correctly
- [ ] No errors in console during quiz completion

---

### **Phase 4: Calculate Pass Probability** 📊

**Objective**: Calculate overall pass chance from topic mastery and display to user.

#### Algorithm:

```
For a given subject:
1. Get all topics in studyy_plan_topics for this subject's study plan
2. For each topic:
   - Get p_mastery from topic_mastery table
   - Get topic.weight (importance) from studyy_plan_topics
3. Calculate weighted average:
   pass_probability = Σ(p_mastery × weight) / Σ(weight)
4. Store in subjects.pass_chance
```

#### Tasks:

1. **Implement calculatePassProbability()**

   - Location: `study/services/mastery.service.ts`
   - Query studyy_plan_topics for subject
   - Join with topic_mastery to get p_mastery values
   - Calculate weighted average
   - Handle missing mastery data (default to 0.3 or P_init)

2. **Update subjects.pass_chance**

   - Call after each processQuizAttempt()
   - Update subjects table
   - Invalidate React Query cache

3. **Format for Display**
   - Convert 0-1 range to percentage (0-100%)
   - Round to nearest integer
   - Add helper function: `formatPassChance(probability: number): string`

#### Code Example:

```typescript
// study/services/mastery.service.ts
export async function calculatePassProbability(
  userId: string,
  subjectId: string
): Promise<number> {
  // Get study plan for subject
  const studyPlan = await getStudyPlanBySubject(userId, subjectId);
  if (!studyPlan) return 0;

  // Get topics and their weights
  const topics = await supabase
    .from("studyy_plan_topics")
    .select("topic_name, weight, p_mastery")
    .eq("plan_id", studyPlan.id);

  // Calculate weighted average
  let totalWeight = 0;
  let weightedSum = 0;

  for (const topic of topics.data || []) {
    const mastery = await getMastery(userId, subjectId, topic.topic_name);
    weightedSum += (mastery?.p_mastery || 0.3) * (topic.weight || 1);
    totalWeight += topic.weight || 1;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export async function updateSubjectPassChance(
  userId: string,
  subjectId: string
): Promise<void> {
  const passChance = await calculatePassProbability(userId, subjectId);

  await supabase
    .from("subjects")
    .update({ pass_chance: Math.round(passChance * 100) })
    .eq("id", subjectId)
    .eq("user_id", userId);
}
```

#### Verification:

- [ ] Pass chance updates after quiz completion
- [ ] Values are between 0-100
- [ ] Multiple quizzes improve pass chance appropriately
- [ ] subjects.pass_chance column is updated

---

### **Phase 5: Display Pass Probability in UI** 🎨

**Objective**: Show pass probability on Subject Detail Page and Dashboard.

#### Display Locations:

1. **Subject Detail Page** (`subjects/pages/SubjectDetailPage.tsx`)

   - Add pass probability card below garden health
   - Show percentage with progress bar
   - Color coding:
     - 🟢 Green: 70%+ (good chance)
     - 🟡 Yellow: 50-69% (moderate chance)
     - 🔴 Red: <50% (needs more work)

2. **Dashboard Page** (`dashboard/pages/DashboardPage.tsx`)
   - Show pass probability for each subject
   - Maybe add to existing subject cards
   - Sort subjects by pass probability

#### UI Components:

```typescript
// Create: study/components/PassProbabilityCard.tsx
interface PassProbabilityCardProps {
  subjectId: string;
  subjectName: string;
  showDetails?: boolean;
}

export function PassProbabilityCard({ subjectId, subjectName, showDetails }: PassProbabilityCardProps) {
  const { data: subject } = useQuery({
    queryKey: ['subject', subjectId],
    queryFn: () => getSubject(subjectId)
  });

  const passChance = subject?.pass_chance || 0;
  const status = passChance >= 70 ? 'good' : passChance >= 50 ? 'moderate' : 'needs-work';
  const emoji = passChance >= 70 ? '🎯' : passChance >= 50 ? '📈' : '📚';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {emoji} Pass Probability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{passChance}%</div>
        <Progress value={passChance} className="mt-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {status === 'good' && 'You're on track! Keep up the great work.'}
          {status === 'moderate' && 'You're making progress. A bit more practice will help.'}
          {status === 'needs-work' && 'Focus on weak topics to improve your chances.'}
        </p>
        {showDetails && (
          <Button variant="link" className="mt-2 p-0">
            View topic breakdown →
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

#### Tasks:

1. **Create PassProbabilityCard Component**

   - Responsive design
   - Color-coded based on percentage
   - Accessible with ARIA labels

2. **Integrate into Subject Detail Page**

   - Add below SubjectGardenCard
   - Show detailed breakdown option

3. **Integrate into Dashboard**

   - Show in subject list or separate section
   - Maybe add overall pass chance across all subjects

4. **Add Loading States**
   - Skeleton while calculating
   - Handle null/undefined pass_chance

#### Verification:

- [ ] Pass probability displays correctly
- [ ] Colors update based on percentage
- [ ] Clicking shows more details (optional)
- [ ] Loading states work properly

---

### **Phase 6: Testing & Validation** ✅

**Objective**: Comprehensive end-to-end testing of BKT integration.

#### Test Scenarios:

1. **New User Flow**

   - Create account
   - Add subject with study plan
   - Take first quiz
   - Verify: mastery initialized, pass chance calculated

2. **Existing User Flow**

   - User with existing quizzes
   - Take new quiz
   - Verify: mastery updates correctly, pass chance improves

3. **Multiple Topics**

   - Quiz covering multiple concepts
   - Verify: each topic's mastery updates independently

4. **Edge Cases**
   - Quiz with all correct answers → mastery should increase significantly
   - Quiz with all wrong answers → mastery should decrease slightly
   - No study plan → graceful handling
   - Missing concepts → default behavior

#### Verification Checklist:

**Database**:

- [ ] topic_mastery table populates correctly
- [ ] studyy\_\* tables (double-y) are used, not zombie tables
- [ ] No references to study_plans (without double-y)
- [ ] RLS policies allow necessary operations

**Code**:

- [ ] All imports reference study/ folder (not study-plan/)
- [ ] No TypeScript errors
- [ ] No console errors during quiz flow
- [ ] React Query cache invalidations work

**Functionality**:

- [ ] BKT algorithm calculates mastery correctly
- [ ] Pass probability updates after each quiz
- [ ] UI displays current pass chance
- [ ] Multiple quizzes improve mastery over time

**User Experience**:

- [ ] Quiz completion flow is smooth
- [ ] No noticeable performance degradation
- [ ] Loading states are appropriate
- [ ] Error messages are helpful

---

## 🎯 Success Criteria

**BKT Integration is complete when**:

1. ✅ BKT code migrated from study-plan/ to study/
2. ✅ All table references use studyy\_\* (with double-y)
3. ✅ Quiz questions have concept field populated
4. ✅ Mastery updates automatically after quiz completion
5. ✅ Pass probability calculates from topic mastery
6. ✅ Pass probability displays on Subject Detail Page
7. ✅ Pass probability displays on Dashboard
8. ✅ End-to-end testing passes all scenarios
9. ✅ No references to zombie study_plans tables
10. ✅ Documentation updated

---

## 📝 Key Decisions & Notes

### **Critical Corrections**:

- ✅ study/ folder is ACTIVE (not study-plan/)
- ✅ studyy\_\* tables (double-y) are LIVE with data
- ✅ study-plan/ folder is ZOMBIE (more complete but unused)
- ✅ Migration strategy: Copy code FROM study-plan/ TO study/

### **Table Name Convention**:

- **ALWAYS use**: `studyy_plans`, `studyy_plan_topics`, `studyy_plan_tasks`
- **NEVER use**: `study_plans`, `study_plan_topics`, `study_plan_tasks`
- Remember: Double-y = Active ✅

### **Code Migration Strategy**:

1. Copy file from study-plan/ to study/
2. Update all table references (add double-y)
3. Update all imports (point to study/)
4. Test compilation and runtime
5. Verify no zombie table references

### **BKT Algorithm Notes**:

- Algorithm itself is table-agnostic (no changes needed)
- Mastery service needs table name updates
- P_init = 0.3 (default starting mastery)
- P_learn typically 0.1-0.3 (how fast users learn)
- P_forget typically 0.1-0.2 (knowledge decay)
- P_slip typically 0.1 (correct answer by chance)

### **Integration Points**:

- Quiz completion → Garden update (✅ done)
- Quiz completion → Study session logging (✅ done)
- Quiz completion → **Mastery update** (← NEW)
- Mastery update → **Pass probability calculation** (← NEW)
- Pass probability → **UI display** (← NEW)

---

## 🚀 Next Steps

1. **Start Phase 1**: Migrate BKT code to active folder
2. **Verify compilation**: Ensure no TypeScript errors
3. **Phase 2**: Update quiz generation to populate concepts
4. **Phase 3**: Connect quiz completion to mastery updates
5. **Phase 4**: Calculate pass probability
6. **Phase 5**: Display pass probability in UI
7. **Phase 6**: Comprehensive testing

**Estimated Timeline**: 3-4 hours total implementation time

---

## 📚 Related Documentation

- `GARDEN_EMOTICON_SYSTEM.md` - Garden system reference
- `STUDY_SESSIONS_IMPLEMENTATION.md` - Study sessions documentation
- `study/supabase/study-plan-schema.sql` - Active database schema
- `md/study-plan-analytics/BKT.md` - BKT algorithm explanation
- `md/study-plan-analytics/STUDY_PLAN_ROADMAP.md` - Overall roadmap

---

**Plan Created**: November 16, 2025  
**Status**: ✅ Ready for Implementation  
**Next Action**: Begin Phase 1 - Migrate BKT code from study-plan/ to study/
