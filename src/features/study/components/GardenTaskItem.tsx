import React from "react";
import {
  Check,
  BookOpen,
  PenTool,
  Youtube,
  Brain,
  Dumbbell,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GardenTaskItemProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    task_type: "review" | "practice" | "reading" | "exercise" | "video";
    estimated_time_minutes: number;
    is_completed: boolean;
    fileName?: string;
    section?: string;
  };
  onToggle: (taskId: string, isCompleted: boolean) => void;
  isLoading?: boolean;
}

const getTaskIcon = (type: string) => {
  switch (type) {
    case "reading":
      return <BookOpen className="w-4 h-4" />;
    case "video":
      return <Youtube className="w-4 h-4" />;
    case "practice":
      return <Dumbbell className="w-4 h-4" />;
    case "exercise":
      return <PenTool className="w-4 h-4" />;
    case "review":
    default:
      return <Brain className="w-4 h-4" />;
  }
};

const getTaskTypeColor = (type: string) => {
  switch (type) {
    case "reading":
      return "text-blue-600 bg-blue-50";
    case "video":
      return "text-red-600 bg-red-50";
    case "practice":
      return "text-green-600 bg-green-50";
    case "exercise":
      return "text-amber-600 bg-amber-50";
    case "review":
    default:
      return "text-purple-600 bg-purple-50";
  }
};

export const GardenTaskItem: React.FC<GardenTaskItemProps> = ({
  task,
  onToggle,
  isLoading = false,
}) => {
  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
        task.is_completed
          ? "bg-slate-50 border-slate-200"
          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"
      )}
    >
      <button
        onClick={() => onToggle(task.id, !task.is_completed)}
        disabled={isLoading}
        className={cn(
          "shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors disabled:opacity-50",
          task.is_completed
            ? "bg-green-500 border-green-500 text-white"
            : "bg-white border-slate-300 text-transparent hover:border-green-500"
        )}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p
            className={cn(
              "text-sm font-medium transition-colors",
              task.is_completed
                ? "text-slate-500 line-through"
                : "text-slate-900"
            )}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium">
              {task.estimated_time_minutes}m
            </span>
            <div
              className={cn("p-1 rounded-md", getTaskTypeColor(task.task_type))}
              title={task.task_type}
            >
              {getTaskIcon(task.task_type)}
            </div>
          </div>
        </div>
        <p
          className={cn(
            "text-xs leading-relaxed",
            task.is_completed ? "text-slate-400" : "text-slate-600"
          )}
        >
          {task.description}
        </p>

        {/* Material reference - show if fileName exists */}
        {task.fileName && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-medium text-blue-600">{task.fileName}</span>
            {task.section && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 italic">{task.section}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
