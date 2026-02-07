import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Sparkles, ArrowRight } from "lucide-react";

interface NoQuizAttemptsStateProps {
  subjectName: string;
}

export const NoQuizAttemptsState: React.FC<NoQuizAttemptsStateProps> = ({
  subjectName,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#0D7377]/10 flex items-center justify-center">
            <ClipboardList className="w-10 h-10 text-[#0D7377]" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl lg:text-3xl font-bold text-[#2D3436] mb-3">
          No Quiz Attempts Yet
        </h2>

        {/* Description */}
        <p className="text-[#2D3436]/70 mb-6 leading-relaxed">
          To generate a personalized study plan for{" "}
          <strong>{subjectName}</strong>, you need to complete at least one quiz
          first. This helps us understand your strengths and weaknesses to
          create a tailored learning path.
        </p>

        {/* What to do next */}
        <div className="bg-[#0D7377]/5 border border-[#0D7377]/20 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-[#0D7377]/90 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            What to do next
          </h3>
          <p className="text-sm text-[#0D7377]/80">
            Create and take a quiz to assess your current knowledge. Based on
            your performance, we'll generate a focused study plan to help you
            master the topics you need most.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/quizzes")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D7377] hover:bg-[#0D7377]/90 text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg"
        >
          <span>Go to Quizzes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
