import React from "react";
import { Book, Check } from "lucide-react";
import type { Subject, Material } from "../../types/quiz";

interface SubjectSelectionProps {
  subjects: Subject[];
  selectedSubject: Subject | null;
  setSelectedSubject: (subject: Subject) => void;
  materials: Material[];
}

export const SubjectSelection: React.FC<SubjectSelectionProps> = ({
  subjects,
  selectedSubject,
  setSelectedSubject,
  materials,
}) => {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-[#2D3436] mb-2">
          Select Subject
        </h3>
        <p className="text-sm text-[#2D3436]/70">
          Choose which subject this quiz is for
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => setSelectedSubject(subject)}
            className={`p-4 lg:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${
              selectedSubject?.id === subject.id
                ? "border-[#0D7377] bg-[#0D7377]/10"
                : "border-[#E8E4E1] bg-white hover:border-[#E8E4E1]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-${subject.color}-600 flex items-center justify-center shadow-md`}
              >
                <Book className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-[#2D3436]">{subject.name}</p>
                <p className="text-xs text-[#2D3436]/70">
                  {materials.filter((m) => m.subject_id === subject.id).length}{" "}
                  materials
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedSubject?.id === subject.id
                    ? "bg-[#0D7377] border-[#0D7377]"
                    : "bg-white border-[#E8E4E1]"
                }`}
              >
                {selectedSubject?.id === subject.id && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
