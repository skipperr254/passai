import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, TrendingUp, AlertCircle } from "lucide-react";
import type { TopicMastery } from "../types/analytics.types";

interface TopicMasteryCardProps {
  topics: TopicMastery[];
  isLoading?: boolean;
}

export function TopicMasteryCard({ topics, isLoading }: TopicMasteryCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (topics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-[#0D7377]" />
            <span>Topic Mastery</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0D7377]/5">
              <Brain className="h-8 w-8 text-[#0D7377]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No mastery data yet
            </h3>
            <p className="text-sm text-gray-600">
              Complete quizzes to track your mastery by topic
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort topics by mastery level (highest first)
  const sortedTopics = [...topics].sort(
    (a, b) => b.mastery_level - a.mastery_level
  );

  const getMasteryColor = (level: number) => {
    if (level >= 80) return "bg-green-500";
    if (level >= 70) return "bg-green-400";
    if (level >= 60) return "bg-yellow-500";
    if (level >= 50) return "bg-yellow-400";
    if (level >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getMasteryTextColor = (level: number) => {
    if (level >= 80) return "text-green-700";
    if (level >= 70) return "text-green-600";
    if (level >= 60) return "text-yellow-700";
    if (level >= 50) return "text-yellow-600";
    if (level >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getMasteryLabel = (level: number) => {
    if (level >= 80) return "Mastered";
    if (level >= 70) return "Strong";
    if (level >= 60) return "Good";
    if (level >= 50) return "Moderate";
    if (level >= 40) return "Developing";
    return "Needs Work";
  };

  // Calculate average mastery
  const averageMastery = Math.round(
    topics.reduce((sum, t) => sum + t.mastery_level, 0) / topics.length
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-[#0D7377]" />
            <span>Topic Mastery</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Average:</span>
            <span
              className={`text-lg font-bold ${getMasteryTextColor(
                averageMastery
              )}`}
            >
              {averageMastery}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Topics List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {sortedTopics.map((topic) => (
            <div
              key={topic.id}
              className="space-y-2 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              {/* Topic Name and Level */}
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {topic.topic_name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`text-xs font-medium ${getMasteryTextColor(
                        topic.mastery_level
                      )}`}
                    >
                      {getMasteryLabel(topic.mastery_level)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {topic.correct_count}/{topic.total_attempts} correct
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {topic.mastery_level >= 80 && (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                  {topic.mastery_level < 50 && (
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  )}
                  <span
                    className={`text-xl font-bold ${getMasteryTextColor(
                      topic.mastery_level
                    )}`}
                  >
                    {topic.mastery_level}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full transition-all duration-500 ${getMasteryColor(
                    topic.mastery_level
                  )}`}
                  style={{ width: `${topic.mastery_level}%` }}
                />
              </div>

              {/* Last Practiced */}
              {topic.last_practiced_at && (
                <p className="text-xs text-gray-500">
                  Last practiced:{" "}
                  {new Date(topic.last_practiced_at).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t space-y-2">
          <p className="text-xs font-medium text-gray-600">Mastery Levels:</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-gray-600">80%+ Mastered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span className="text-gray-600">50-79% Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-gray-600">&lt;50% Needs Work</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
