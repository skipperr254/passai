import React from "react";
import { Sprout, Calendar, Clock } from "lucide-react";
import type { StudyPlan } from "../types";
import { GardenTopicCard } from "./GardenTopicCard";
import { PlanCompletionCelebration } from "./PlanCompletionCelebration";
import { updateTaskCompletion } from "../services/studyPlanService";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface StudyPlanDashboardProps {
  studyPlan: StudyPlan;
  subjectName: string;
  onGenerateNewPlan: () => void;
}

export const StudyPlanDashboard: React.FC<StudyPlanDashboardProps> = ({
  studyPlan,
  subjectName,
  onGenerateNewPlan,
}) => {
  const queryClient = useQueryClient();

  const { mutate: toggleTask, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      taskId,
      isCompleted,
    }: {
      taskId: string;
      isCompleted: boolean;
    }) => {
      await updateTaskCompletion(taskId, isCompleted);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["studyPlans", studyPlan.subject_id],
      });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const handleTaskToggle = (taskId: string, isCompleted: boolean) => {
    toggleTask({ taskId, isCompleted });
  };

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(studyPlan.end_date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  // Calculate garden health (overall progress)
  const totalTasks = studyPlan.topics.reduce(
    (acc, topic) => acc + topic.total_tasks,
    0
  );
  const completedTasks = studyPlan.topics.reduce(
    (acc, topic) => acc + topic.completed_tasks,
    0
  );
  const gardenHealth =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Garden Header */}
      <div className="bg-linear-to-br from-green-50 to-blue-50 rounded-2xl p-6 lg:p-8 border border-green-100 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl animate-bounce-slow">🌱</span>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Your Learning Garden
              </h1>
            </div>
            <p className="text-slate-600 max-w-xl leading-relaxed">
              {studyPlan.description ||
                "Welcome to your personalized study garden. Water your seedlings by completing tasks and watch your knowledge grow!"}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            {/* Garden Health Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 min-w-[140px]">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Sprout className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Health
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {gardenHealth}%
                </span>
                <div className="flex h-2 w-16 bg-slate-100 rounded-full mb-1.5 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${gardenHealth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Days Remaining Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 min-w-[140px]">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Time Left
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-slate-900">
                  {daysRemaining}
                </span>
                <span className="text-sm font-medium text-slate-500 mb-1">
                  days
                </span>
              </div>
            </div>

            {/* Total Hours Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 min-w-[140px]">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Est. Time
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-slate-900">
                  {studyPlan.total_hours}
                </span>
                <span className="text-sm font-medium text-slate-500 mb-1">
                  hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs">
          {studyPlan.topics.length}
        </span>
        Garden Beds (Topics)
      </h2>

      <div className="space-y-4">
        {studyPlan.topics.map((topic) => (
          <GardenTopicCard
            key={topic.id}
            topic={topic}
            onTaskToggle={handleTaskToggle}
            isTaskUpdating={isUpdating}
          />
        ))}
      </div>

      {gardenHealth === 100 && (
        <PlanCompletionCelebration
          subjectId={studyPlan.subject_id}
          subjectName={subjectName}
          gardenHealth={gardenHealth}
          onGenerateNewPlan={onGenerateNewPlan}
        />
      )}
    </div>
  );
};
