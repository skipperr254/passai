import React from "react";
import { HelpCircle, RotateCcw } from "lucide-react";
import { useOnboarding } from "../hooks/useOnboarding";

export const RestartTourButton: React.FC<{ variant?: "full" | "icon" }> = ({
  variant = "full",
}) => {
  const { resetOnboarding } = useOnboarding();

  if (variant === "icon") {
    return (
      <button
        onClick={resetOnboarding}
        className="p-2 rounded-lg hover:bg-[#FAF3E0] transition-colors"
        title="Restart Tour"
      >
        <HelpCircle className="w-5 h-5 text-[#2D3436]/70" />
      </button>
    );
  }

  return (
    <button
      onClick={resetOnboarding}
      className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#0D7377] text-[#0D7377] font-semibold rounded-xl hover:bg-[#0D7377]/5 transition-colors"
    >
      <RotateCcw className="w-4 h-4" />
      <span>Restart Tour</span>
    </button>
  );
};
