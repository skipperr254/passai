import React, { useState } from "react";
import { X, Clock, Target } from "lucide-react";

interface GenerateStudyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (settings: { availableHoursPerWeek: number }) => void;
  subjectName: string;
  testDate: string | null;
  isGenerating: boolean;
}

export const GenerateStudyPlanModal: React.FC<GenerateStudyPlanModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  subjectName,
  testDate,
  isGenerating,
}) => {
  const [availableHoursPerWeek, setAvailableHoursPerWeek] =
    useState<number>(10);

  const handleGenerate = () => {
    onGenerate({ availableHoursPerWeek });
  };

  if (!isOpen) return null;

  const daysUntilTest = testDate
    ? Math.ceil(
        (new Date(testDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  // Check if test date is in the past
  const isTestDateInPast = testDate ? (daysUntilTest ?? 0) < 0 : false;

  const totalStudyHours =
    daysUntilTest && daysUntilTest > 0
      ? Math.floor((daysUntilTest / 7) * availableHoursPerWeek)
      : Math.floor((30 / 7) * availableHoursPerWeek);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E8E4E1]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-[#2D3436] mb-1">
                Grow Your Learning Garden 🌱
              </h2>
              <p className="text-sm text-[#2D3436]/70">For {subjectName}</p>
            </div>
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="shrink-0 p-2 hover:bg-[#FAF3E0] rounded-lg transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#2D3436]/70" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Test Date Info */}
          {testDate && daysUntilTest !== null && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                isTestDateInPast
                  ? "bg-red-50 border-red-200"
                  : "bg-[#0D7377]/5 border-[#0D7377]/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Target
                  className={`w-4 h-4 ${
                    isTestDateInPast ? "text-red-600" : "text-[#0D7377]"
                  }`}
                />
                <span
                  className={`font-semibold text-sm ${
                    isTestDateInPast ? "text-red-900" : "text-[#0D7377]/90"
                  }`}
                >
                  Test Date
                </span>
              </div>
              <p
                className={`text-sm ${
                  isTestDateInPast ? "text-red-800" : "text-[#0D7377]/80"
                }`}
              >
                {new Date(testDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p
                className={`text-xs mt-1 ${
                  isTestDateInPast ? "text-red-600" : "text-[#0D7377]"
                }`}
              >
                {isTestDateInPast
                  ? `This date has passed (${Math.abs(daysUntilTest)} days ago)`
                  : `${daysUntilTest} days remaining`}
              </p>
            </div>
          )}

          {/* Warning for past test date */}
          {isTestDateInPast && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>⚠️ Cannot Start Garden:</strong> The test date has
                already passed. Please update the test date to a future date
                before growing your garden.
              </p>
            </div>
          )}

          {/* Study Time Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#2D3436] mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#4A7C59]" />
                <span>Garden Care Time Per Week</span>
              </div>
            </label>
            <p className="text-xs text-[#2D3436]/70 mb-3">
              How many hours per week can you water and tend your {subjectName}{" "}
              garden?
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="40"
                value={availableHoursPerWeek}
                onChange={(e) =>
                  setAvailableHoursPerWeek(Number(e.target.value))
                }
                className="flex-1"
                disabled={isGenerating}
              />
              <div className="w-20 text-center">
                <span className="text-2xl font-bold text-[#0D7377]">
                  {availableHoursPerWeek}
                </span>
                <span className="text-sm text-[#2D3436]/70 ml-1">hrs</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-[#2D3436]/60 mt-2">
              <span>1 hr</span>
              <span>40 hrs</span>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-[#6A994E]/5 rounded-lg border border-[#6A994E]/20">
            <h3 className="font-semibold text-[#2D3436] text-sm mb-3">
              🌿 Garden Care Plan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#2D3436]/70">Weekly watering time:</span>
                <span className="font-semibold text-[#2D3436]">
                  {availableHoursPerWeek} hours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2D3436]/70">Total care time:</span>
                <span className="font-semibold text-[#2D3436]">
                  ~{totalStudyHours} hours
                </span>
              </div>
              {daysUntilTest && (
                <div className="flex justify-between">
                  <span className="text-[#2D3436]/70">Duration:</span>
                  <span className="font-semibold text-[#2D3436]">
                    {daysUntilTest} days
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-4 p-3 bg-[#6A994E]/5 border border-[#6A994E]/20 rounded-lg">
            <p className="text-xs text-[#4A7C59]/90 leading-relaxed">
              <strong>🌱 Note:</strong> Your garden will be personalized based
              on your quiz performance. We'll focus on seedlings that need the
              most water to help them grow strong.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E8E4E1] bg-[#FAF3E0]">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 px-4 py-3 bg-white border-2 border-[#E8E4E1] text-[#2D3436]/80 font-semibold rounded-lg hover:bg-[#FAF3E0] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || isTestDateInPast}
              className="flex-1 px-4 py-3 bg-linear-to-r from-[#0D7377] to-[#0D7377] hover:from-[#0D7377]/90 hover:to-[#0D7377]/90 disabled:from-[#2D3436]/50 disabled:to-[#2D3436]/60 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
              title={
                isTestDateInPast ? "Cannot start garden for past test date" : ""
              }
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                "Plant My Garden 🌱"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
