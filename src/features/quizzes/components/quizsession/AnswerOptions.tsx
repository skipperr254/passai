import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Question } from "../../types/quiz";
import { TextAnswerInput } from "./TextAnswerInput";

interface AnswerOptionsProps {
  currentQuestion: Question;
  selectedAnswer: string;
  hasSubmitted: boolean;
  setSelectedAnswer: (answer: string) => void;
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  currentQuestion,
  selectedAnswer,
  hasSubmitted,
  setSelectedAnswer,
}) => {
  // For short answer, essay, and fill-in-blank questions, show text input
  if (
    currentQuestion.type === "short-answer" ||
    currentQuestion.type === "essay" ||
    currentQuestion.type === "fill-in-blank"
  ) {
    return (
      <TextAnswerInput
        questionType={currentQuestion.type}
        value={selectedAnswer}
        onChange={setSelectedAnswer}
        disabled={hasSubmitted}
      />
    );
  }

  // For multiple choice and true-false, show options
  return (
    <div className="space-y-3 mb-6">
      {currentQuestion.options?.map((option, idx) => {
        const isSelected = selectedAnswer === option;
        // For multiple-choice: correct_answer is the index, not the text
        const correctIndex =
          currentQuestion.type === "multiple-choice"
            ? parseInt(currentQuestion.correct_answer, 10)
            : -1;
        const isCorrect =
          currentQuestion.type === "multiple-choice"
            ? idx === correctIndex
            : option.toLowerCase() ===
              currentQuestion.correct_answer.toLowerCase();
        const showResult = hasSubmitted;
        let optionClass =
          "bg-white border-2 border-[#E8E4E1] hover:border-[#E8E4E1] text-[#2D3436]";
        if (showResult) {
          if (isCorrect)
            optionClass =
              "bg-[#6A994E]/10 border-2 border-[#6A994E] text-[#4A7C59]";
          else if (isSelected && !isCorrect)
            optionClass = "bg-red-50 border-2 border-red-500 text-red-900";
          else
            optionClass =
              "bg-[#FAF3E0] border-2 border-[#E8E4E1] text-[#6B7280]";
        } else if (isSelected)
          optionClass = "bg-[#0D7377]/5 border-2 border-[#0D7377] text-[#0D7377]";

        return (
          <button
            key={idx}
            onClick={() => !hasSubmitted && setSelectedAnswer(option)}
            disabled={hasSubmitted}
            className={`w-full text-left px-4 lg:px-5 py-3 lg:py-4 rounded-xl font-semibold transition-all active:scale-[0.98] ${optionClass} ${
              hasSubmitted ? "cursor-default" : "cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-7 h-7 rounded-lg bg-white/50 flex items-center justify-center text-sm font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
              {showResult && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-[#6A994E] shrink-0" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
