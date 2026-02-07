import React from "react";
import { Book, ChevronDown, CheckCircle2 } from "lucide-react";
import type { Subject } from "../types";

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  isOpen,
  onToggle,
}) => {
  if (!selectedSubject) return null;

  return (
    <div className="mb-4 lg:mb-6">
      <div className="relative inline-block w-full lg:w-auto">
        <button
          onClick={onToggle}
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all w-full lg:w-auto bg-${selectedSubject.color}-600 text-white shadow-md hover:shadow-lg`}
          style={{
            backgroundColor: `var(--color-${selectedSubject.color}-600, rgb(37 99 235))`,
          }}
        >
          <div className="flex items-center gap-3">
            <Book className="w-5 h-5" />
            <span className="font-semibold">{selectedSubject.name}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={onToggle}
            />

            {/* Dropdown */}
            <div className="absolute top-full left-0 right-0 lg:right-auto mt-2 w-full lg:w-72 bg-white rounded-xl border-2 border-[#E8E4E1] shadow-xl z-50 max-h-96 overflow-y-auto">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => {
                    onSelectSubject(subject);
                    onToggle();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FAF3E0] transition-colors first:rounded-t-xl last:rounded-b-xl ${
                    selectedSubject.id === subject.id ? "bg-[#0D7377]/5" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center`}
                    style={{
                      backgroundColor: `var(--color-${subject.color}-600, rgb(37 99 235))`,
                    }}
                  >
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <span className="flex-1 text-left font-semibold text-[#2D3436]">
                    {subject.name}
                  </span>
                  {selectedSubject.id === subject.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#0D7377]" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
