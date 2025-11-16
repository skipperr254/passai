/**
 * PassChanceCard Component
 *
 * Displays the current pass probability for a subject with:
 * - Visual gauge/progress indicator
 * - Trend indicator (improving/stable/declining)
 * - Confidence level
 * - Color-coded based on probability
 */

import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PassChanceCardProps {
  passChance: number; // 0-100
  trend?: "improving" | "stable" | "declining";
  confidence?: "low" | "medium" | "high";
  previousPassChance?: number; // For showing change
  isLoading?: boolean;
  className?: string;
}

export function PassChanceCard({
  passChance,
  trend = "stable",
  confidence = "medium",
  previousPassChance,
  isLoading = false,
  className,
}: PassChanceCardProps) {
  // Calculate change if previous data available
  const changeAmount =
    previousPassChance !== undefined ? passChance - previousPassChance : null;

  // Determine status and colors
  const status =
    passChance >= 80
      ? "excellent"
      : passChance >= 60
      ? "good"
      : passChance >= 40
      ? "fair"
      : "needs-work";

  const statusConfig = {
    excellent: {
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      progressColor: "bg-green-600",
      icon: CheckCircle,
      label: "Excellent",
    },
    good: {
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      progressColor: "bg-blue-600",
      icon: Target,
      label: "Good",
    },
    fair: {
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      progressColor: "bg-yellow-600",
      icon: AlertCircle,
      label: "Fair",
    },
    "needs-work": {
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      progressColor: "bg-red-600",
      icon: AlertCircle,
      label: "Needs Work",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  // Trend icon and color
  const TrendIcon =
    trend === "improving"
      ? TrendingUp
      : trend === "declining"
      ? TrendingDown
      : Minus;

  const trendColor =
    trend === "improving"
      ? "text-green-600"
      : trend === "declining"
      ? "text-red-600"
      : "text-slate-500";

  const trendBgColor =
    trend === "improving"
      ? "bg-green-50"
      : trend === "declining"
      ? "bg-red-50"
      : "bg-slate-50";

  // Confidence badge colors
  const confidenceColors = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-green-100 text-green-700",
  };

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
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
            <StatusIcon className={cn("w-5 h-5", config.color)} />
            <span className="text-slate-900">Pass Probability</span>
          </CardTitle>
          <Badge
            variant="secondary"
            className={cn("text-xs font-medium", confidenceColors[confidence])}
          >
            {confidence === "high"
              ? "High"
              : confidence === "medium"
              ? "Med"
              : "Low"}{" "}
            Confidence
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Main Pass Chance Display */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className={cn("text-5xl font-bold", config.color)}>
              {passChance}%
            </span>
            {changeAmount !== null && (
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold",
                  trendBgColor,
                  trendColor
                )}
              >
                <TrendIcon className="w-4 h-4" />
                <span>{Math.abs(changeAmount).toFixed(0)}%</span>
              </div>
            )}
          </div>
          <p className="text-sm text-slate-600 font-medium">
            Predicted chance of passing
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="relative">
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  config.progressColor
                )}
                style={{ width: `${passChance}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>0%</span>
            <span className={config.color}>{config.label}</span>
            <span>100%</span>
          </div>
        </div>

        {/* Trend Indicator */}
        <div
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-3 rounded-lg",
            trendBgColor
          )}
        >
          <TrendIcon className={cn("w-4 h-4", trendColor)} />
          <span className={cn("text-sm font-semibold", trendColor)}>
            {trend === "improving" && "Trending upward"}
            {trend === "stable" && "Holding steady"}
            {trend === "declining" && "Needs attention"}
          </span>
        </div>

        {/* Status-specific message */}
        <div className="text-center pt-2">
          {status === "excellent" && (
            <p className="text-sm text-green-700 font-medium">
              You're on track! Keep up the great work.
            </p>
          )}
          {status === "good" && (
            <p className="text-sm text-blue-700 font-medium">
              Good progress! A bit more studying will help.
            </p>
          )}
          {status === "fair" && (
            <p className="text-sm text-yellow-700 font-medium">
              Focus on weak areas to improve your chances.
            </p>
          )}
          {status === "needs-work" && (
            <p className="text-sm text-red-700 font-medium">
              Create a study plan to target weak areas.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
