import React from "react";
import {
  Brain,
  BookOpen,
  Lightbulb,
  FileText,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import type { GenerationStep } from "../../types/quiz";

interface GeneratingProgressProps {
  generationProgress: GenerationStep;
  isLoading?: boolean;
}

const generationSteps = [
  {
    step: "analyzing-materials" as GenerationStep,
    label: "Analyzing your materials",
    icon: BookOpen,
  },
  {
    step: "identifying-topics" as GenerationStep,
    label: "Identifying key topics",
    icon: Lightbulb,
  },
  {
    step: "generating-questions" as GenerationStep,
    label: "Generating questions",
    icon: Brain,
  },
  {
    step: "creating-explanations" as GenerationStep,
    label: "Creating explanations",
    icon: FileText,
  },
  {
    step: "finalizing" as GenerationStep,
    label: "Finalizing your quiz",
    icon: Sparkles,
  },
  { step: "complete" as GenerationStep, label: "Quiz ready!", icon: Check },
];

export const GeneratingProgress: React.FC<GeneratingProgressProps> = ({
  generationProgress,
  isLoading = false,
}) => {
  const currentStepIndex = generationSteps.findIndex(
    (s) => s.step === generationProgress
  );

  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-linear-to-br from-[#0D7377] to-[#4A7C59] rounded-full animate-pulse opacity-20" />
          {isLoading ? (
            <div className="absolute inset-2 bg-linear-to-br from-[#0D7377] to-[#4A7C59] rounded-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          ) : (
            <div className="absolute inset-2 bg-linear-to-br from-[#0D7377] to-[#4A7C59] rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-white animate-pulse" />
            </div>
          )}
          <div
            className="absolute inset-0 border-4 border-[#0D7377] border-t-transparent rounded-full animate-spin"
            style={{ animationDuration: "2s" }}
          />
        </div>
        <h3 className="text-2xl font-bold text-[#2D3436] mb-2">
          {isLoading ? "Generating Your Quiz" : "Quiz Generated Successfully!"}
        </h3>
        <p className="text-[#2D3436]/70 mb-8">
          {isLoading
            ? "Our AI is analyzing your materials and creating personalized questions"
            : "Your personalized quiz is ready"}
        </p>
        {isLoading ? (
          <div className="space-y-4">
            {generationSteps.map((item, index) => {
              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isComplete
                      ? "bg-[#6A994E]/10 border-2 border-[#6A994E]/20"
                      : isCurrent
                      ? "bg-[#0D7377]/10 border-2 border-[#0D7377] scale-105"
                      : "bg-[#FAF3E0] border-2 border-[#E8E4E1] opacity-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isComplete
                        ? "bg-[#6A994E]"
                        : isCurrent
                        ? "bg-[#0D7377]"
                        : "bg-[#E8E4E1]"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span
                    className={`font-semibold text-sm lg:text-base ${
                      isComplete
                        ? "text-[#6A994E]"
                        : isCurrent
                        ? "text-[#0D7377]"
                        : "text-[#2D3436]/70"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          // Success state (if not loading, but since isLoading=false means complete, show a check or something
          <div className="flex justify-center">
            <Check className="w-16 h-16 text-[#6A994E] animate-bounce" />
          </div>
        )}
      </div>
    </div>
  );
};
