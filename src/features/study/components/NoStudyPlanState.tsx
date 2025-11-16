import React from "react";
import { Brain, Sparkles, Zap } from "lucide-react";

interface NoStudyPlanStateProps {
  subjectName: string;
  onGeneratePlan: () => void;
  isGenerating?: boolean;
}

export const NoStudyPlanState: React.FC<NoStudyPlanStateProps> = ({
  subjectName,
  onGeneratePlan,
  isGenerating = false,
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <Brain className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
          Ready to Create Your Study Plan?
        </h2>

        {/* Description */}
        <p className="text-slate-600 mb-6 leading-relaxed">
          Great news! You've completed a quiz for <strong>{subjectName}</strong>
          . Now we can generate a personalized study plan based on your
          performance to help you master the material.
        </p>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 text-left p-3 bg-purple-50 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">
                AI-Powered Analysis
              </h4>
              <p className="text-xs text-slate-600">
                Analyzes your quiz performance to identify weak areas
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left p-3 bg-blue-50 rounded-lg">
            <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">
                Personalized Tasks
              </h4>
              <p className="text-xs text-slate-600">
                Get specific, actionable tasks tailored to your needs
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left p-3 bg-green-50 rounded-lg">
            <Brain className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">
                Optimized Schedule
              </h4>
              <p className="text-xs text-slate-600">
                Balances your available time with test preparation goals
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGeneratePlan}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Your Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Study Plan</span>
            </>
          )}
        </button>

        {isGenerating && (
          <p className="text-sm text-slate-500 mt-3">
            This may take a few moments...
          </p>
        )}
      </div>
    </div>
  );
};
