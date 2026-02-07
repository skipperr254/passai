import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Video,
  AlignLeft,
  Book,
  FileCheck,
} from "lucide-react";

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "text-[#6A994E] bg-[#6A994E]/10 border-[#6A994E]/20";
    case "medium":
      return "text-[#F2A541] bg-[#F2A541]/10 border-[#F2A541]/20";
    case "hard":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-[#2D3436]/70 bg-[#FAF3E0] border-[#E8E4E1]";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-[#6A994E] bg-[#6A994E]/10";
    case "in-progress":
      return "text-[#0D7377] bg-[#0D7377]/10";
    case "not-started":
      return "text-[#2D3436]/70 bg-[#FAF3E0]";
    default:
      return "text-[#2D3436]/70 bg-[#FAF3E0]";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return CheckCircle2;
    case "in-progress":
      return Clock;
    case "not-started":
      return AlertCircle;
    default:
      return AlertCircle;
  }
};

export const getScoreColor = (score: number) => {
  if (score >= 90) return "text-[#6A994E]";
  if (score >= 75) return "text-[#6A994E]";
  if (score >= 60) return "text-[#F2A541]";
  return "text-red-600";
};

// Previous functions...

export const getMaterialIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return FileText;
    case "video":
      return Video;
    case "notes":
      return AlignLeft;
    case "textbook":
      return Book;
    case "slides":
      return FileCheck;
    default:
      return FileText;
  }
};

export const getMaterialColor = (type: string) => {
  switch (type) {
    case "pdf":
      return "from-[#E07A5F] to-[#D4A373]";
    case "video":
      return "from-[#0D7377] to-[#4A7C59]";
    case "notes":
      return "from-[#4A7C59] to-[#0D7377]";
    case "textbook":
      return "from-[#6A994E] to-[#4A7C59]";
    case "slides":
      return "from-[#F2A541] to-[#E07A5F]";
    default:
      return "from-[#6B7280] to-[#2D3436]/70";
  }
};

export function calculateTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 0) return "just now";

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return count === 1
        ? `${count} ${interval.label} ago`
        : `${count} ${interval.label}s ago`;
    }
  }

  return "just now";
}
