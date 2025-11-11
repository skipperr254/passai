import { User, Bell, Lock, Palette, Globe, HelpCircle } from "lucide-react";

export default function SettingsPage() {
  const settingsSections = [
    {
      id: "account",
      title: "Account Settings",
      icon: User,
      items: [
        { label: "Profile Information", value: "Edit your personal details" },
        { label: "Email Address", value: "jake@example.com" },
        { label: "Change Password", value: "Last changed 30 days ago" },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Email Notifications", value: "Enabled" },
        { label: "Push Notifications", value: "Enabled" },
        { label: "Study Reminders", value: "Daily at 9:00 AM" },
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Lock,
      items: [
        { label: "Two-Factor Authentication", value: "Disabled" },
        { label: "Data Sharing", value: "Limited" },
        { label: "Activity Status", value: "Visible to friends" },
      ],
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: Palette,
      items: [
        { label: "Theme", value: "Light Mode" },
        { label: "Color Scheme", value: "Blue & Indigo" },
        { label: "Font Size", value: "Medium" },
      ],
    },
    {
      id: "language",
      title: "Language & Region",
      icon: Globe,
      items: [
        { label: "Language", value: "English (US)" },
        { label: "Time Zone", value: "PST (UTC-8)" },
        { label: "Date Format", value: "MM/DD/YYYY" },
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900 mb-1">
                            {item.label}
                          </p>
                          <p className="text-sm text-slate-600">{item.value}</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Need Help?
              </h3>
              <p className="text-slate-600 mb-4">
                Check out our documentation or contact support for assistance.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
                  Documentation
                </button>
                <button className="px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-sm border border-slate-200">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border-2 border-red-200 overflow-hidden">
          <div className="p-6 bg-red-50 border-b border-red-200">
            <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 mb-1">
                  Delete Account
                </p>
                <p className="text-sm text-slate-600">
                  Permanently delete your account and all data
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
