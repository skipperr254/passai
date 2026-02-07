import React, { useState, useEffect } from "react";
import { X, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { useSubjects } from "../../hooks/useSubjects";
import { useMaterials } from "../../hooks/useMaterials";
import { useCreateQuiz } from "../../hooks/useCreateQuiz";
import type { QuizSettings, Subject } from "../../types/quiz";
import { SubjectSelection } from "./SubjectSelection";
import { MaterialSelection } from "./MaterialSelection";
import { QuizConfiguration } from "./QuizConfiguration";
import { toast } from "sonner";

interface CreateQuizFlowProps {
  onClose: () => void;
  onQuizCreated?: (quizId: string) => void;
  preSelectedSubject?: string;
}

export const CreateQuizFlow: React.FC<CreateQuizFlowProps> = ({
  onClose,
  onQuizCreated,
  preSelectedSubject,
}) => {
  const { mutate: createNewQuiz, isPending: isGenerating } = useCreateQuiz();

  const { data: subjects = [] } = useSubjects();
  const { data: materials = [] } = useMaterials();

  const needsSubjectSelection = !preSelectedSubject;
  const [step, setStep] = useState<
    "select-subject" | "select-materials" | "configure" | "generating"
  >(needsSubjectSelection ? "select-subject" : "select-materials");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
    preSelectedSubject
      ? subjects.find((s) => s.name === preSelectedSubject) || null
      : null
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    customTitle: "",
    subjectName: selectedSubject ? selectedSubject.name : "",
    questionCount: 10,
    difficulty: "medium",
    timeLimit: 30,
    questionTypes: {
      multipleChoice: true,
      trueFalse: true,
      shortAnswer: true,
      essay: false,
      fillInBlank: true,
    },
    cognitiveMix: { recall: 30, understanding: 50, application: 20 },
    focusAreas: "",
  });

  const filteredMaterials = selectedSubject
    ? materials.filter((m) => m.subject_id === selectedSubject.id)
    : materials;

  useEffect(() => {
    if (step === "generating" && !isGenerating) {
      // Mutation complete; transition handled in onSuccess
    }
  }, [step, isGenerating]);

  const toggleMaterialSelection = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const selectAllMaterials = () =>
    setSelectedMaterials(filteredMaterials.map((m) => m.id));
  const deselectAllMaterials = () => setSelectedMaterials([]);

  const handleGenerateQuiz = () => {
    if (!selectedSubject) return;
    setStep("generating");
    createNewQuiz(
      {
        subjectId: selectedSubject.id,
        settings: quizSettings,
        materialIds: selectedMaterials,
      },
      {
        onSuccess: ({ quizId }) => {
          console.log("✅ Quiz created successfully with ID:", quizId);
          toast.success("Quiz generated successfully!");
          onQuizCreated?.(quizId);
          onClose();
        },
        onError: (error) => {
          console.error("❌ Quiz generation failed:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to generate quiz. Please try again."
          );
          setStep("configure");
        },
      }
    );
  };

  const canProceedFromSubject = !!selectedSubject;
  const canProceedFromMaterials = selectedMaterials.length > 0;

  const totalSteps = needsSubjectSelection ? 3 : 2;
  const currentStepNumber =
    step === "select-subject"
      ? 1
      : step === "select-materials"
      ? needsSubjectSelection
        ? 2
        : 1
      : step === "configure"
      ? needsSubjectSelection
        ? 3
        : 2
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-4xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-4 lg:px-6 py-4 lg:py-5 border-b border-[#E8E4E1] bg-linear-to-br from-[#0D7377] to-[#4A7C59]">
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-0.5">
                Create AI Quiz
              </h2>
              <p className="text-sm text-white/90">
                {step === "select-subject" && "Choose a subject"}
                {step === "select-materials" && "Select materials"}
                {step === "configure" && "Configure quiz details"}
                {step === "generating" && "Generating your quiz..."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all shrink-0"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          {step !== "generating" && (
            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    idx < currentStepNumber ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === "select-subject" && (
            <SubjectSelection
              subjects={subjects}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              materials={materials}
            />
          )}
          {step === "select-materials" && (
            <MaterialSelection
              selectedSubject={selectedSubject}
              filteredMaterials={filteredMaterials}
              selectedMaterials={selectedMaterials}
              toggleMaterialSelection={toggleMaterialSelection}
              selectAllMaterials={selectAllMaterials}
              deselectAllMaterials={deselectAllMaterials}
            />
          )}
          {step === "configure" && (
            <QuizConfiguration
              quizSettings={quizSettings}
              setQuizSettings={setQuizSettings}
              showAdvancedOptions={showAdvancedOptions}
              setShowAdvancedOptions={setShowAdvancedOptions}
              selectedSubject={selectedSubject}
              selectedMaterials={selectedMaterials}
            />
          )}
          {step === "generating" && (
            <div className="p-6 lg:p-12">
              <div className="max-w-md mx-auto text-center">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-linear-to-br from-[#0D7377] to-[#4A7C59] rounded-full animate-pulse opacity-20" />
                  <div className="absolute inset-2 bg-linear-to-br from-[#0D7377] to-[#4A7C59] rounded-full flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                  <div
                    className="absolute inset-0 border-4 border-[#0D7377] border-t-transparent rounded-full animate-spin"
                    style={{ animationDuration: "2s" }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#2D3436] mb-2">
                  Generating Your Quiz
                </h3>
                <p className="text-[#2D3436]/70">
                  Our AI is creating personalized questions from your materials
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 px-4 lg:px-6 py-4 border-t border-[#E8E4E1] bg-[#FAF3E0]">
          <div className="flex gap-3">
            {step !== "generating" && (
              <>
                {step !== "select-subject" && (
                  <button
                    onClick={() => {
                      if (step === "configure") setStep("select-materials");
                      else if (
                        step === "select-materials" &&
                        needsSubjectSelection
                      )
                        setStep("select-subject");
                    }}
                    className="px-4 lg:px-6 py-3 bg-white border-2 border-[#E8E4E1] text-[#2D3436]/80 font-semibold rounded-xl hover:bg-[#FAF3E0] active:scale-95 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (step === "select-subject" && canProceedFromSubject)
                      setStep("select-materials");
                    else if (
                      step === "select-materials" &&
                      canProceedFromMaterials
                    )
                      setStep("configure");
                    else if (step === "configure") {
                      handleGenerateQuiz();
                    }
                  }}
                  disabled={
                    (step === "select-subject" && !canProceedFromSubject) ||
                    (step === "select-materials" && !canProceedFromMaterials) ||
                    (step === "configure" && isGenerating)
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-linear-to-r from-[#0D7377] to-[#4A7C59] text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {step === "select-subject" && "Continue"}
                        {step === "select-materials" && "Continue"}
                        {step === "configure" && "Generate Quiz"}
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
