import React, { useState } from "react";
import { ChevronDown, ChevronUp, Droplets, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { GardenTaskItem } from "./GardenTaskItem";

interface TopicTask {
  id: string;
  title: string;
  description: string | null;
  task_type: "review" | "practice" | "reading" | "exercise" | "video";
  estimated_time_minutes: number;
  is_completed: boolean;
}

interface GardenTopicCardProps {
  topic: {
    id: string;
    title: string;
    description: string | null;
    priority: "high" | "medium" | "low";
    mastery_level: number | null;
    recommendations?: string[];
    tasks: TopicTask[];
  };
  onTaskToggle: (taskId: string, isCompleted: boolean) => void;
  isTaskUpdating?: boolean;
}

const getGardenStage = (masteryLevel: number | null) => {
  const level = masteryLevel || 0;
  if (level < 40) return { emoji: "🌱", label: "Seedling", color: "text-green-600" };
  if (level < 60) return { emoji: "🌿", label: "Growing", color: "text-emerald-600" };
  if (level < 75) return { emoji: "🌻", label: "Blooming", color: "text-amber-600" };
  return { emoji: "🌳", label: "Thriving", color: "text-green-700" };
};

const getPriorityStyles = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "border-l-4 border-l-orange-400 bg-orange-50/30";
    case "medium":
      return "border-l-4 border-l-blue-400 bg-blue-50/30";
    case "low":
    default:
      return "border-l-4 border-l-green-400 bg-green-50/30";
  }
};

export const GardenTopicCard: React.FC<GardenTopicCardProps> = ({
  topic,
  onTaskToggle,
  isTaskUpdating = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(topic.priority === "high");
  const stage = getGardenStage(topic.mastery_level);
  
  const completedTasks = topic.tasks.filter((t) => t.is_completed).length;
  const totalTasks = topic.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-xs mb-4 overflow-hidden transition-all duration-300",
        getPriorityStyles(topic.priority)
      )}
    >
      <div 
        className="p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 flex flex-col items-center">
            <span className="text-3xl mb-1 filter drop-shadow-sm">{stage.emoji}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {stage.label}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-slate-900 truncate pr-2">
                {topic.title}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-slate-600 bg-white/50 px-2 py-1 rounded-full border border-slate-100">
                  {completedTasks}/{totalTasks} tasks
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {topic.description}
            </p>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  progress === 100 ? "bg-green-500" : "bg-blue-500"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-white/50 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Droplets className="w-3 h-3 text-blue-500" />
            <span>Water your garden with these tasks</span>
          </div>
          
          <div className="space-y-3">
            {topic.tasks.map((task) => (
              <GardenTaskItem
                key={task.id}
                task={task}
                onToggle={onTaskToggle}
                isLoading={isTaskUpdating}
              />
            ))}
          </div>

          {progress === 100 && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-3 text-sm">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="font-medium">
                Great job! You've watered this seedling completely. 
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
