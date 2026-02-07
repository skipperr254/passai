import React from "react";

interface TextAnswerInputProps {
  questionType: "short-answer" | "essay" | "fill-in-blank";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const TextAnswerInput: React.FC<TextAnswerInputProps> = ({
  questionType,
  value,
  onChange,
  disabled = false,
  placeholder,
}) => {
  // Fill-in-blank uses single line input
  if (questionType === "fill-in-blank") {
    return (
      <div className="mb-6">
        <input
          type="text"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          disabled={disabled}
          placeholder={placeholder || "Type the missing word(s)..."}
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${
            disabled
              ? "bg-[#FAF3E0] border-[#E8E4E1] text-[#2D3436]/80 cursor-not-allowed"
              : "bg-white border-[#E8E4E1] hover:border-[#0D7377]/70 focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/10"
          }`}
        />
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-[#2D3436]/60">
            🌺 Fill in the blank with the correct term
          </p>
          <p className="text-xs text-[#2D3436]/50">
            {value.length} character{value.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    );
  }

  // Essay and short-answer use textarea
  const rows = questionType === "essay" ? 8 : 3;
  const defaultPlaceholder =
    questionType === "essay"
      ? "Type your essay answer here... (3-5 paragraphs)"
      : "Type your answer here... (1-3 sentences)";

  return (
    <div className="mb-6">
      <textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        disabled={disabled}
        placeholder={placeholder || defaultPlaceholder}
        rows={rows}
        className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all resize-none ${
          disabled
            ? "bg-[#FAF3E0] border-[#E8E4E1] text-[#2D3436]/80 cursor-not-allowed"
            : "bg-white border-[#E8E4E1] hover:border-[#0D7377]/70 focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/10"
        }`}
      />
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-xs text-[#2D3436]/60">
          {questionType === "essay"
            ? "🌺 Write clearly and organize your thoughts"
            : "🌺 Be specific and concise"}
        </p>
        <p className="text-xs text-[#2D3436]/50">
          {value.length} character{value.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};
