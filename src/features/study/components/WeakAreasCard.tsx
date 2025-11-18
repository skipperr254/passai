import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock, Target } from "lucide-react";
import type { WeakArea } from "../types/analytics.types";

interface WeakAreasCardProps {
  weakAreas: WeakArea[];
  isLoading?: boolean;
}

export function WeakAreasCard({ weakAreas, isLoading }: WeakAreasCardProps) {
  if (isLoading) {
    return (
      <Card className="border-orange-200 bg-orange-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (weakAreas.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-green-600" />
            <span>Areas to Improve</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-green-900">
              Great job! 🎉
            </h3>
            <p className="text-sm text-green-700">
              No weak areas identified. Keep up the excellent work!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-300",
          badge: "bg-red-600 text-white",
        };
      case "medium":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          border: "border-orange-300",
          badge: "bg-orange-600 text-white",
        };
      case "low":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-300",
          badge: "bg-yellow-600 text-white",
        };
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span>Areas to Improve</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Focus on these topics to boost your pass probability
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {weakAreas.map((area, index) => {
          const colors = getPriorityColor(area.priority);
          return (
            <div
              key={`${area.topicName}-${index}`}
              className={`p-4 rounded-lg border-2 ${colors.border} ${colors.bg}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${colors.text}`}>
                      {area.topicName}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}
                    >
                      {area.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Current mastery: {area.masteryLevel}%
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Accuracy</p>
                    <p className="text-sm font-medium text-gray-900">
                      {area.totalAttempts > 0
                        ? Math.round(
                            (area.correctCount / area.totalAttempts) * 100
                          )
                        : 0}
                      % ({area.correctCount}/{area.totalAttempts})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Recommended</p>
                    <p className="text-sm font-medium text-gray-900">
                      {area.recommendedStudyTime} min
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/60">
                <div
                  className="h-full bg-orange-600 transition-all duration-500"
                  style={{ width: `${area.masteryLevel}%` }}
                />
              </div>

              {/* Last Practiced */}
              {area.lastPracticedAt && (
                <p className="text-xs text-gray-600 mt-2">
                  Last practiced:{" "}
                  {new Date(area.lastPracticedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          );
        })}

        {/* Action Tip */}
        <div className="pt-3 border-t border-orange-200">
          <p className="text-sm text-orange-800">
            🌺 <strong>Tip:</strong> Complete quizzes focusing on these topics
            to improve your overall pass probability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
