import React from "react";
import { Trophy, Sparkles, FileQuestion, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PlanCompletionCelebrationProps {
  subjectId: string;
  subjectName: string;
  gardenHealth: number;
  onGenerateNewPlan: () => void;
}

export const PlanCompletionCelebration: React.FC<
  PlanCompletionCelebrationProps
> = ({ subjectId, subjectName, gardenHealth, onGenerateNewPlan }) => {
  const navigate = useNavigate();

  const handleTakeQuiz = () => {
    // Navigate to quiz generation page for this subject
    navigate(`/quiz/${subjectId}`);
  };

  return (
    <div className="mt-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-linear-to-br from-green-50 via-blue-50 to-purple-50 opacity-50" />

      <div className="relative p-8 rounded-2xl border-2 border-green-200 bg-white/80 backdrop-blur-sm">
        {/* Trophy Icon with Sparkles */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
            <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-yellow-400 animate-pulse delay-75" />
          </div>
        </div>

        {/* Celebration Message */}
        <div className="text-center mb-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
            Your Garden is in Full Bloom! 🌸
          </h3>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed mb-2">
            You've come a long way—well done! Your {subjectName} garden is
            thriving at{" "}
            <span className="font-bold text-green-600">{gardenHealth}%</span>.
          </p>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Ready to see how much you've grown? Let's test your knowledge or
            plant new seeds for continued growth.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Take Quiz Button - Primary CTA */}
          <Button
            onClick={handleTakeQuiz}
            size="lg"
            className="w-full sm:w-auto bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <FileQuestion className="w-5 h-5 mr-2" />
            Test Your Knowledge
          </Button>

          {/* Generate New Plan Button - Secondary */}
          <Button
            onClick={onGenerateNewPlan}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-2 border-green-500 text-green-700 hover:bg-green-50 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Grow Another Garden
          </Button>
        </div>

        {/* Encouraging Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 italic">
            "Every seed you water becomes a blooming flower of knowledge." 🌱✨
          </p>
        </div>
      </div>
    </div>
  );
};
