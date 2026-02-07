import React from "react";
import { CalendarDays } from "lucide-react";
import { StudyTopicCard } from "./StudyTopicCard";
import type { StudyPlanTopic } from "../types";

interface StudyScheduleProps {
  topics: StudyPlanTopic[];
  expandedTopics: { [topicId: string]: boolean };
  onToggleTopic: (topicId: string) => void;
  onToggleTask: (topicId: string, taskId: string) => void;
}

export const StudySchedule: React.FC<StudyScheduleProps> = ({
  topics,
  expandedTopics,
  onToggleTopic,
  onToggleTask,
}) => {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <CalendarDays className="w-6 h-6 text-[#0D7377]" />
        <h2 className="text-xl lg:text-2xl font-bold text-[#2D3436]">
          Study Schedule
        </h2>
      </div>

      {/* Topics List */}
      {topics.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#FAF3E0] rounded-xl border-2 border-dashed border-[#E8E4E1]">
          <p className="text-[#2D3436]/70 font-medium">
            No study topics available yet
          </p>
          <p className="text-sm text-[#2D3436]/60 mt-1">
            Your study plan will appear here once generated
          </p>
        </div>
      ) : (
        <div className="space-y-3 lg:space-y-4">
          {topics.map((topic) => (
            <StudyTopicCard
              key={topic.id}
              topic={topic}
              isExpanded={expandedTopics[topic.id] || false}
              onToggle={() => onToggleTopic(topic.id)}
              onTaskToggle={(taskId) => onToggleTask(topic.id, taskId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
