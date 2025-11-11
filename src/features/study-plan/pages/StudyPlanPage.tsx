import { Calendar, CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default function StudyPlanPage() {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const todaysTasks = [
    {
      id: 1,
      subject: "Mathematics",
      task: "Chapter 5: Calculus",
      completed: true,
      duration: "2h",
    },
    {
      id: 2,
      subject: "Physics",
      task: "Newton's Laws Practice",
      completed: true,
      duration: "1.5h",
    },
    {
      id: 3,
      subject: "Chemistry",
      task: "Organic Chemistry Quiz",
      completed: false,
      duration: "1h",
    },
    {
      id: 4,
      subject: "Biology",
      task: "Cell Structure Review",
      completed: false,
      duration: "1h",
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      subject: "Mathematics",
      title: "Midterm Exam",
      date: "Nov 15, 2025",
      priority: "high",
    },
    {
      id: 2,
      subject: "Physics",
      title: "Lab Report",
      date: "Nov 18, 2025",
      priority: "medium",
    },
    {
      id: 3,
      subject: "English",
      title: "Essay Submission",
      date: "Nov 20, 2025",
      priority: "low",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Study Plan</h1>
          <p className="text-slate-600">
            Organize your study schedule and track your progress
          </p>
        </div>

        {/* Week Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">This Week</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
              Add Task
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`p-4 rounded-xl text-center ${
                  index === 2
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-700"
                }`}
              >
                <p className="text-sm font-semibold mb-1">{day}</p>
                <p className="text-2xl font-bold">{index + 11}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Today's Tasks
              </h2>
            </div>
            <div className="space-y-3">
              {todaysTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold ${
                        task.completed
                          ? "text-slate-500 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {task.task}
                    </p>
                    <p className="text-sm text-slate-600">{task.subject}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    {task.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Upcoming Deadlines
              </h2>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-slate-900">
                      {deadline.title}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        deadline.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : deadline.priority === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {deadline.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    {deadline.subject}
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {deadline.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
