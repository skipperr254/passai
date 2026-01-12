import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchStudyPlans,
  getCompletedQuizAttemptsForSubject,
} from "../services/studyPlanService";
import {
  getSubjectById,
  getSubjects,
} from "@/features/subjects/services/subjectService";
import { NoStudyPlanState } from "../components/NoStudyPlanState";
import { StudyPlanDashboard } from "../components/StudyPlanDashboard";
import { GenerateStudyPlanModal } from "../components/GenerateStudyPlanModal";
import { useGenerateStudyPlan } from "../hooks/useGenerateStudyPlan";
import { useState, useEffect } from "react";
import { Loader2, BookOpen, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const StudyPlanPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // 1. Fetch all subjects to populate the selector
  const { data: allSubjectsResponse, isLoading: isLoadingAllSubjects } =
    useQuery({
      queryKey: ["subjects"],
      queryFn: getSubjects,
    });

  const subjects = allSubjectsResponse?.data || [];

  // 2. Determine the effective subject ID
  // If subjectId param is present, use it.
  // If not, use the first subject from the list (defaulting behavior).
  const effectiveSubjectId =
    subjectId || (subjects.length > 0 ? subjects[0].id : null);

  // 3. Effect to handle redirection/defaulting
  useEffect(() => {
    // If we're at /study-plan (no id) and we have subjects,
    // we could optionally redirect to /study-plan/:firstId.
    // For now, we'll just let effectiveSubjectId handle the logic without changing URL
    // unless the user explicitly selects something.
    // But to keep UI substantially consistent, let's allow "no URL param" to mean "first subject".
  }, [subjectId, subjects]);

  // Handle subject change from dropdown
  const handleSubjectChange = (newSubjectId: string) => {
    navigate(`/study-plan/${newSubjectId}`);
  };

  // Queries for the SELECTED subject
  const { data: subjectResponse, isLoading: isLoadingSubject } = useQuery({
    queryKey: ["subject", effectiveSubjectId],
    queryFn: async () => {
      if (!effectiveSubjectId) return null;
      const response = await getSubjectById(effectiveSubjectId);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch subject");
      }
      return response.data;
    },
    enabled: !!effectiveSubjectId,
  });

  const subject = subjectResponse;

  const { data: studyPlans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["studyPlans", effectiveSubjectId],
    queryFn: () => fetchStudyPlans(effectiveSubjectId!),
    enabled: !!effectiveSubjectId,
  });

  const { data: latestAttempt, isLoading: isLoadingAttempt } = useQuery({
    queryKey: ["latestQuizAttempt", effectiveSubjectId],
    queryFn: () => getCompletedQuizAttemptsForSubject(effectiveSubjectId!),
    enabled: !!effectiveSubjectId,
  });

  const generatePlanMutation = useGenerateStudyPlan();
  const activePlan = studyPlans?.[0];

  const handleGeneratePlan = (settings: { availableHoursPerWeek: number }) => {
    if (!subject || !latestAttempt?.latestAttempt) return;

    generatePlanMutation.mutate(
      {
        subjectId: subject.id,
        subjectName: subject.name,
        testDate: subject.test_date,
        availableHoursPerWeek: settings.availableHoursPerWeek,
        currentPassChance: null,
        quizAttemptId: latestAttempt.latestAttempt.id,
      },
      {
        onSuccess: () => {
          setIsGenerateModalOpen(false);
        },
      }
    );
  };

  if (
    isLoadingAllSubjects ||
    (effectiveSubjectId && isLoadingSubject) ||
    (effectiveSubjectId && isLoadingPlans) ||
    (effectiveSubjectId && isLoadingAttempt)
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Case: No subjects at all
  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white/50">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          No Subjects Found
        </h2>
        <p className="text-slate-600 mb-6">
          Create a subject to start building your study plan.
        </p>
        <button
          onClick={() => navigate("/subjects")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Subjects
        </button>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="p-8 text-center text-slate-500">Subject not found</div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white/50">
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 py-4 lg:px-8 lg:py-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                My Study Plan
              </h1>
              <p className="text-sm text-slate-600">
                Managed growth for your subjects
              </p>
            </div>

            <div className="w-full md:w-72">
              <Select value={subject.id} onValueChange={handleSubjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-600" />
                        <span>{sub.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {activePlan ? (
          <>
            <StudyPlanDashboard
              studyPlan={activePlan}
              subjectName={subject.name}
              onGenerateNewPlan={() => setIsGenerateModalOpen(true)}
            />

            {/* Regenerate Plan Button */}
            <div className="max-w-4xl mx-auto px-4 pb-8">
              <div className="flex justify-center">
                <Button
                  onClick={() => setIsGenerateModalOpen(true)}
                  variant="outline"
                  size="lg"
                  disabled={generatePlanMutation.isPending}
                  className="border-2 border-green-500 text-green-700 hover:bg-green-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Study Plan
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-8">
            <NoStudyPlanState
              subjectName={subject.name}
              onGeneratePlan={() => setIsGenerateModalOpen(true)}
              isGenerating={generatePlanMutation.isPending}
            />
          </div>
        )}
      </div>

      <GenerateStudyPlanModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleGeneratePlan}
        subjectName={subject.name}
        testDate={subject.test_date || null}
        isGenerating={generatePlanMutation.isPending}
      />
    </div>
  );
};
