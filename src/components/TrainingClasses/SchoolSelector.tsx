import React from "react";
import { BookOpen, School } from "lucide-react";

export interface Program {
  _id: string;
  name: string;
  category?: string;
}

interface ProgramSelectorProps {
  programs: Program[];
  selectedProgramId: string;
  loading?: boolean;
  /** Show school-style icon/label when the category is school-related */
  isSchoolCategory?: boolean;
  onSelectProgram: (program: Program) => void;
}

const ProgramSelector: React.FC<ProgramSelectorProps> = ({
  programs,
  selectedProgramId,
  loading = false,
  isSchoolCategory = false,
  onSelectProgram,
}) => {
  const title = isSchoolCategory ? "Partner Schools" : "Programs";
  const subtitle = isSchoolCategory
    ? "Select a school to view its weekly schedule"
    : "Select a program to filter classes";

  return (
    <div className="bg-white dark:bg-white/[0.03] p-5 rounded-xl border border-gray-200 dark:border-white/[0.05] shadow-sm animate-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white">
          {isSchoolCategory ? <School size={18} /> : <BookOpen size={18} />}
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">{title}</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-11 w-32 rounded-2xl bg-gray-100 dark:bg-white/10 animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && programs.length === 0 && (
        <p className="text-xs text-gray-400 font-bold px-1 py-2">
          No programs found for this category.
        </p>
      )}

      {/* Program buttons */}
      {!loading && programs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {programs.map((program) => (
            <button
              key={program._id}
              onClick={() => onSelectProgram(program)}
              className={`px-6 py-3 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all border-2 ${selectedProgramId === program._id
                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
            >
              {program.name.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramSelector;
