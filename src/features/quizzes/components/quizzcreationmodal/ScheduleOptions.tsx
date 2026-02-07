import React from "react";
import { CheckCircle2, Play, Calendar, Bell, Zap } from "lucide-react";
import type { QuizSettings, Subject } from "../../types/quiz";

interface ScheduleOptionsProps {
  scheduleOption: "now" | "later";
  setScheduleOption: (option: "now" | "later") => void;
  scheduleDateTime: string;
  setScheduleDateTime: (time: string) => void;
  quizSettings: QuizSettings;
  selectedSubject: Subject | null;
}

export const ScheduleOptions: React.FC<ScheduleOptionsProps> = ({
  scheduleOption,
  setScheduleOption,
  scheduleDateTime,
  setScheduleDateTime,
  quizSettings,
  selectedSubject,
}) => {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-linear-to-br from-[#6A994E] to-[#4A7C59] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-[#2D3436] mb-2">
          Quiz Generated Successfully! �
        </h3>
        <p className="text-[#2D3436]/70">
          Your personalized {selectedSubject?.name} quiz with{" "}
          {quizSettings.questionCount} questions is ready
        </p>
      </div>
      <div className="space-y-4 max-w-lg mx-auto">
        <h4 className="text-sm font-bold text-[#2D3436] mb-3">
          When would you like to take this quiz?
        </h4>
        <button
          onClick={() => setScheduleOption("now")}
          className={`w-full p-4 lg:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${
            scheduleOption === "now"
              ? "border-[#0D7377] bg-[#0D7377]/5"
              : "border-[#E8E4E1] bg-white hover:border-[#E8E4E1]/80"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                scheduleOption === "now" ? "bg-[#0D7377]" : "bg-[#FAF3E0]"
              }`}
            >
              <Play
                className={`w-6 h-6 ${
                  scheduleOption === "now" ? "text-white" : "text-[#2D3436]/70"
                }`}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-[#2D3436] mb-0.5">Start Now</p>
              <p className="text-sm text-[#2D3436]/70">
                Begin the quiz immediately
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                scheduleOption === "now"
                  ? "bg-[#0D7377] border-[#0D7377]"
                  : "bg-white border-[#E8E4E1]"
              }`}
            >
              {scheduleOption === "now" && (
                <CheckCircle2 className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
        </button>
        <button
          onClick={() => setScheduleOption("later")}
          className={`w-full p-4 lg:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${
            scheduleOption === "later"
              ? "border-[#0D7377] bg-[#0D7377]/5"
              : "border-[#E8E4E1] bg-white hover:border-[#E8E4E1]/80"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                scheduleOption === "later" ? "bg-[#0D7377]" : "bg-[#FAF3E0]"
              }`}
            >
              <Calendar
                className={`w-6 h-6 ${
                  scheduleOption === "later" ? "text-white" : "text-[#2D3436]/70"
                }`}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-[#2D3436] mb-0.5">
                Schedule for Later
              </p>
              <p className="text-sm text-[#2D3436]/70">
                Get a reminder at a specific time
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                scheduleOption === "later"
                  ? "bg-[#0D7377] border-[#0D7377]"
                  : "bg-white border-[#E8E4E1]"
              }`}
            >
              {scheduleOption === "later" && (
                <CheckCircle2 className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
        </button>
        {scheduleOption === "later" && (
          <div className="mt-4 p-4 bg-[#0D7377]/5 border-2 border-[#0D7377]/20 rounded-xl animate-in slide-in-from-top duration-300">
            <label
              htmlFor="schedule-datetime"
              className="block text-sm font-bold text-[#2D3436] mb-3"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#0D7377]" />
                <span>Reminder Date & Time</span>
              </div>
            </label>
            <input
              id="schedule-datetime"
              type="datetime-local"
              value={scheduleDateTime}
              onChange={(e) => setScheduleDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-3 bg-white border-2 border-[#E8E4E1] rounded-xl text-sm focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/10 outline-none transition-all"
            />
            <p className="text-xs text-[#0D7377]/90 mt-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              You'll receive a notification when it's time to take your quiz
            </p>
          </div>
        )}
        <div className="mt-6 p-4 bg-[#FAF3E0] border border-[#E8E4E1] rounded-xl">
          <p className="text-xs font-bold text-[#2D3436]/70 mb-3">QUIZ SUMMARY</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-[#2D3436]/70 mb-0.5">Subject</p>
              <p className="text-sm font-bold text-[#2D3436]">
                {selectedSubject?.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#2D3436]/70 mb-0.5">Questions</p>
              <p className="text-sm font-bold text-[#2D3436]">
                {quizSettings.questionCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#2D3436]/70 mb-0.5">Difficulty</p>
              <p className="text-sm font-bold text-[#2D3436] capitalize">
                {quizSettings.difficulty}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#2D3436]/70 mb-0.5">Time Limit</p>
              <p className="text-sm font-bold text-[#2D3436]">
                {quizSettings.timeLimit} min
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
