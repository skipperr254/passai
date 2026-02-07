/**
 * Logo Component
 * Reusable PassAI logo with optional loading animation
 */

import React from "react";

interface LogoProps {
  /** Size in pixels (affects both width and height) */
  size?: number;
  /** Whether to show pulse/loading animation */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show full branding with text */
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 48,
  animate = false,
  className = "",
  showText = false,
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${animate ? "animate-pulse" : ""}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient
              id="mainGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#0D7377", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#4A7C59", stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="accentGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#E07A5F", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#F2A541", stopOpacity: 1 }}
              />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Scholar's cap base */}
          <path
            d="M 100 60 L 160 80 L 160 95 L 100 115 L 40 95 L 40 80 Z"
            fill="url(#mainGradient)"
            opacity="0.9"
          />

          {/* Cap top board */}
          <path
            d="M 50 70 L 150 55 L 155 65 L 55 80 Z"
            fill="url(#mainGradient)"
          />

          {/* Neural network nodes */}
          <circle
            cx="100"
            cy="130"
            r="6"
            fill="url(#accentGradient)"
            filter="url(#glow)"
          />
          <circle
            cx="75"
            cy="145"
            r="5"
            fill="url(#accentGradient)"
            filter="url(#glow)"
          />
          <circle
            cx="125"
            cy="145"
            r="5"
            fill="url(#accentGradient)"
            filter="url(#glow)"
          />
          <circle
            cx="85"
            cy="160"
            r="4"
            fill="url(#accentGradient)"
            opacity="0.8"
          />
          <circle
            cx="115"
            cy="160"
            r="4"
            fill="url(#accentGradient)"
            opacity="0.8"
          />

          {/* Connecting lines */}
          <line
            x1="100"
            y1="130"
            x2="75"
            y2="145"
            stroke="url(#accentGradient)"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="100"
            y1="130"
            x2="125"
            y2="145"
            stroke="url(#accentGradient)"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="75"
            y1="145"
            x2="85"
            y2="160"
            stroke="url(#accentGradient)"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <line
            x1="125"
            y1="145"
            x2="115"
            y2="160"
            stroke="url(#accentGradient)"
            strokeWidth="1.5"
            opacity="0.5"
          />

          {/* Spark/insight element */}
          <g transform="translate(145, 50)">
            <path
              d="M 0 0 L 3 8 L -3 5 L -1 12 L -5 8 L 0 0"
              fill="url(#accentGradient)"
              filter="url(#glow)"
            />
          </g>

          {/* Tassel */}
          <line
            x1="155"
            y1="65"
            x2="165"
            y2="90"
            stroke="url(#mainGradient)"
            strokeWidth="2"
          />
          <circle
            cx="165"
            cy="93"
            r="5"
            fill="url(#accentGradient)"
            filter="url(#glow)"
          />
        </svg>

        {/* Optional pulsing glow animation for loading states */}
        {animate && (
          <div className="absolute inset-0 bg-[#0D7377]/20 rounded-full blur-xl animate-pulse" />
        )}
      </div>

      {showText && (
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
            PassAI
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-none">
            Intelligent Study
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Loading Logo Component
 * Logo specifically designed for loading screens with progress indicator
 */
interface LoadingLogoProps {
  /** Size in pixels */
  size?: number;
  /** Optional loading message */
  message?: string;
  /** Optional progress value (0-100) */
  progress?: number;
}

export const LoadingLogo: React.FC<LoadingLogoProps> = ({
  size = 80,
  message = "Loading...",
  progress,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* Animated background rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-full h-full rounded-full border-2 border-[#0D7377]/30 animate-ping" />
          <div
            className="absolute w-[120%] h-[120%] rounded-full border-2 border-[#4A7C59]/20 animate-ping"
            style={{ animationDuration: "2s" }}
          />
        </div>

        <Logo size={size} animate={true} />

        {/* Progress ring if progress is provided */}
        {progress !== undefined && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              strokeDasharray={`${progress * 2.827} 282.7`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#0D7377" />
                <stop offset="100%" stopColor="#4A7C59" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      <div className="text-center">
        <p className="text-slate-600 font-semibold text-lg">{message}</p>
        {progress !== undefined && (
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {Math.round(progress)}%
          </p>
        )}
      </div>
    </div>
  );
};
