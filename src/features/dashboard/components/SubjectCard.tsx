import type {
  Subject,
  SubjectColor,
} from "@/features/subjects/types/subject.types";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  BookOpen,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
}

// Status configuration for different pass chance levels
type StatusConfig = {
  icon: React.ElementType;
  label: string;
  colorClass: string;
};

function getSubjectStatus(subject: Subject): StatusConfig {
  const passChance = subject.pass_chance ?? 0;
  const testDate = subject.test_date ? new Date(subject.test_date) : null;
  const lastStudied = subject.last_studied_at
    ? new Date(subject.last_studied_at)
    : null;
  const now = new Date();

  // Calculate days until test
  const daysUntilTest = testDate
    ? Math.ceil((testDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate days since last studied
  const daysSinceStudied = lastStudied
    ? Math.floor(
        (now.getTime() - lastStudied.getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  // Critical: Test is very soon and pass chance is low
  if (daysUntilTest !== null && daysUntilTest <= 3 && passChance < 60) {
    return {
      icon: AlertTriangle,
      label: "Needs Attention",
      colorClass: "text-[#E07A5F] dark:text-[#E07A5F]",
    };
  }

  // Warning: Haven't studied in a while
  if (daysSinceStudied !== null && daysSinceStudied > 7) {
    return {
      icon: Clock,
      label: "Review Needed",
      colorClass: "text-[#F2A541] dark:text-[#F2A541]",
    };
  }

  // Status based on pass chance
  if (passChance >= 80) {
    return {
      icon: TrendingUp,
      label: "Excellent",
      colorClass: "text-[#6A994E] dark:text-[#8CB369]",
    };
  }

  if (passChance >= 60) {
    return {
      icon: TrendingUp,
      label: "On Track",
      colorClass: "text-[#6A994E] dark:text-[#8CB369]",
    };
  }

  if (passChance >= 40) {
    return {
      icon: Minus,
      label: "Keep Going",
      colorClass: "text-[#E9C46A] dark:text-[#E9C46A]",
    };
  }

  if (passChance > 0) {
    return {
      icon: TrendingDown,
      label: "Needs Work",
      colorClass: "text-[#E07A5F] dark:text-[#E07A5F]",
    };
  }

  // No data yet
  return {
    icon: BookOpen,
    label: "Get Started",
    colorClass: "text-[#6B7280] dark:text-[#9CA3AF]",
  };
}

const COLOR_VARIANTS: Record<
  SubjectColor,
  { bg: string; text: string; gradient: string; stopColor: string }
> = {
  blue: {
    bg: "bg-[#0D7377]/10 dark:bg-[#0D7377]/20",
    text: "text-[#0D7377] dark:text-[#2EC4B6]",
    gradient: "from-[#0D7377] to-[#0D7377]/70",
    stopColor: "#0D7377",
  },
  green: {
    bg: "bg-[#6A994E]/10 dark:bg-[#6A994E]/20",
    text: "text-[#6A994E] dark:text-[#8CB369]",
    gradient: "from-[#6A994E] to-[#8CB369]",
    stopColor: "#6A994E",
  },
  purple: {
    bg: "bg-[#0D7377]/10 dark:bg-[#0D7377]/20",
    text: "text-[#0D7377] dark:text-[#2EC4B6]",
    gradient: "from-[#0D7377] to-[#4A7C59]",
    stopColor: "#0D7377",
  },
  red: {
    bg: "bg-[#E07A5F]/10 dark:bg-[#E07A5F]/20",
    text: "text-[#E07A5F] dark:text-[#E07A5F]",
    gradient: "from-[#E07A5F] to-[#D4A373]",
    stopColor: "#E07A5F",
  },
  amber: {
    bg: "bg-[#F2A541]/10 dark:bg-[#F2A541]/20",
    text: "text-[#F2A541] dark:text-[#F2A541]",
    gradient: "from-[#F2A541] to-[#E9C46A]",
    stopColor: "#F2A541",
  },
  pink: {
    bg: "bg-[#E07A5F]/10 dark:bg-[#E07A5F]/20",
    text: "text-[#E07A5F] dark:text-[#E07A5F]",
    gradient: "from-[#E07A5F] to-[#E07A5F]/70",
    stopColor: "#E07A5F",
  },
  cyan: {
    bg: "bg-[#5FA8D3]/10 dark:bg-[#5FA8D3]/20",
    text: "text-[#5FA8D3] dark:text-[#5FA8D3]",
    gradient: "from-[#5FA8D3] to-[#0D7377]",
    stopColor: "#5FA8D3",
  },
  indigo: {
    bg: "bg-[#4A7C59]/10 dark:bg-[#4A7C59]/20",
    text: "text-[#4A7C59] dark:text-[#8CB369]",
    gradient: "from-[#4A7C59] to-[#6A994E]",
    stopColor: "#4A7C59",
  },
  emerald: {
    bg: "bg-[#8CB369]/10 dark:bg-[#8CB369]/20",
    text: "text-[#8CB369] dark:text-[#8CB369]",
    gradient: "from-[#8CB369] to-[#6A994E]",
    stopColor: "#8CB369",
  },
  rose: {
    bg: "bg-[#E07A5F]/10 dark:bg-[#E07A5F]/20",
    text: "text-[#E07A5F] dark:text-[#E07A5F]",
    gradient: "from-[#E07A5F] to-[#D4A373]",
    stopColor: "#E07A5F",
  },
  violet: {
    bg: "bg-[#0D7377]/10 dark:bg-[#0D7377]/20",
    text: "text-[#0D7377] dark:text-[#2EC4B6]",
    gradient: "from-[#0D7377] to-[#4A7C59]",
    stopColor: "#0D7377",
  },
  teal: {
    bg: "bg-[#0D7377]/10 dark:bg-[#0D7377]/20",
    text: "text-[#0D7377] dark:text-[#2EC4B6]",
    gradient: "from-[#0D7377] to-[#0D7377]/70",
    stopColor: "#0D7377",
  },
  orange: {
    bg: "bg-[#E07A5F]/10 dark:bg-[#E07A5F]/20",
    text: "text-[#E07A5F] dark:text-[#E07A5F]",
    gradient: "from-[#E07A5F] to-[#F2A541]",
    stopColor: "#E07A5F",
  },
  lime: {
    bg: "bg-[#8CB369]/10 dark:bg-[#8CB369]/20",
    text: "text-[#8CB369] dark:text-[#8CB369]",
    gradient: "from-[#8CB369] to-[#6A994E]",
    stopColor: "#8CB369",
  },
  fuchsia: {
    bg: "bg-[#E07A5F]/10 dark:bg-[#E07A5F]/20",
    text: "text-[#E07A5F] dark:text-[#E07A5F]",
    gradient: "from-[#E07A5F] to-[#D4A373]",
    stopColor: "#E07A5F",
  },
};

export const SubjectCard = ({ subject }: SubjectCardProps) => {
  const passChance = subject.pass_chance || 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (passChance / 100) * circumference;

  // Get color styles or fallback to blue
  const colorStyles = COLOR_VARIANTS[subject.color] || COLOR_VARIANTS.blue;

  // Get dynamic status based on performance
  const status = getSubjectStatus(subject);
  const StatusIcon = status.icon;

  return (
    <Card className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 border-2 border-transparent hover:border-primary/20 group relative overflow-hidden">
      <div className="flex items-start justify-between mb-4 relative z-10 gap-3">
        <div className="flex-1 min-w-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="text-xl font-bold text-[#2D3436] dark:text-white mb-1 truncate cursor-default">
                  {subject.name}
                </h3>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{subject.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] truncate">
            {subject.exam_board || "General"}
          </p>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
            colorStyles.bg
          )}
        >
          <BookOpen className={cn("w-5 h-5", colorStyles.text)} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4 relative z-10">
        <div className="relative w-40 h-40">
          {/* Background Circle */}
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 140 140"
          >
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-[#E8E4E1] dark:text-[#2D3436]"
            />
            {/* Progress Circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={`url(#gradient-${subject.id})`}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient
                id={`gradient-${subject.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={colorStyles.stopColor}
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor={colorStyles.stopColor}
                  stopOpacity="0.6"
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Percentage Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn(
                "text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r",
                colorStyles.gradient
              )}
            >
              {passChance}%
            </span>
            <span className="text-xs text-[#6B7280] font-medium uppercase tracking-wide mt-1">
              Pass Chance
            </span>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-[#E8E4E1] dark:border-[#2D3436] flex items-center justify-between text-sm relative z-10">
        <div className={cn("flex items-center gap-1.5", status.colorClass)}>
          <StatusIcon className="w-4 h-4" />
          <span className="font-medium">{status.label}</span>
        </div>
        {subject.test_date && (
          <div className="flex items-center gap-1.5 text-[#6B7280]">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(subject.test_date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div
        className={cn(
          "absolute -bottom-20 -right-20 w-40 h-40 bg-linear-to-br rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-500",
          colorStyles.gradient
        )}
      />
    </Card>
  );
};
