import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Lightbulb, Brain } from "lucide-react";
import type { Question } from "../../types/quiz";

interface QuestionHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: Question;
  hasSubmitted: boolean;
  handleQuestionFeedback: (feedback: "thumbs-up" | "thumbs-down") => void;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  // currentQuestionIndex,
  // totalQuestions,
  currentQuestion,
  hasSubmitted,
  handleQuestionFeedback,
}) => {
  const [showHint, setShowHint] = useState(false);

  const bloomLevelColors: Record<string, string> = {
    remember: "bg-[#FAF3E0] text-[#6B7280] border-[#E8E4E1]",
    understand: "bg-[#0D7377]/10 text-[#0D7377] border-[#0D7377]/20",
    apply: "bg-[#0D7377]/10 text-[#0D7377] border-[#0D7377]/20",
    analyze: "bg-[#F2A541]/10 text-[#F2A541] border-[#F2A541]/20",
    evaluate: "bg-rose-50 text-rose-600 border-rose-200",
    create: "bg-[#6A994E]/10 text-[#6A994E] border-[#6A994E]/20",
  };

  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#0D7377]/10 text-[#0D7377] text-xs font-semibold rounded-lg border border-[#0D7377]/20">
            {currentQuestion.topic}
          </span>
          {currentQuestion.bloom_level && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-lg border flex items-center gap-1 ${
                bloomLevelColors[currentQuestion.bloom_level] ||
                bloomLevelColors.understand
              }`}
              title={`Bloom's Taxonomy: ${currentQuestion.bloom_level}`}
            >
              <Brain className="w-3 h-3" />
              {currentQuestion.bloom_level}
            </span>
          )}
        </div>
        {!hasSubmitted && (
          <div className="flex items-center gap-1">
            {currentQuestion.hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors group ${
                  showHint
                    ? "bg-[#F2A541]/20 hover:bg-[#F2A541]/30"
                    : "hover:bg-[#FAF3E0]"
                }`}
                title={showHint ? "Hide hint" : "Show hint"}
              >
                <Lightbulb
                  className={`w-4 h-4 ${
                    showHint
                      ? "text-[#F2A541]"
                      : "text-[#2D3436]/50 group-hover:text-[#F2A541]"
                  }`}
                />
              </button>
            )}
            <button
              onClick={() => handleQuestionFeedback("thumbs-up")}
              className="w-8 h-8 rounded-lg hover:bg-[#FAF3E0] flex items-center justify-center transition-colors group"
              title="Good question"
            >
              <ThumbsUp className="w-4 h-4 text-[#2D3436]/50 group-hover:text-[#6A994E]" />
            </button>
            <button
              onClick={() => handleQuestionFeedback("thumbs-down")}
              className="w-8 h-8 rounded-lg hover:bg-[#FAF3E0] flex items-center justify-center transition-colors group"
              title="Report issue"
            >
              <ThumbsDown className="w-4 h-4 text-[#2D3436]/50 group-hover:text-red-600" />
            </button>
          </div>
        )}
      </div>
      {!hasSubmitted && showHint && currentQuestion.hint && (
        <div className="bg-[#F2A541]/10 border border-[#F2A541]/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-[#F2A541] mt-0.5 shrink-0" />
            <p className="text-sm text-[#F2A541]">{currentQuestion.hint}</p>
          </div>
        </div>
      )}
    </div>
  );
};
