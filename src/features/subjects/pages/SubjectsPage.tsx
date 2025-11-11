import { BookOpen, Clock, TrendingUp, Plus } from "lucide-react";

export default function SubjectsPage() {
  const subjects = [
    {
      id: 1,
      name: "Mathematics",
      color: "from-blue-500 to-indigo-600",
      progress: 75,
      hoursStudied: 28,
      lastStudied: "Today",
      topics: 12,
    },
    {
      id: 2,
      name: "Physics",
      color: "from-purple-500 to-pink-600",
      progress: 60,
      hoursStudied: 22,
      lastStudied: "Yesterday",
      topics: 10,
    },
    {
      id: 3,
      name: "Chemistry",
      color: "from-green-500 to-emerald-600",
      progress: 45,
      hoursStudied: 18,
      lastStudied: "2 days ago",
      topics: 8,
    },
    {
      id: 4,
      name: "Biology",
      color: "from-orange-500 to-red-600",
      progress: 80,
      hoursStudied: 32,
      lastStudied: "Today",
      topics: 15,
    },
    {
      id: 5,
      name: "English Literature",
      color: "from-cyan-500 to-blue-600",
      progress: 55,
      hoursStudied: 20,
      lastStudied: "3 days ago",
      topics: 9,
    },
    {
      id: 6,
      name: "History",
      color: "from-amber-500 to-orange-600",
      progress: 40,
      hoursStudied: 15,
      lastStudied: "1 week ago",
      topics: 7,
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              My Subjects
            </h1>
            <p className="text-slate-600">
              Manage and track your study subjects
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-500/25">
            <Plus className="w-5 h-5" />
            Add Subject
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">
                Total Subjects
              </p>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {subjects.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">
                Total Hours
              </p>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {subjects.reduce((acc, s) => acc + s.hoursStudied, 0)}h
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">
                Avg Progress
              </p>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {Math.round(
                subjects.reduce((acc, s) => acc + s.progress, 0) /
                  subjects.length
              )}
              %
            </p>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group"
            >
              <div className={`h-2 bg-linear-to-r ${subject.color}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Last studied: {subject.lastStudied}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${subject.color} flex items-center justify-center shadow-lg`}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-600">
                        Progress
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {subject.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-linear-to-r ${subject.color} transition-all duration-500`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {subject.hoursStudied}
                      </p>
                      <p className="text-xs text-slate-500">Hours</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {subject.topics}
                      </p>
                      <p className="text-xs text-slate-500">Topics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
