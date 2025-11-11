import { Brain, Clock, Trophy, Play, CheckCircle2 } from "lucide-react";

export default function QuizzesPage() {
  const availableQuizzes = [
    {
      id: 1,
      title: "Calculus Fundamentals",
      subject: "Mathematics",
      questions: 20,
      duration: "30 min",
      difficulty: "Medium",
      completed: false,
    },
    {
      id: 2,
      title: "Organic Chemistry Basics",
      subject: "Chemistry",
      questions: 15,
      duration: "25 min",
      difficulty: "Hard",
      completed: false,
    },
    {
      id: 3,
      title: "Cell Biology Review",
      subject: "Biology",
      questions: 25,
      duration: "35 min",
      difficulty: "Easy",
      completed: false,
    },
  ];

  const completedQuizzes = [
    {
      id: 1,
      title: "Newton's Laws Quiz",
      subject: "Physics",
      score: 92,
      date: "Nov 10, 2025",
      questions: 15,
    },
    {
      id: 2,
      title: "Shakespeare Literature",
      subject: "English",
      score: 88,
      date: "Nov 8, 2025",
      questions: 20,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-orange-100 text-orange-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Quizzes</h1>
          <p className="text-slate-600">
            Test your knowledge and track your progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">
                Total Quizzes
              </p>
            </div>
            <p className="text-3xl font-bold text-slate-900">47</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">
                Average Score
              </p>
            </div>
            <p className="text-3xl font-bold text-slate-900">87%</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Time Spent</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">12.5h</p>
          </div>
        </div>

        {/* Available Quizzes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Available Quizzes
            </h2>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
              {availableQuizzes.length} New
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {availableQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="h-32 bg-linear-to-br from-blue-500 to-indigo-600 p-6 flex items-center justify-center">
                  <Brain className="w-16 h-16 text-white opacity-80" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-slate-600">{quiz.subject}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(
                        quiz.difficulty
                      )}`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                    <span>{quiz.questions} questions</span>
                    <span>•</span>
                    <span>{quiz.duration}</span>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold">
                    <Play className="w-4 h-4" />
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Quizzes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Recently Completed
          </h2>
          <div className="space-y-3">
            {completedQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{quiz.title}</p>
                    <p className="text-sm text-slate-600">
                      {quiz.subject} • {quiz.questions} questions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {quiz.score}%
                  </p>
                  <p className="text-xs text-slate-500">{quiz.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
