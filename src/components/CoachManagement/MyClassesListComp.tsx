import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getCoachClasses } from "../../api/coaches";
import Badge from "../ui/badge/Badge";
import { MoreVertical } from "lucide-react";
import ViewClassPlayersModal from "../classes/ViewClassPlayersModal";

interface ClassDetail {
  classId: string;
  className: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue: string;
  location: string;
  sessionDuration: number;
  trainingType: string;
  capacity: number;
  totalPlayers: number;
  term?: {
    name: string;
    year: number;
  };
  program?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

export default function MyClassesListComp() {
  const [classes, setClasses] = useState<ClassDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getCoachClasses();
        if (response && Array.isArray(response.data)) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        toast.error("Failed to load classes");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filteredClasses = classes.filter((c) =>
    c.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.program?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-none shadow-theme-xs">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classes by name, location, or program..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-none text-xs font-semibold focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] shadow-sm"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-100 rounded-none shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-visible">
        <div className="overflow-visible no-scrollbar">
          <table className="w-full text-left border-collapse text-xs [&_th]:border [&_th]:border-slate-700/50 [&_td]:border [&_td]:border-slate-200 dark:[&_td]:border-slate-700">
            <thead>
              <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-[40px]">#</th>
                <th className="py-3 px-3 min-w-[150px]">Name</th>
                <th className="py-3 px-3 min-w-[140px]">Program / Term</th>
                <th className="py-3 px-3 min-w-[120px]">Schedule</th>
                <th className="py-3 px-3 min-w-[120px]">Location</th>
                <th className="py-3 px-3 min-w-[80px]">Status</th>
                <th className="py-3 px-4 w-[50px] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 font-semibold">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0047FF] border-t-transparent shadow-sm"></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing Classes...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 font-semibold italic">
                    No classes assigned to you.
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls, idx) => (
                  <tr
                    key={cls.classId}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-default"
                  >
                    <td className="py-4 px-4 font-semibold text-slate-500">{idx + 1}</td>
                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{cls.className}</div>
                      <div className="text-xs text-slate-500 font-normal mt-0.5">Capacity: {cls.totalPlayers} / {cls.capacity}</div>
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
                      {cls.location || cls.venue || "N/A"}
                    </td>
                    <td className="py-4 px-3">
                      <Badge color="success">
                        ACTIVE
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="inline-flex items-center justify-center w-7 h-7 bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 transition-colors shadow-sm"
                        title="More Options"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === cls.classId ? null : cls.classId);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openDropdownId === cls.classId && (
                        <div className="absolute right-8 top-10 w-36 bg-white dark:bg-slate-800 rounded-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClassId(cls.classId);
                              setOpenDropdownId(null);
                            }}
                          >
                            View Players
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

      <ViewClassPlayersModal
        isOpen={!!selectedClassId}
        onClose={() => setSelectedClassId(null)}
        classId={selectedClassId}
      />
    </div>
  );
}
