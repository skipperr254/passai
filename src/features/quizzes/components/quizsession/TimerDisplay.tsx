import React from "react";
import { Clock } from "lucide-react";

interface TimerDisplayProps {
  timeLeft: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft }) => {
  const getTimeColor = () => {
    if (timeLeft > 60) return "text-[#6A994E] bg-[#6A994E]/10";
    if (timeLeft > 30) return "text-[#F2A541] bg-[#F2A541]/10";
    return "text-red-600 bg-red-50 animate-pulse";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTimeColor()} border-2 border-current`}
    >
      <Clock className="w-4 h-4" />
      <span className="text-sm font-bold">{formatTime(timeLeft)}</span>
    </div>
  );
};
