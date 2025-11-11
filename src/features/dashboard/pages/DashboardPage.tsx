import { TrendingUp, Clock, Target, BookOpen } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      id: 1,
      label: "Study Hours",
      value: "24.5",
      icon: Clock,
      change: "+12%",
      positive: true,
    },
    {
      id: 2,
      label: "Subjects Active",
      value: "8",
      icon: BookOpen,
      change: "+2",
      positive: true,
    },
    {
      id: 3,
      label: "Quizzes Completed",
      value: "47",
      icon: Target,
      change: "+8",
      positive: true,
    },
    {
      id: 4,
      label: "Average Score",
      value: "87%",
      icon: TrendingUp,
      change: "+5%",
      positive: true,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      subject: "Mathematics",
      action: "Completed Quiz",
      time: "2 hours ago",
    },
    { id: 2, subject: "Physics", action: "Added Notes", time: "5 hours ago" },
    { id: 3, subject: "Chemistry", action: "Study Session", time: "1 day ago" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, Jake! 👋
          </h1>
          <p className="text-slate-600">
            Here's your study progress overview for this week
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {activity.subject}
                  </p>
                  <p className="text-sm text-slate-600">{activity.action}</p>
                </div>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
