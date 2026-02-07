import { BookOpen, Plus, Sparkles } from "lucide-react";

// =============================================
// Types
// =============================================

interface EmptyStateProps {
  onCreateSubject?: () => void;
}

// =============================================
// Component
// =============================================

export default function EmptyState({ onCreateSubject }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-8">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#0D7377]/5 via-[#4A7C59]/5 to-[#4A7C59]/5 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-[#0D7377]" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-[#2D3436] mb-3">
          Start Your Study Journey
        </h2>

        {/* Description */}
        <p className="text-[#2D3436]/70 mb-8 leading-relaxed">
          Create your first subject to begin organizing your study materials,
          generating quizzes, and tracking your progress toward exam success.
        </p>

        {/* CTA Button */}
        {onCreateSubject && (
          <button
            onClick={onCreateSubject}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#0D7377] to-[#4A7C59] hover:from-[#0D7377]/90 hover:to-[#4A7C59]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#0D7377]/50/25 hover:shadow-xl hover:shadow-[#0D7377]/50/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Your First Subject
          </button>
        )}

        {/* Helper Text */}
        <div className="mt-8 pt-8 border-t border-[#E8E4E1]">
          <p className="text-sm text-[#2D3436]/60">
            🌺 <strong>Tip:</strong> Start by adding a subject you're currently
            studying, then upload your materials to generate personalized
            quizzes.
          </p>
        </div>
      </div>
    </div>
  );
}
