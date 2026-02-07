import React from "react";

interface ScoreCardProps {
  score: number;
  scoreMsg: { title: string; message: string };
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, scoreMsg }) => {
  const getScoreColor = () => {
    if (score >= 90) return "from-[#6A994E] to-[#4A7C59]";
    if (score >= 75) return "from-[#8CB369] to-[#6A994E]";
    if (score >= 60) return "from-[#F2A541] to-[#E07A5F]";
    return "from-[#E07A5F] to-[#D4A373]";
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E8E4E1] shadow-lg overflow-hidden">
      <div className={`p-6 lg:p-8 bg-linear-to-br ${getScoreColor()}`}>
        <div className="text-center text-white">
          <p className="text-sm lg:text-base font-semibold mb-2 text-white/90">
            Your Score
          </p>
          <p className="text-6xl lg:text-7xl font-bold mb-3">{score}%</p>
          <p className="text-xl lg:text-2xl font-bold mb-1">{scoreMsg.title}</p>
          <p className="text-sm lg:text-base text-white/90">
            {scoreMsg.message}
          </p>
        </div>
      </div>
    </div>
  );
};
