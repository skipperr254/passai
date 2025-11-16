import React from "react";
import { TrendingUp, Calendar } from "lucide-react";
import { calculateDaysUntilTest } from "../utils/mockData";

interface StatsCardsProps {
  passChance: number | null;
  testDate: string | null;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  passChance,
  testDate,
}) => {
  const daysUntilTest = calculateDaysUntilTest(testDate);

  const getPassChanceColor = (chance: number | null): string => {
    if (chance === null) return "text-slate-600";
    if (chance >= 80) return "text-green-600";
    if (chance >= 60) return "text-blue-600";
    if (chance >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getPassChanceBg = (chance: number | null): string => {
    if (chance === null) return "from-slate-50 to-slate-100";
    if (chance >= 80) return "from-green-50 to-emerald-50";
    if (chance >= 60) return "from-blue-50 to-indigo-50";
    if (chance >= 40) return "from-amber-50 to-yellow-50";
    return "from-red-50 to-rose-50";
  };

  const getDaysColor = (days: number): string => {
    if (days === 0) return "text-slate-600";
    if (days <= 7) return "text-red-600";
    if (days <= 14) return "text-amber-600";
    return "text-blue-600";
  };

  const getDaysBg = (days: number): string => {
    if (days === 0) return "from-slate-50 to-slate-100";
    if (days <= 7) return "from-red-50 to-rose-50";
    if (days <= 14) return "from-amber-50 to-yellow-50";
    return "from-blue-50 to-indigo-50";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Pass Chance Card */}
      <div
        className={`bg-linear-to-br ${getPassChanceBg(
          passChance
        )} rounded-xl p-4 lg:p-6 border border-slate-200/60 shadow-sm`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp
                className={`w-5 h-5 ${getPassChanceColor(passChance)}`}
              />
              <p className="text-sm font-medium text-slate-600">
                Projected Pass Chance
              </p>
            </div>
            <p
              className={`text-3xl lg:text-4xl font-bold ${getPassChanceColor(
                passChance
              )}`}
            >
              {passChance !== null ? `${passChance}%` : "N/A"}
            </p>
            {passChance !== null && (
              <p className="text-xs lg:text-sm text-slate-500 mt-1">
                {passChance >= 80
                  ? "Excellent! Keep up the great work"
                  : passChance >= 60
                  ? "Good progress, stay consistent"
                  : passChance >= 40
                  ? "More practice needed"
                  : "Focus on weak topics"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Days Until Test Card */}
      <div
        className={`bg-linear-to-br ${getDaysBg(
          daysUntilTest
        )} rounded-xl p-4 lg:p-6 border border-slate-200/60 shadow-sm`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className={`w-5 h-5 ${getDaysColor(daysUntilTest)}`} />
              <p className="text-sm font-medium text-slate-600">
                Days Until Test
              </p>
            </div>
            <p
              className={`text-3xl lg:text-4xl font-bold ${getDaysColor(
                daysUntilTest
              )}`}
            >
              {testDate ? daysUntilTest : "Not set"}
            </p>
            {testDate && daysUntilTest > 0 && (
              <p className="text-xs lg:text-sm text-slate-500 mt-1">
                {new Date(testDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
            {testDate && daysUntilTest === 0 && (
              <p className="text-xs lg:text-sm text-slate-500 mt-1">
                Test date has passed
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
