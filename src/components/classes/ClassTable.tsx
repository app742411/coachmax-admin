import { useState, useEffect } from "react";
import Badge from "../../components/ui/badge/Badge";

interface ClassItem {
  _id: string;
  name: string;
  trainingType: string;
  sessionDuration: number;
  status: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  term?: { name: string; year: number };
  program?: { name: string };
  category?: { name: string };
  coach?: { name: string };
  players?: any[];
}

interface ClassTableProps {
  classes: ClassItem[];
  isLoading: boolean;
  onEditClass?: (cls: ClassItem) => void;
}

export default function ClassTable({ classes, isLoading, onEditClass }: ClassTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-slate-100 rounded-none shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-visible">
      <div className="overflow-visible no-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-[40px]">#</th>
              <th className="py-3 px-3 min-w-[150px]">Name</th>
              <th className="py-3 px-3 min-w-[140px]">Program / Term</th>
              <th className="py-3 px-3 min-w-[120px]">Schedule</th>
              <th className="py-3 px-3 min-w-[120px]">Location</th>
              <th className="py-3 px-3 min-w-[120px]">Coach</th>
              <th className="py-3 px-3 min-w-[80px]">Status</th>
              <th className="py-3 px-4 w-[50px] text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-500 font-semibold">
                  Loading classes...
                </td>
              </tr>
            ) : classes.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-500 font-semibold">
                  No classes found.
                </td>
              </tr>
            ) : (
              classes.map((cls, idx) => (
                <tr
                  key={cls._id}
                  className="border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-default"
                >
                  <td className="py-4 px-4 font-semibold text-slate-500">{idx + 1}</td>
                  <td className="py-4 px-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{cls.name}</div>
                    <div className="text-xs text-slate-500 font-normal mt-0.5">Capacity: {cls.players?.length || 0} / {cls.capacity}</div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="text-slate-700 dark:text-slate-300 font-bold">{cls.program?.name || "N/A"}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{cls.term?.name || "N/A"} ({cls.term?.year || ""})</div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="text-slate-700 dark:text-slate-300 font-bold capitalize">{cls.dayOfWeek?.toLowerCase()}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{cls.startTime} - {cls.endTime}</div>
                  </td>
                  <td className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">
                    {cls.location}
                  </td>
                  <td className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">
                    {cls.coach?.name || "Unassigned"}
                  </td>
                  <td className="py-4 px-3">
                    <Badge color={cls.status === "ACTIVE" ? "success" : "warning"}>
                      {cls.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="More Options"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === cls._id ? null : cls._id);
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    {openDropdownId === cls._id && (
                      <div className="absolute right-8 top-10 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <button 
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEditClass) onEditClass(cls);
                            setOpenDropdownId(null);
                          }}
                        >
                          Edit Class
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
