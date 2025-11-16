/**
 * ProgressMetric Component
 *
 * Small reusable component for displaying a single metric with progress bar
 * Used by ProgressOverviewCard
 */

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressMetricProps {
  label: string;
  value: number; // 0-100 percentage
  icon: LucideIcon;
  iconColor?: string;
  progressColor?: string;
  displayValue?: string; // Optional custom display (e.g., "45/60 hours")
  className?: string;
}

export function ProgressMetric({
  label,
  value,
  icon: Icon,
  iconColor = "text-blue-600",
  progressColor = "bg-blue-600",
  displayValue,
  className,
}: ProgressMetricProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Label and Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", iconColor)} />
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-slate-900">
          {displayValue || `${value}%`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 rounded-full",
            progressColor
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
