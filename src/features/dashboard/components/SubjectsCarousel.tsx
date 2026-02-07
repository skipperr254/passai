import { ArrowRight, BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { useRef } from "react";

function getIconComponent(icon: string) {
  // Map icon names to Lucide components
  const iconMap: Record<string, typeof BookOpen> = {
    book: BookOpen,
    // For now, we'll use BookOpen as fallback
    // We'll create a proper icon mapper in the future
  };

  return iconMap[icon] || BookOpen;
}

function getColorClasses(color: string) {
  // Map color names to Tailwind classes
  const colorMap: Record<
    string,
    { bg: string; border: string; text: string; badge: string }
  > = {
    blue: {
      bg: "bg-[#0D7377]/5",
      border: "border-[#0D7377]/20",
      text: "text-[#0D7377]",
      badge: "bg-[#0D7377]/10 text-[#0D7377]",
    },
    green: {
      bg: "bg-[#6A994E]/5",
      border: "border-[#6A994E]/20",
      text: "text-[#6A994E]",
      badge: "bg-[#6A994E]/10 text-[#6A994E]",
    },
    purple: {
      bg: "bg-[#0D7377]/5",
      border: "border-[#0D7377]/20",
      text: "text-[#0D7377]",
      badge: "bg-[#0D7377]/10 text-[#0D7377]",
    },
    red: {
      bg: "bg-[#E07A5F]/5",
      border: "border-[#E07A5F]/20",
      text: "text-[#E07A5F]",
      badge: "bg-[#E07A5F]/10 text-[#E07A5F]",
    },
    amber: {
      bg: "bg-[#F2A541]/5",
      border: "border-[#F2A541]/20",
      text: "text-[#F2A541]",
      badge: "bg-[#F2A541]/10 text-[#F2A541]",
    },
    pink: {
      bg: "bg-[#E07A5F]/5",
      border: "border-[#E07A5F]/20",
      text: "text-[#E07A5F]",
      badge: "bg-[#E07A5F]/10 text-[#E07A5F]",
    },
    cyan: {
      bg: "bg-[#5FA8D3]/5",
      border: "border-[#5FA8D3]/20",
      text: "text-[#5FA8D3]",
      badge: "bg-[#5FA8D3]/10 text-[#5FA8D3]",
    },
    indigo: {
      bg: "bg-[#4A7C59]/5",
      border: "border-[#4A7C59]/20",
      text: "text-[#4A7C59]",
      badge: "bg-[#4A7C59]/10 text-[#4A7C59]",
    },
    emerald: {
      bg: "bg-[#8CB369]/5",
      border: "border-[#8CB369]/20",
      text: "text-[#8CB369]",
      badge: "bg-[#8CB369]/10 text-[#8CB369]",
    },
    rose: {
      bg: "bg-[#E07A5F]/5",
      border: "border-[#E07A5F]/20",
      text: "text-[#E07A5F]",
      badge: "bg-[#E07A5F]/10 text-[#E07A5F]",
    },
    violet: {
      bg: "bg-[#0D7377]/5",
      border: "border-[#0D7377]/20",
      text: "text-[#0D7377]",
      badge: "bg-[#0D7377]/10 text-[#0D7377]",
    },
    teal: {
      bg: "bg-[#0D7377]/5",
      border: "border-[#0D7377]/20",
      text: "text-[#0D7377]",
      badge: "bg-[#0D7377]/10 text-[#0D7377]",
    },
    orange: {
      bg: "bg-[#E07A5F]/5",
      border: "border-[#E07A5F]/20",
      text: "text-[#E07A5F]",
      badge: "bg-[#E07A5F]/10 text-[#E07A5F]",
    },
    lime: {
      bg: "bg-[#8CB369]/5",
      border: "border-[#8CB369]/20",
      text: "text-[#8CB369]",
      badge: "bg-[#8CB369]/10 text-[#8CB369]",
    },
    fuchsia: {
      bg: "bg-[#E07A5F]/5",
      border: "border-[#E07A5F]/20",
      text: "text-[#E07A5F]",
      badge: "bg-[#E07A5F]/10 text-[#E07A5F]",
    },
  };

  return colorMap[color] || colorMap.blue;
}

export const SubjectsCarousel = () => {
  const navigate = useNavigate();
  const { data: subjects, isLoading } = useSubjects();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-[#E8E4E1] rounded mb-4"></div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 w-64 bg-[#E8E4E1] rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-[#E8E4E1]/60 shadow-lg">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-[#0D7377]/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-[#0D7377]" />
          </div>
          <h3 className="text-xl font-bold text-[#2D3436] mb-2">
            No subjects yet
          </h3>
          <p className="text-[#2D3436]/70 mb-6">
            Create your first subject to start generating quizzes, uploading
            materials, and tracking your progress.
          </p>
          <button
            onClick={() => navigate("/subjects")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D7377] hover:bg-[#0D7377]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#0D7377]/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Your First Subject
          </button>
        </div>
      </div>
    );
  }

  const displaySubjects = subjects.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#2D3436] flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#0D7377]" />
          Your Subjects
        </h2>
        {subjects.length > 5 && (
          <button
            onClick={() => navigate("/subjects")}
            className="text-sm font-semibold text-[#0D7377] hover:text-[#0D7377]/80 flex items-center gap-1 transition-colors"
          >
            See all {subjects.length}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#D4A373] scrollbar-track-[#E8E4E1]"
      >
        {displaySubjects.map((subject) => {
          const Icon = getIconComponent(subject.icon || "book");
          const colors = getColorClasses(subject.color || "blue");

          return (
            <div
              key={subject.id}
              onClick={() => navigate(`/subjects/${subject.id}`)}
              className="shrink-0 w-72 bg-white/80 backdrop-blur-xl rounded-xl p-5 border border-[#E8E4E1]/60 shadow-lg hover:shadow-xl cursor-pointer transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-[#2D3436] mb-1 group-hover:text-[#0D7377] transition-colors line-clamp-1">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] uppercase font-semibold">
                    {subject.exam_board || "General"}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${subject.color}-20` }}
                >
                  {/* <span className="text-xl">{subject.icon || "📚"}</span> */}
                  <div
                    className={`shrink-0 w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {subject.pass_chance !== null &&
                subject.pass_chance !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#2D3436]/70 font-medium">
                        Pass Probability
                      </span>
                      <span className="font-bold text-[#2D3436]">
                        {subject.pass_chance}%
                      </span>
                    </div>
                    <div className="w-full bg-[#E8E4E1] rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          subject.pass_chance >= 70
                            ? "bg-linear-to-r from-[#6A994E] to-[#8CB369]"
                            : subject.pass_chance >= 50
                            ? "bg-linear-to-r from-[#F2A541] to-[#E9C46A]"
                            : "bg-linear-to-r from-[#E07A5F] to-[#D4A373]"
                        }`}
                        style={{ width: `${subject.pass_chance}%` }}
                      />
                    </div>
                  </div>
                )}

              <div className="flex items-center gap-4 text-xs text-[#2D3436]/70">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{subject.question_style || "Multiple Choice"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {subjects.length <= 5 && subjects.length > 0 && (
        <button
          onClick={() => navigate("/subjects")}
          className="w-full py-3 border-2 border-dashed border-[#E8E4E1] hover:border-[#0D7377] hover:bg-[#0D7377]/5 rounded-xl text-[#2D3436]/70 hover:text-[#0D7377] font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Another Subject
        </button>
      )}
    </div>
  );
};
