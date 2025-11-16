/**
 * WeakAreasCard Component
 *
 * Displays top weak topics that need attention with:
 * - List of weak areas with mastery levels
 * - Quick action button to generate study plan
 * - Empty state if no weak areas
 *
 * Uses WeakAreaItem component for each item
 */

import { AlertTriangle, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeakAreaItem } from "./WeakAreaItem";
import { cn } from "@/lib/utils";

export interface WeakArea {
  topicName: string;
  masteryLevel: number; // 0-100
  priority?: "high" | "medium" | "low";
}

export interface WeakAreasCardProps {
  weakAreas: WeakArea[];
  onGeneratePlan?: () => void;
  onViewTopic?: (topicName: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function WeakAreasCard({
  weakAreas,
  onGeneratePlan,
  onViewTopic,
  isLoading = false,
  className,
}: WeakAreasCardProps) {
  const hasWeakAreas = weakAreas.length > 0;

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-5 w-28 bg-slate-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-16 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-16 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-16 bg-slate-100 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // No weak areas - show success state
  if (!hasWeakAreas) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3 border-b border-green-200 bg-green-50">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-slate-900">Weak Areas</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="text-center py-6 space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                Great Job! 🎉
              </p>
              <p className="text-xs text-slate-600">
                No weak areas identified. Keep up the excellent work!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Has weak areas - show list
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg",
        className
      )}
    >
      <CardHeader className="pb-3 border-b border-orange-200 bg-orange-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-slate-900">Weak Areas</span>
          </CardTitle>
          <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
            {weakAreas.length} {weakAreas.length === 1 ? "Topic" : "Topics"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {/* List of weak areas (show max 5) */}
        <div className="space-y-2">
          {weakAreas.slice(0, 5).map((area, index) => (
            <button
              key={`${area.topicName}-${index}`}
              onClick={() => onViewTopic?.(area.topicName)}
              className="w-full text-left"
              disabled={!onViewTopic}
            >
              <WeakAreaItem
                topicName={area.topicName}
                masteryLevel={area.masteryLevel}
                priority={area.priority}
              />
            </button>
          ))}
        </div>

        {/* Show more indicator if there are more than 5 */}
        {weakAreas.length > 5 && (
          <p className="text-xs text-center text-slate-500 pt-2">
            + {weakAreas.length - 5} more{" "}
            {weakAreas.length - 5 === 1 ? "topic" : "topics"}
          </p>
        )}

        {/* Action Button */}
        {onGeneratePlan && (
          <div className="pt-3">
            <Button
              onClick={onGeneratePlan}
              className="w-full bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Study Plan
            </Button>
          </div>
        )}

        {/* Help text */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-600">
            Focus on these topics to improve your pass probability
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
