/**
 * AnalyticsSummary Component
 *
 * Container component that composes all analytics cards in a responsive grid.
 * Fetches data via useSubjectAnalytics hook and distributes to child components.
 *
 * Layout:
 * - Desktop: 2x2 grid
 * - Tablet: 2 columns
 * - Mobile: 1 column stacked
 */

import { useSubjectAnalytics } from "../hooks/useSubjectAnalytics";
import { PassChanceCard } from "./PassChanceCard";
import { ProjectedOutcomeCard } from "./ProjectedOutcomeCard";
import { ProgressOverviewCard } from "./ProgressOverviewCard";
import { WeakAreasCard } from "./WeakAreasCard";

// =====================================================
// Types
// =====================================================

export interface AnalyticsSummaryProps {
  subjectId: string;
  onCreatePlan?: () => void;
  onViewPlan?: () => void;
  onViewTopic?: (topicId: string) => void;
}

// =====================================================
// Component
// =====================================================

export function AnalyticsSummary({
  subjectId,
  onCreatePlan,
  onViewPlan,
  onViewTopic,
}: AnalyticsSummaryProps) {
  const { data: analytics, isLoading, error } = useSubjectAnalytics(subjectId);

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">
          Failed to load analytics. Please try again later.
        </p>
      </div>
    );
  }

  // Loading state - show skeleton grid
  if (isLoading || !analytics) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <PassChanceCard passChance={0} isLoading />
        <ProjectedOutcomeCard currentPassChance={0} isLoading />
        <ProgressOverviewCard
          materialCoverage={0}
          averageMastery={0}
          totalStudyHours={0}
          completionRate={0}
          isLoading
        />
        <WeakAreasCard weakAreas={[]} isLoading />
      </div>
    );
  }

  // Main render with data
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Pass Chance Card */}
      <PassChanceCard
        passChance={analytics.passChance}
        trend={analytics.trend}
        confidence={analytics.confidence}
      />

      {/* Projected Outcome Card */}
      <ProjectedOutcomeCard
        currentPassChance={analytics.passChance}
        projectedPassChance={analytics.activePlan?.projectedPassChance}
        planTitle={analytics.activePlan?.title}
        planTotalHours={analytics.activePlan?.totalHours}
        planCompletionDate={analytics.activePlan?.completionDate}
        onCreatePlan={onCreatePlan}
        onViewPlan={onViewPlan}
      />

      {/* Progress Overview Card */}
      <ProgressOverviewCard
        materialCoverage={analytics.progress.materialCoverage}
        averageMastery={analytics.progress.averageMastery}
        totalStudyHours={analytics.progress.totalStudyHours}
        completionRate={analytics.progress.completionRate}
      />

      {/* Weak Areas Card */}
      <WeakAreasCard
        weakAreas={analytics.weakAreas}
        onGeneratePlan={onCreatePlan}
        onViewTopic={onViewTopic}
      />
    </div>
  );
}
