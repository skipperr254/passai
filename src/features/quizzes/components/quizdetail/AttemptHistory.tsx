import React from "react";
import { BarChart3, FileQuestion } from "lucide-react";
import type { QuizAttempt } from "../../types/quiz";
import { AttemptCard } from "./AttemptCard";

interface AttemptHistoryProps {
  attempts: QuizAttempt[];
  onSelectAttempt: (attempt: QuizAttempt) => void;
  onContinue?: (attemptId: string) => void;
}

export const AttemptHistory: React.FC<AttemptHistoryProps> = ({
  attempts,
  onSelectAttempt,
  onContinue,
}) => {
  return (
    <section className="bg-white rounded-xl lg:rounded-2xl border border-[#E8E4E1] p-5 lg:p-6 shadow-sm">
      <h2 className="text-lg lg:text-xl font-bold text-[#2D3436] mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-[#0D7377]" />
        Attempt History
        <span className="ml-auto text-sm font-semibold text-[#2D3436]/70 bg-[#FAF3E0] px-3 py-1 rounded-lg">
          {attempts.length} total
        </span>
      </h2>
      {attempts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#FAF3E0] rounded-full flex items-center justify-center mx-auto mb-3">
            <FileQuestion className="w-8 h-8 text-[#2D3436]/50" />
          </div>
          <p className="text-[#2D3436]/70 font-medium">No attempts yet</p>
          <p className="text-sm text-[#2D3436]/60 mt-1">
            Start the quiz to see your progress
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <AttemptCard
              key={attempt.id}
              attempt={attempt}
              onClick={() => onSelectAttempt(attempt)}
              attempts={attempts}
              onContinue={onContinue}
            />
          ))}
        </div>
      )}
    </section>
  );
};
