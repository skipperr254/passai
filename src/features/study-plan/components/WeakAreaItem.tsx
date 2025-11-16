/**
 * WeakAreaItem Component
 *
 * Small component for displaying a single weak area with mastery level
 * Used by WeakAreasCard
 */

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WeakAreaItemProps {
  topicName: string;
  masteryLevel: number; // 0-100
  priority?: "high" | "medium" | "low";
  className?: string;
}

export function WeakAreaItem({
  topicName,
  masteryLevel,
  priority = "medium",
  className,
}: WeakAreaItemProps) {
  // Color based on mastery level
  const masteryColor =
    masteryLevel < 30
      ? "text-red-600 bg-red-50"
      : masteryLevel < 50
      ? "text-orange-600 bg-orange-50"
      : "text-yellow-600 bg-yellow-50";

  // Priority indicator
  const priorityConfig = {
    high: { color: "bg-red-500", label: "High Priority" },
    medium: { color: "bg-yellow-500", label: "Medium Priority" },
    low: { color: "bg-slate-400", label: "Low Priority" },
  };

  const priorityColor = priorityConfig[priority].color;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors",
        className
      )}
    >
      {/* Priority Indicator */}
      <div className={cn("w-1.5 h-12 rounded-full shrink-0", priorityColor)} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <p className="text-sm font-semibold text-slate-900 truncate">
            {topicName}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                masteryColor.split(" ")[0].replace("text-", "bg-")
              )}
              style={{ width: `${masteryLevel}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-700 w-10 text-right">
            {masteryLevel}%
          </span>
        </div>
      </div>
    </div>
  );
}
