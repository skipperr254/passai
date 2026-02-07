import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ProgressBarProps {
  completed: number;
  total: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  showLabel = true,
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const getProgressColor = (percent: number): string => {
    if (percent === 100) return "bg-[#4A7C59]";
    if (percent >= 75) return "bg-[#0D7377]";
    if (percent >= 50) return "bg-[#4A7C59]";
    if (percent >= 25) return "bg-[#0D7377]";
    return "bg-[#2D3436]/70";
  };

  const getProgressBgColor = (percent: number): string => {
    if (percent === 100) return "bg-[#6A994E]/10";
    if (percent >= 75) return "bg-[#0D7377]/10";
    if (percent >= 50) return "bg-[#4A7C59]/10";
    if (percent >= 25) return "bg-[#0D7377]/10";
    return "bg-[#FAF3E0]";
  };

  return (
    <div className="mb-6">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#2D3436]/70" />
            <span className="text-sm font-semibold text-[#2D3436]/80">
              Overall Progress
            </span>
          </div>
          <span className="text-sm font-bold text-[#2D3436]">
            {completed} / {total} tasks completed
          </span>
        </div>
      )}
      <div
        className={`w-full h-3 ${getProgressBgColor(
          percentage
        )} rounded-full overflow-hidden`}
      >
        <div
          className={`h-full ${getProgressColor(
            percentage
          )} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-end mt-1">
          <span className="text-xs font-medium text-[#2D3436]/60">
            {percentage}% complete
          </span>
        </div>
      )}
    </div>
  );
};
