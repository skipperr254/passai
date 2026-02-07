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
      return "text-[#0D7377] bg-[#0D7377]/5";
    case "video":
      return "text-red-600 bg-red-50";
    case "practice":
      return "text-[#4A7C59] bg-[#6A994E]/5";
    case "exercise":
      return "text-amber-600 bg-amber-50";
    case "review":
    default:
      return "text-[#0D7377] bg-[#0D7377]/5";
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
          ? "bg-[#FAF3E0] border-[#E8E4E1]"
          : "bg-white border-[#E8E4E1] hover:border-[#0D7377]/30 hover:shadow-sm"
      )}
    >
      <button
        onClick={() => onToggle(task.id, !task.is_completed)}
        disabled={isLoading}
        className={cn(
          "shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors disabled:opacity-50",
          task.is_completed
            ? "bg-[#6A994E] border-[#6A994E] text-white"
            : "bg-white border-[#E8E4E1] text-transparent hover:border-[#6A994E]"
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
                ? "text-[#2D3436]/60 line-through"
                : "text-[#2D3436]"
            )}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#2D3436]/60 font-medium">
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
            task.is_completed ? "text-[#2D3436]/50" : "text-[#2D3436]/70"
          )}
        >
          {task.description}
        </p>

        {/* Material reference - show if fileName exists */}
        {task.fileName && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <FileText className="w-3.5 h-3.5 text-[#0D7377]/50" />
            <span className="font-medium text-[#0D7377]">{task.fileName}</span>
            {task.section && (
              <>
                <span className="text-[#2D3436]/50">•</span>
                <span className="text-[#2D3436]/60 italic">{task.section}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
