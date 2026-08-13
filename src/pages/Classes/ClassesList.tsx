import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import apiClient from "../../api/apiClient";
import ClassFilters from "../../components/classes/ClassFilters";
import ClassTable from "../../components/classes/ClassTable";
import ViewClassPlayersModal from "../../components/classes/ViewClassPlayersModal";
import AddClassModal from "../../components/classes/AddClassModal";
import Select from "../../components/form/Select";
import Pagination from "../../components/common/Pagination";

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

export default function ClassesList() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClasses, setTotalClasses] = useState(0);

  // Filter States
  const [categories, setCategories] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedDay, setSelectedDay] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<ClassItem | null>(null);
  const [viewPlayersClassId, setViewPlayersClassId] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const params: any = { page, limit };
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedProgram) params.programId = selectedProgram;
      if (selectedTerm) params.termId = selectedTerm;
      if (selectedDay) params.day = selectedDay;

      const response = await apiClient.get("/api/admin/getAllClasses", { params });
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setClasses(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalClasses(response.data.totalClasses || response.data.total || response.data.data.length);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page, limit, searchQuery, selectedCategory, selectedProgram, selectedTerm, selectedDay]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await apiClient.get("/api/user/getCategories", { params: { isEvent: "all" } });
        if (catRes.data && Array.isArray(catRes.data)) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch terms when year changes
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const params: any = { isEvent: "all" };
        if (selectedYear) {
          params.year = selectedYear;
        }
        const termsRes = await apiClient.get("/api/admin/getAllTerms", { params });
        if (termsRes.data?.data) {
          setTerms(termsRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load terms:", err);
      }
    };
    fetchTerms();
    setSelectedTerm("");
  }, [selectedYear]);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (selectedCategory) {
        try {
          const res = await apiClient.get(`/api/user/getProgramsByCategory/${selectedCategory}`);
          if (res.data && Array.isArray(res.data)) {
            setPrograms(res.data);
          }
        } catch (err) {
          console.error("Failed to fetch programs by category:", err);
        }
      } else {
        setPrograms([]);
        setSelectedProgram("");
      }
    };
    fetchPrograms();
  }, [selectedCategory]);

  // Frontend filtering removed as backend now handles it

  return (
    <>
      <PageMeta title="Classes Management | CoachMax" description="Manage your classes" />

      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Classes Management</h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-[#0047FF]">Classes Management</span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Year Selector */}
          <div className="w-36 shrink-0">
            <Select
              value={selectedYear}
              onChange={(val) => setSelectedYear(val)}
              options={[
                { label: "All Years", value: "" },
                ...(() => {
                  const currentYear = new Date().getFullYear();
                  const years: { label: string; value: string }[] = [];
                  for (let y = currentYear + 1; y >= currentYear - 3; y--) {
                    years.push({ label: `${y}`, value: `${y}` });
                  }
                  return years;
                })()
              ]}
              placeholder="All Years"
              className="w-full select-none"
              triggerClassName="h-[42px] w-full flex items-center justify-between appearance-none rounded-none border px-4 py-2 text-xs font-bold shadow-theme-xs outline-hidden bg-white dark:bg-slate-900 text-slate-800 border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-800 dark:text-white transition-all cursor-pointer group"
            />
          </div>

          {/* Term Selector */}
          <div className="w-48 shrink-0">
            <Select
              value={selectedTerm}
              onChange={(val) => setSelectedTerm(val)}
              options={[
                { label: "All Terms", value: "" },
                ...terms.map((t) => ({ label: `${t.name} (${t.year})`, value: t._id }))
              ]}
              placeholder="All Terms"
              className="w-full select-none"
              triggerClassName="h-[42px] w-full flex items-center justify-between appearance-none rounded-none border px-4 py-2 text-xs font-bold shadow-theme-xs outline-hidden bg-white dark:bg-slate-900 text-slate-800 border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-800 dark:text-white transition-all cursor-pointer group"
            />
          </div>

          <button
            onClick={() => { setClassToEdit(null); setIsModalOpen(true); }}
            className="inline-flex items-center justify-center rounded-none bg-[#0047FF] px-5 py-2.5 h-[42px] text-center text-xs font-black uppercase tracking-wider text-white hover:bg-blue-700 transition-colors shadow-theme-xs shrink-0"
          >
            + Add Class
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto custom-scrollbar gap-2">
        <button
          onClick={() => {
            setSelectedCategory("");
            setSelectedProgram("");
          }}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-[3px] shrink-0 ${selectedCategory === ""
              ? "border-[#0047FF] text-[#0047FF]"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
        >
          All Classes
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => {
              setSelectedCategory(c._id);
              setSelectedProgram("");
            }}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-[3px] shrink-0 ${selectedCategory === c._id
                ? "border-[#0047FF] text-[#0047FF]"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Program (Sub-category) Tabs */}
      {selectedCategory && programs.length > 0 && (
        <div className="flex border-b border-slate-100 dark:border-slate-800/60 mb-6 overflow-x-auto custom-scrollbar gap-2 -mt-4 bg-slate-50/50 dark:bg-slate-900/10 px-2 py-0.5">
          <button
            onClick={() => setSelectedProgram("")}
            className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${selectedProgram === ""
                ? "border-[#0047FF] text-[#0047FF]"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
          >
            All Programs
          </button>
          {programs.map((p) => (
            <button
              key={p._id}
              onClick={() => setSelectedProgram(p._id)}
              className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${selectedProgram === p._id
                  ? "border-[#0047FF] text-[#0047FF]"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Day Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6 text-xs font-semibold overflow-x-auto no-scrollbar gap-1">
        {["All Days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day === "All Days" ? "" : day)}
            className={`py-3 px-8 transition-all border-b-[3px] shrink-0 text-xs font-semibold tracking-wider cursor-pointer ${
              (selectedDay === "" && day === "All Days") || selectedDay === day
                ? "bg-[#031549] text-white font-bold border-[#0047FF]"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-transparent"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-2 items-start w-full">
        <div className="flex-1 w-full min-w-0">
          <ClassFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ClassTable
            classes={classes}
            isLoading={isLoading}
            onEditClass={(cls) => {
              setClassToEdit(cls);
              setIsModalOpen(true);
            }}
            onViewPlayers={(cls) => setViewPlayersClassId(cls._id)}
          />
          {!isLoading && totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalClasses}
              limit={limit}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>



      <AddClassModal
        isOpen={isModalOpen}
        classToEdit={classToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setClassToEdit(null);
        }}
        onSuccess={() => {
          setIsLoading(true);
          fetchClasses();
        }}
      />

      <ViewClassPlayersModal
        isOpen={!!viewPlayersClassId}
        onClose={() => setViewPlayersClassId(null)}
        classId={viewPlayersClassId}
      />
    </>
  );
}
