import React, { useState, useEffect } from "react";
import {
  Sprout,
  Leaf,
  Flower2,
  Trophy,
  TrendingUp,
  Droplets,
  Sun,
} from "lucide-react";
import { GardenHeader } from "./GardenHeader";
import { PointsCelebration } from "./PointsCelebration";
import { PlantVisualization } from "./PlantVisualization";
import { LevelProgress } from "./LevelProgress";
import { PlantHealth } from "./PlantHealth";
import { MotivationalFooter } from "./MotivationalFooter";

interface GardenProgressProps {
  subject: string;
  subjectColor: string;
  level: number;
  progress: number; // 0-100
  pointsEarned: number;
  plantHealth: number; // 0-100 (consistency)
  onClose: () => void;
}

export const GardenProgress: React.FC<GardenProgressProps> = (props) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(
    props.progress - props.pointsEarned / 10
  );

  useEffect(() => {
    setTimeout(() => {
      setDisplayProgress(props.progress);
    }, 300);
    setTimeout(() => {
      setShowAnimation(true);
    }, 800);
  }, [props.progress]);

  const getPlantPlant = () => {
    if (props.level <= 1)
      return { icon: Sprout, label: "Seedling", color: "text-[#6A994E]" };
    if (props.level <= 3)
      return { icon: Leaf, label: "Young Plant", color: "text-[#6A994E]" };
    if (props.level <= 5)
      return { icon: Flower2, label: "Flowering", color: "text-pink-600" };
    return { icon: Trophy, label: "Thriving", color: "text-[#F2A541]" };
  };

  const plantStage = getPlantPlant();
  const leveledUp = props.progress >= 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4"
      onClick={props.onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <GardenHeader
          subjectColor={props.subjectColor}
          subject={props.subject}
          onClose={props.onClose}
        />
        <div className="px-6 lg:px-8 py-8 space-y-6">
          <PointsCelebration
            showAnimation={showAnimation}
            pointsEarned={props.pointsEarned}
          />
          <PlantVisualization
            plantIcon={plantStage.icon}
            plantColor={plantStage.color}
            showAnimation={showAnimation}
          />
          <LevelProgress
            subjectColor={props.subjectColor}
            level={props.level}
            displayProgress={displayProgress}
            leveledUp={leveledUp}
          />
          <PlantHealth plantHealth={props.plantHealth} />
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-linear-to-br from-[#5FA8D3]/10 to-[#0D7377]/10 border-2 border-[#5FA8D3]/20 rounded-xl p-4 text-center">
              <Droplets className="w-6 h-6 text-[#0D7377] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#2D3436]/70 mb-1">
                Watering
              </p>
              <p className="text-lg font-bold text-[#2D3436]">Daily</p>
            </div>
            <div className="bg-linear-to-br from-[#F2A541]/10 to-[#E07A5F]/10 border-2 border-[#F2A541]/20 rounded-xl p-4 text-center">
              <Sun className="w-6 h-6 text-[#F2A541] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#2D3436]/70 mb-1">
                Sunlight
              </p>
              <p className="text-lg font-bold text-[#2D3436]">Full</p>
            </div>
            <div className="bg-linear-to-br from-[#8CB369]/10 to-[#6A994E]/10 border-2 border-[#8CB369]/20 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-[#6A994E] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#2D3436]/70 mb-1">
                Growth
              </p>
              <p className="text-lg font-bold text-[#2D3436]">Strong</p>
            </div>
          </div>
          <MotivationalFooter />
          <button
            onClick={props.onClose}
            className="w-full px-6 py-4 bg-[#FAF3E0] hover:bg-[#E8E4E1] text-[#2D3436]/80 font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
