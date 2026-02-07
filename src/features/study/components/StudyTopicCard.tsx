import React from "react";
import {
  ChevronDown,
  Clock,
  CheckCircle2,
  Circle,
  X,
  Book,
  Video,
  FileText,
  PenTool,
  Target,
} from "lucide-react";
import type { StudyPlanTopic, StudyPlanTask } from "../types";
import { formatTime } from "../utils/mockData";

interface StudyTopicCardProps {
  topic: StudyPlanTopic;
  isExpanded: boolean;
  onToggle: () => void;
  onTaskToggle: (taskId: string) => void;
}

const TaskTypeIcon: React.FC<{ type: StudyPlanTask["task_type"] }> = ({
  type,
}) => {
  const iconClass = "w-4 h-4";
  switch (type) {
    case "review":
      return <Book className={iconClass} />;
    case "video":
      return <Video className={iconClass} />;
    case "reading":
      return <FileText className={iconClass} />;
    case "exercise":
      return <PenTool className={iconClass} />;
    case "practice":
      return <Target className={iconClass} />;
    default:
      return <Book className={iconClass} />;
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "high":
      return "text-[#4A7C59] bg-[#6A994E]/5 border-[#6A994E]/20";
    case "medium":
      return "text-[#4A7C59] bg-[#6A994E]/5 border-[#6A994E]/20";
    case "low":
      return "text-teal-700 bg-teal-50 border-teal-200";
    default:
      return "text-[#2D3436]/70 bg-[#FAF3E0] border-[#E8E4E1]";
  }
};

const getPriorityLabel = (priority: string): string => {
  switch (priority) {
    case "high":
      return "🌱 Needs water";
    case "medium":
      return "🌿 Growing";
    case "low":
      return "🌻 Blooming";
    default:
      return priority;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "border-[#6A994E]/30 bg-[#6A994E]/5";
    case "in-progress":
      return "border-[#0D7377]/30 bg-[#0D7377]/5";
    case "not-started":
      return "border-[#E8E4E1] bg-white";
    default:
      return "border-[#E8E4E1] bg-white";
  }
};

export const StudyTopicCard: React.FC<StudyTopicCardProps> = ({
  topic,
  isExpanded,
  onToggle,
  onTaskToggle,
}) => {
  const completionPercentage =
    topic.total_tasks > 0
      ? Math.round((topic.completed_tasks / topic.total_tasks) * 100)
      : 0;

  return (
    <>
      {/* Collapsed Card */}
      <div
        className={`rounded-xl border-2 ${getStatusColor(
          topic.status
        )} shadow-sm hover:shadow-md transition-all cursor-pointer`}
        onClick={onToggle}
      >
        <div className="p-4 lg:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Title and Priority Badge */}
              <div className="flex items-start gap-2 mb-2">
                <h3 className="text-base lg:text-lg font-semibold text-[#2D3436] flex-1">
                  {topic.title}
                </h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-md border ${getPriorityColor(
                    topic.priority
                  )} whitespace-nowrap`}
                >
                  {getPriorityLabel(topic.priority)}
                </span>
              </div>

              {/* Description */}
              {topic.description && (
                <p className="text-sm text-[#2D3436]/70 mb-3 line-clamp-2">
                  {topic.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm text-[#2D3436]/70">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {topic.completed_tasks} / {topic.total_tasks} tasks
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(topic.total_time_minutes)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full h-2 bg-[#E8E4E1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0D7377] rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Expand Icon */}
            <div className="shrink-0 mt-1">
              <ChevronDown
                className={`w-5 h-5 text-[#2D3436]/50 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onToggle}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 lg:p-6 border-b border-[#E8E4E1]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl lg:text-2xl font-bold text-[#2D3436]">
                      {topic.title}
                    </h2>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-md border ${getPriorityColor(
                        topic.priority
                      )}`}
                    >
                      {getPriorityLabel(topic.priority)}
                    </span>
                  </div>
                  {topic.description && (
                    <p className="text-sm text-[#2D3436]/70">
                      {topic.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm text-[#2D3436]/70 mt-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {topic.completed_tasks} / {topic.total_tasks} completed
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(topic.total_time_minutes)} total</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onToggle}
                  className="shrink-0 p-2 hover:bg-[#FAF3E0] rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-[#2D3436]/70" />
                </button>
              </div>

              {/* Progress Bar in Modal */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#2D3436]/80">
                    Progress
                  </span>
                  <span className="text-sm font-bold text-[#2D3436]">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="w-full h-3 bg-[#E8E4E1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0D7377] rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Body - Task List */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <h3 className="text-sm font-semibold text-[#2D3436]/80 mb-3">
                Tasks ({topic.tasks.length})
              </h3>
              <div className="space-y-2">
                {topic.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group border rounded-lg p-3 lg:p-4 transition-all ${
                      task.is_completed
                        ? "bg-[#6A994E]/5 border-[#6A994E]/20"
                        : "bg-white border-[#E8E4E1] hover:border-[#0D7377]/30 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => onTaskToggle(task.id)}
                        className="shrink-0 mt-0.5"
                        aria-label={
                          task.is_completed
                            ? "Mark incomplete"
                            : "Mark complete"
                        }
                      >
                        {task.is_completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#4A7C59]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#2D3436]/50 group-hover:text-[#0D7377] transition-colors" />
                        )}
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h4
                            className={`text-sm lg:text-base font-medium flex-1 ${
                              task.is_completed
                                ? "text-[#2D3436]/70 line-through"
                                : "text-[#2D3436]"
                            }`}
                          >
                            {task.title}
                          </h4>
                        </div>

                        {task.description && (
                          <p
                            className={`text-sm mb-2 ${
                              task.is_completed
                                ? "text-[#2D3436]/60"
                                : "text-[#2D3436]/70"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Task Type Badge */}
                          <div className="flex items-center gap-1 px-2 py-1 bg-[#FAF3E0] rounded-md">
                            <TaskTypeIcon type={task.task_type} />
                            <span className="text-xs font-medium text-[#2D3436]/80 capitalize">
                              {task.task_type}
                            </span>
                          </div>

                          {/* Time Estimate */}
                          <div className="flex items-center gap-1 text-xs text-[#2D3436]/70">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {formatTime(task.estimated_time_minutes)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 lg:p-6 border-t border-[#E8E4E1] bg-[#FAF3E0]">
              <button
                onClick={onToggle}
                className="w-full py-3 bg-[#0D7377] hover:bg-[#0D7377]/90 text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
