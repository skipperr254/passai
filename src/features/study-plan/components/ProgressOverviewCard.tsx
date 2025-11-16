/**
 * ProgressOverviewCard Component
 *
 * Displays overview of study progress metrics:
 * - Material coverage (% of materials reviewed)
 * - Average mastery level
 * - Total study time
 * - Task completion rate (if plan exists)
 *
 * Composes multiple ProgressMetric components for clean, maintainable code
 */

import { BookOpen, Brain, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressMetric } from "./ProgressMetric";
import { cn } from "@/lib/utils";

export interface ProgressOverviewCardProps {
  materialCoverage: number; // 0-100 percentage
  averageMastery: number; // 0-100 percentage
  totalStudyHours: number; // Actual hours studied
  completionRate?: number; // 0-100 percentage (tasks completed if plan exists)
  totalMaterials?: number; // For display (e.g., "12/20 materials")
  coveredMaterials?: number;
  targetStudyHours?: number; // For display (e.g., "45/60 hours")
  completedTasks?: number;
  totalTasks?: number;
  isLoading?: boolean;
  className?: string;
}

export function ProgressOverviewCard({
  materialCoverage,
  averageMastery,
  totalStudyHours,
  completionRate,
  totalMaterials,
  coveredMaterials,
  targetStudyHours,
  completedTasks,
  totalTasks,
  isLoading = false,
  className,
}: ProgressOverviewCardProps) {
  // Determine overall progress status
  const overallProgress =
    completionRate !== undefined
      ? completionRate
      : (materialCoverage + averageMastery) / 2;

  const status =
    overallProgress >= 80
      ? "excellent"
      : overallProgress >= 60
      ? "good"
      : overallProgress >= 40
      ? "fair"
      : "needs-work";

  const statusConfig = {
    excellent: {
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      badgeColor: "bg-green-100 text-green-700",
      label: "On Track",
    },
    good: {
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      badgeColor: "bg-blue-100 text-blue-700",
      label: "Good Progress",
    },
    fair: {
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      badgeColor: "bg-yellow-100 text-yellow-700",
      label: "Keep Going",
    },
    "needs-work": {
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      badgeColor: "bg-red-100 text-red-700",
      label: "Just Started",
    },
  };

  const config = statusConfig[status];

  // Format display values
  const materialDisplay =
    totalMaterials && coveredMaterials !== undefined
      ? `${coveredMaterials}/${totalMaterials}`
      : undefined;

  const studyHoursDisplay = targetStudyHours
    ? `${totalStudyHours}/${targetStudyHours}h`
    : `${totalStudyHours}h`;

  const completionDisplay =
    completedTasks !== undefined && totalTasks
      ? `${completedTasks}/${totalTasks}`
      : undefined;

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-12 bg-slate-100 rounded animate-pulse" />
          <div className="h-12 bg-slate-100 rounded animate-pulse" />
          <div className="h-12 bg-slate-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

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
            <span className="text-slate-900">Progress Overview</span>
          </CardTitle>
          <Badge
            variant="secondary"
            className={cn("text-xs font-medium", config.badgeColor)}
          >
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-5">
        {/* Material Coverage */}
        <ProgressMetric
          label="Material Coverage"
          value={materialCoverage}
          icon={BookOpen}
          iconColor="text-blue-600"
          progressColor="bg-blue-600"
          displayValue={materialDisplay}
        />

        {/* Average Mastery */}
        <ProgressMetric
          label="Average Mastery"
          value={averageMastery}
          icon={Brain}
          iconColor="text-purple-600"
          progressColor="bg-purple-600"
        />

        {/* Study Time */}
        <ProgressMetric
          label="Study Time"
          value={
            targetStudyHours ? (totalStudyHours / targetStudyHours) * 100 : 100
          }
          icon={Clock}
          iconColor="text-amber-600"
          progressColor="bg-amber-600"
          displayValue={studyHoursDisplay}
        />

        {/* Task Completion (if plan exists) */}
        {completionRate !== undefined && (
          <ProgressMetric
            label="Task Completion"
            value={completionRate}
            icon={CheckCircle2}
            iconColor="text-green-600"
            progressColor="bg-green-600"
            displayValue={completionDisplay}
          />
        )}

        {/* Summary Stats */}
        <div
          className={cn(
            "grid grid-cols-3 gap-2 pt-2 rounded-lg p-3",
            config.bgColor
          )}
        >
          <div className="text-center">
            <p className={cn("text-lg font-bold", config.color)}>
              {Math.round(overallProgress)}%
            </p>
            <p className="text-xs text-slate-600">Overall</p>
          </div>
          <div className="text-center">
            <p className={cn("text-lg font-bold", config.color)}>
              {totalStudyHours}h
            </p>
            <p className="text-xs text-slate-600">Studied</p>
          </div>
          <div className="text-center">
            <p className={cn("text-lg font-bold", config.color)}>
              {Math.round(averageMastery)}%
            </p>
            <p className="text-xs text-slate-600">Mastery</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
