import React from "react";
import { TrendingUp, Award } from "lucide-react";
import type { QuizAttempt } from "../../types/quiz";

interface ScoreProgressionChartProps {
  attempts: QuizAttempt[];
  bestScore: number;
}

export const ScoreProgressionChart: React.FC<ScoreProgressionChartProps> = ({
  attempts,
  bestScore,
}) => {
  if (attempts.length === 0) return null;

  return (
    <section className="bg-white rounded-xl lg:rounded-2xl border border-[#E8E4E1] p-5 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-[#2D3436] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0D7377]" />
            Score Progression
          </h2>
          <p className="text-sm text-[#2D3436]/70 mt-1">
            Your performance over time
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
          <Award className="w-4 h-4 text-[#6A994E]" />
          <div>
            <p className="text-xs text-[#2D3436]/70 font-medium leading-none">
              Best
            </p>
            <p className="text-lg font-bold text-[#6A994E] leading-tight">
              {bestScore}%
            </p>
          </div>
        </div>
      </div>
      <div className="relative h-48 lg:h-56">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="scoreGradientDetail"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="rgb(13, 115, 119)"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="rgb(13, 115, 119)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((val) => (
            <line
              key={val}
              x1="0"
              y1={200 - val * 2}
              x2="800"
              y2={200 - val * 2}
              stroke="rgb(226, 232, 240)"
              strokeWidth="1"
              strokeDasharray="4"
            />
          ))}
          {attempts.length > 1 && (
            <>
              <path
                d={`M 0,${
                  200 - attempts[attempts.length - 1].score * 2
                } ${attempts
                  .slice()
                  .reverse()
                  .map(
                    (a, i) =>
                      `L ${(i * 800) / (attempts.length - 1)},${
                        200 - a.score * 2
                      }`
                  )
                  .join(" ")} L 800,200 L 0,200 Z`}
                fill="url(#scoreGradientDetail)"
              />
              <path
                d={`M 0,${
                  200 - attempts[attempts.length - 1].score * 2
                } ${attempts
                  .slice()
                  .reverse()
                  .map(
                    (a, i) =>
                      `L ${(i * 800) / (attempts.length - 1)},${
                        200 - a.score * 2
                      }`
                  )
                  .join(" ")}`}
                fill="none"
                stroke="rgb(13, 115, 119)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {attempts
                .slice()
                .reverse()
                .map((a, i) => (
                  <g key={i}>
                    <circle
                      cx={(i * 800) / (attempts.length - 1)}
                      cy={200 - a.score * 2}
                      r="6"
                      fill="white"
                      stroke="rgb(13, 115, 119)"
                      strokeWidth="3"
                    />
                    <title>{`Attempt ${a.attempt_number}: ${a.score}%`}</title>
                  </g>
                ))}
            </>
          )}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs font-medium text-[#6B7280]">
          {attempts
            .slice()
            .reverse()
            .map((a, i) => (
              <span key={i}>#{a.attempt_number}</span>
            ))}
        </div>
      </div>
    </section>
  );
};
