import React from "react";
import { ChevronRight } from "lucide-react";
import type { MaterialWithSubject } from "../../types/quiz";
import { getMaterialIcon } from "../../utils/quizUtils";
import { calculateTimeAgo } from "../../utils/quizUtils";

interface MaterialCardProps {
  material: MaterialWithSubject;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const Icon = getMaterialIcon(material.file_type);
  const timeAgo = calculateTimeAgo(material.created_at);

  return (
    <div className="flex items-center gap-3 p-3 bg-[#FAF3E0] hover:bg-[#FAF3E0] rounded-lg transition-colors cursor-pointer border border-[#E8E4E1]">
      <div className="w-10 h-10 rounded-lg bg-[#0D7377]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#0D7377]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#2D3436] truncate">
          {material.file_name}
        </p>
        <p className="text-xs text-[#2D3436]/70">{timeAgo}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#2D3436]/50 shrink-0" />
    </div>
  );
};
