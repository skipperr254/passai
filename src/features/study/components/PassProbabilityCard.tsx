import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PassProbabilityCardProps {
  passChance: number | null | undefined;
  subjectName: string;
  isLoading?: boolean;
  showDetails?: boolean;
}

export function PassProbabilityCard({
  passChance,
  subjectName,
  isLoading = false,
  showDetails = false,
}: PassProbabilityCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-24 mb-2" />
          <Skeleton className="h-2 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Default to 0 if no pass chance available
  const probability = passChance ?? 0;

  // Determine status and styling based on probability
  const getStatus = (prob: number) => {
    if (prob >= 80)
      return { label: "Excellent", color: "text-green-600", emoji: "🎯" };
    if (prob >= 70)
      return { label: "Good", color: "text-green-500", emoji: "✅" };
    if (prob >= 60)
      return { label: "Fair", color: "text-yellow-600", emoji: "📈" };
    if (prob >= 50)
      return { label: "Moderate", color: "text-yellow-500", emoji: "⚠️" };
    if (prob >= 40)
      return { label: "Needs Work", color: "text-orange-500", emoji: "📚" };
    return { label: "Focus Required", color: "text-red-500", emoji: "🔥" };
  };

  const getProgressColor = (prob: number) => {
    if (prob >= 70) return "bg-green-500";
    if (prob >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMessage = (prob: number) => {
    if (prob >= 80)
      return "You're on track for success! Keep up the excellent work.";
    if (prob >= 70)
      return "You're doing well! Continue practicing to solidify your knowledge.";
    if (prob >= 60)
      return "You're making progress. Focus on your weak areas to improve.";
    if (prob >= 50)
      return "Keep studying! A bit more practice will help significantly.";
    if (prob >= 40)
      return "Focus on understanding key concepts. Regular practice is essential.";
    if (prob > 0)
      return "Concentrate on building a strong foundation. More study time needed.";
    return "Start practicing to track your progress and improve your chances.";
  };

  const status = getStatus(probability);
  const progressColor = getProgressColor(probability);

  return (
    <Card
      className="border-l-4"
      style={{
        borderLeftColor:
          probability >= 70
            ? "#22c55e"
            : probability >= 50
            ? "#eab308"
            : "#ef4444",
      }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{status.emoji}</span>
          <span>Pass Probability</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main probability display */}
        <div className="flex items-baseline gap-2">
          <span className={`text-5xl font-bold ${status.color}`}>
            {probability}%
          </span>
          <span className={`text-lg font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-500 ease-out ${progressColor}`}
              style={{ width: `${probability}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Status message */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {getMessage(probability)}
        </p>

        {/* Additional details if requested */}
        {showDetails && probability > 0 && (
          <div className="pt-3 border-t space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Based on:</span>
              <span className="font-medium">BKT Mastery Tracking</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This probability is calculated from your performance across all
              topics in {subjectName}. Complete more quizzes to improve
              accuracy.
            </p>
          </div>
        )}

        {/* No data state */}
        {probability === 0 && (
          <div className="pt-2 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No quiz data yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Complete your first quiz to see your pass probability
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
