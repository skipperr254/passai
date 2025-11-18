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
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
      badge: "bg-green-100 text-green-700",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      badge: "bg-purple-100 text-purple-700",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
      badge: "bg-red-100 text-red-700",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
    pink: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-600",
      badge: "bg-pink-100 text-pink-700",
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-600",
      badge: "bg-cyan-100 text-cyan-700",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-600",
      badge: "bg-rose-100 text-rose-700",
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-600",
      badge: "bg-violet-100 text-violet-700",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-600",
      badge: "bg-teal-100 text-teal-700",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
      badge: "bg-orange-100 text-orange-700",
    },
    lime: {
      bg: "bg-lime-50",
      border: "border-lime-200",
      text: "text-lime-600",
      badge: "bg-lime-100 text-lime-700",
    },
    fuchsia: {
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-200",
      text: "text-fuchsia-600",
      badge: "bg-fuchsia-100 text-fuchsia-700",
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
        <div className="h-8 w-32 bg-slate-200 rounded mb-4"></div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 w-64 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/60 shadow-lg">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No subjects yet
          </h3>
          <p className="text-slate-600 mb-6">
            Create your first subject to start generating quizzes, uploading
            materials, and tracking your progress.
          </p>
          <button
            onClick={() => navigate("/subjects")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
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
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Your Subjects
        </h2>
        {subjects.length > 5 && (
          <button
            onClick={() => navigate("/subjects")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            See all {subjects.length}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
      >
        {displaySubjects.map((subject) => {
          const Icon = getIconComponent(subject.icon || "book");
          const colors = getColorClasses(subject.color || "blue");

          return (
            <div
              key={subject.id}
              onClick={() => navigate(`/subjects/${subject.id}`)}
              className="shrink-0 w-72 bg-white/80 backdrop-blur-xl rounded-xl p-5 border border-slate-200/60 shadow-lg hover:shadow-xl cursor-pointer transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
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
                      <span className="text-slate-600 font-medium">
                        Pass Probability
                      </span>
                      <span className="font-bold text-slate-900">
                        {subject.pass_chance}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          subject.pass_chance >= 70
                            ? "bg-linear-to-r from-emerald-500 to-green-500"
                            : subject.pass_chance >= 50
                            ? "bg-linear-to-r from-amber-500 to-orange-500"
                            : "bg-linear-to-r from-red-500 to-rose-500"
                        }`}
                        style={{ width: `${subject.pass_chance}%` }}
                      />
                    </div>
                  </div>
                )}

              <div className="flex items-center gap-4 text-xs text-slate-600">
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
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-slate-600 hover:text-blue-600 font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Another Subject
        </button>
      )}
    </div>
  );
};
