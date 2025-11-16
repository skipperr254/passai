/**
 * ProjectedOutcomeCard Component
 *
 * Displays before/after pass probability comparison if a study plan is completed:
 * - Current pass chance
 * - Projected pass chance after plan completion
 * - Improvement amount and percentage
 * - Visual comparison (side-by-side or comparison bar)
 * - Call-to-action if no plan exists
 */

import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProjectedOutcomeCardProps {
  currentPassChance: number; // 0-100
  projectedPassChance?: number; // 0-100, undefined if no plan exists
  planTitle?: string;
  planTotalHours?: number;
  planCompletionDate?: Date;
  onCreatePlan?: () => void;
  onViewPlan?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ProjectedOutcomeCard({
  currentPassChance,
  projectedPassChance,
  planTitle,
  planTotalHours,
  planCompletionDate,
  onCreatePlan,
  onViewPlan,
  isLoading = false,
  className,
}: ProjectedOutcomeCardProps) {
  const hasPlan = projectedPassChance !== undefined;

  // Calculate improvement
  const improvement = hasPlan ? projectedPassChance - currentPassChance : 0;
  const improvementPercentage =
    currentPassChance > 0
      ? Math.round((improvement / currentPassChance) * 100)
      : 0;

  // Determine improvement status
  const improvementStatus =
    improvement >= 20
      ? "excellent"
      : improvement >= 10
      ? "good"
      : improvement >= 5
      ? "moderate"
      : "minimal";

  const improvementConfig = {
    excellent: {
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      badgeColor: "bg-green-100 text-green-700",
    },
    good: {
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    moderate: {
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      badgeColor: "bg-yellow-100 text-yellow-700",
    },
    minimal: {
      color: "text-slate-700",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      badgeColor: "bg-slate-100 text-slate-700",
    },
  };

  const config = improvementConfig[improvementStatus];

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-24 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-10 bg-slate-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // No plan exists - show CTA
  if (!hasPlan) {
    return (
      <Card className={cn("overflow-hidden border-dashed", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-600" />
            <span className="text-slate-900">Projected Outcome</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center py-6 space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                No Study Plan Yet
              </p>
              <p className="text-xs text-slate-600">
                Create a personalized study plan to see your projected
                improvement
              </p>
            </div>
          </div>

          {onCreatePlan && (
            <Button
              onClick={onCreatePlan}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Study Plan
            </Button>
          )}

          <div className="text-center">
            <p className="text-xs text-slate-500">
              AI will analyze your weak areas and create an optimal plan
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Has plan - show comparison
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg",
        className
      )}
    >
      <CardHeader
        className={cn("pb-3 border-b", config.borderColor, config.bgColor)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className={cn("w-5 h-5", config.color)} />
            <span className="text-slate-900">Projected Outcome</span>
          </CardTitle>
          {improvement > 0 && (
            <Badge
              variant="secondary"
              className={cn("text-xs font-medium", config.badgeColor)}
            >
              +{improvement}% Improvement
            </Badge>
          )}
        </div>
        {planTitle && (
          <p className="text-xs text-slate-600 mt-1 font-medium">{planTitle}</p>
        )}
      </CardHeader>

      <CardContent className="pt-6 space-y-5">
        {/* Before/After Comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current */}
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
              Current
            </p>
            <div className="text-3xl font-bold text-slate-700">
              {currentPassChance}%
            </div>
            <p className="text-xs text-slate-500">Pass Chance</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRight className={cn("w-6 h-6", config.color)} />
          </div>

          {/* Projected - takes remaining space */}
          <div className="text-center space-y-1 -ml-8">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
              Projected
            </p>
            <div className={cn("text-3xl font-bold", config.color)}>
              {projectedPassChance}%
            </div>
            <p className="text-xs text-slate-500">After Plan</p>
          </div>
        </div>

        {/* Visual Comparison Bar */}
        <div className="space-y-2">
          <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
            {/* Current bar */}
            <div
              className="absolute inset-y-0 left-0 bg-slate-300 transition-all duration-500"
              style={{ width: `${currentPassChance}%` }}
            />
            {/* Projected bar */}
            <div
              className={cn(
                "absolute inset-y-0 left-0 transition-all duration-500",
                config.color.replace("text-", "bg-")
              )}
              style={{ width: `${projectedPassChance}%` }}
            />
            {/* Labels */}
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <span className="text-xs font-bold text-white drop-shadow">
                {currentPassChance}%
              </span>
              <span className="text-xs font-bold text-white drop-shadow">
                {projectedPassChance}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Before</span>
            <span className={cn("font-semibold", config.color)}>
              {improvement > 0 && "+"}
              {improvement}% increase
              {improvementPercentage > 0 &&
                ` (${improvementPercentage}% relative)`}
            </span>
            <span className="text-slate-500">After</span>
          </div>
        </div>

        {/* Plan Details */}
        {(planTotalHours || planCompletionDate) && (
          <div
            className={cn(
              "flex items-center justify-around py-3 rounded-lg",
              config.bgColor
            )}
          >
            {planTotalHours !== undefined && (
              <div className="text-center">
                <p className={cn("text-lg font-bold", config.color)}>
                  {planTotalHours}h
                </p>
                <p className="text-xs text-slate-600">Study Time</p>
              </div>
            )}
            {planCompletionDate && (
              <div className="text-center">
                <p className={cn("text-lg font-bold", config.color)}>
                  {Math.ceil(
                    (planCompletionDate.getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </p>
                <p className="text-xs text-slate-600">Until Complete</p>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {onViewPlan && (
          <Button onClick={onViewPlan} variant="outline" className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            View Full Plan
          </Button>
        )}

        {/* Encouragement Message */}
        <div className="text-center pt-2">
          {improvement >= 20 && (
            <p className="text-xs text-green-700 font-medium">
              🎉 Excellent plan! This will significantly boost your chances.
            </p>
          )}
          {improvement >= 10 && improvement < 20 && (
            <p className="text-xs text-blue-700 font-medium">
              📈 Great plan! You're on track for solid improvement.
            </p>
          )}
          {improvement >= 5 && improvement < 10 && (
            <p className="text-xs text-yellow-700 font-medium">
              💪 Good start! Consider more study time for better results.
            </p>
          )}
          {improvement < 5 && improvement > 0 && (
            <p className="text-xs text-slate-700 font-medium">
              ℹ️ Small gains expected. Focus on high-priority weak areas.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
