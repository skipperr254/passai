import React from "react";
import { Award } from "lucide-react";

interface LevelProgressProps {
  subjectColor: string;
  level: number;
  displayProgress: number;
  leveledUp: boolean;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  subjectColor,
  level,
  displayProgress,
  leveledUp,
}) => {
  return (
    <div className="bg-linear-to-br from-[#0D7377]/10 to-[#4A7C59]/10 border-2 border-[#0D7377]/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl bg-${subjectColor}-600 flex items-center justify-center shadow-lg`}
          >
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2D3436]/70">
              Current Level
            </p>
            <p className="text-2xl font-bold text-[#2D3436]">Level {level}</p>
          </div>
        </div>
        {leveledUp && (
          <div className="px-4 py-2 bg-linear-to-r from-[#F2A541] to-[#E07A5F] text-white rounded-xl font-bold text-sm shadow-lg animate-bounce">
            Level Up! �
          </div>
        )}
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#2D3436]/80">
            Growth Progress
          </span>
          <span className="text-sm font-bold text-[#0D7377]">
            {Math.round(displayProgress)}%
          </span>
        </div>
        <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full bg-${subjectColor}-600 rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${displayProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>
      <p className="text-xs text-[#2D3436]/70">
        {leveledUp
          ? "� Congratulations! Your garden has grown to the next level!"
          : `${100 - Math.round(displayProgress)}% until next level`}
      </p>
    </div>
  );
};
