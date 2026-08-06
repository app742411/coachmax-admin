import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import apiClient from "../../api/apiClient";
import Select from "../form/Select";

interface AcademyHeaderProps {
  programType?: string;
  onCategoryChange?: (categoryId: string, name?: string) => void;
  onProgramChange?: (programId: string, name?: string) => void;
  onYearChange?: (year: string) => void;
  onOpenCreateClass?: () => void;
  onOpenTermSettings?: () => void;
  playerType?: "BOTH" | "ALLOCATED" | "UNALLOCATED";
  onPlayerTypeChange?: (val: "BOTH" | "ALLOCATED" | "UNALLOCATED") => void;
}

export default function AcademyHeader({
  programType = "Academy",
  onCategoryChange,
  onProgramChange,
  onYearChange,
  onOpenCreateClass,
  onOpenTermSettings,
  playerType,
  onPlayerTypeChange
}: AcademyHeaderProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [programs, setPrograms] = useState<{ _id: string; name: string }[]>([]);
  const [terms, setTerms] = useState<{ _id: string; name: string; year: number }[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<string>("");

  // 1. Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await apiClient.get("/api/user/getCategories", { params: { isEvent: "all" } });
        if (catRes.data && Array.isArray(catRes.data)) {
          setCategories(catRes.data);
          // Find the category matching the programType (e.g. "Academy" -> "ACADEMY")
          const matched = catRes.data.find(c => c.name.toLowerCase() === programType.toLowerCase());
          if (matched) {
            setSelectedCategory(matched._id);
            onCategoryChange?.(matched._id, matched.name);
          } else if (catRes.data.length > 0) {
            setSelectedCategory(catRes.data[0]._id);
            onCategoryChange?.(catRes.data[0]._id, catRes.data[0].name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [programType]);

  // 2. Fetch programs when category changes
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchPrograms = async () => {
      try {
        const programsRes = await apiClient.get(`/api/user/getProgramsByCategory/${selectedCategory}`);
        if (programsRes.data && Array.isArray(programsRes.data)) {
          setPrograms(programsRes.data);
          if (programsRes.data.length > 0) {
            setSelectedProgram(programsRes.data[0]._id);
            onProgramChange?.(programsRes.data[0]._id, programsRes.data[0].name);
          } else {
            setSelectedProgram("");
            onProgramChange?.("", "");
          }
        }
      } catch (error) {
        console.error("Failed to fetch programs by category:", error);
      }
    };
    fetchPrograms();
  }, [selectedCategory]);

  // 3. Fetch terms
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const termsRes = await apiClient.get("/api/admin/getAllTerms");
        if (termsRes.data && termsRes.data.data && Array.isArray(termsRes.data.data)) {
          const allTerms = termsRes.data.data;
          setTerms(allTerms);
          if (allTerms.length > 0) {
            const now = new Date();
            let currentTerm = allTerms.find((t: any) => {
              if (!t.startDate || !t.endDate) return false;
              const start = new Date(t.startDate);
              const end = new Date(t.endDate);
              return now >= start && now <= end;
            });

            if (!currentTerm) {
              currentTerm = allTerms[0];
            }

            setSelectedYear(currentTerm.year.toString());
            setSelectedTerm(currentTerm._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch terms:", error);
      }
    };
    fetchTerms();
  }, []);

  const uniqueYears = Array.from(new Set(terms.map((t) => t.year.toString())));
  const filteredTerms = terms.filter(t => t.year.toString() === selectedYear);

  return (
    <div className="flex flex-col gap-4 mb-6 xl:flex-row xl:items-center xl:justify-between">
      {/* Title & Dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Programs (Static) */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Programs</h1>
        </div>

        <span className="text-slate-300 dark:text-slate-700 text-lg">/</span>

        {/* Category (Academy/School/Holiday...) */}
        <div className="relative flex items-center bg-transparent">
          <Select
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              const matched = categories.find(c => c._id === val);
              onCategoryChange?.(val, matched?.name);
              if (matched) {
                const newPath = `/program/${matched.name.toLowerCase().replace(/\s+/g, '-')}`;
                navigate(newPath);
              }
            }}
            options={
              categories.length === 0
                ? [{ label: programType, value: "" }]
                : categories.map(cat => ({
                  label: cat.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
                  value: cat._id
                }))
            }
            triggerClassName="appearance-none flex items-center gap-1 text-xl font-bold text-[#0047FF] bg-transparent outline-none cursor-pointer pr-2 hover:opacity-80"
          />
        </div>

        <span className="text-slate-300 dark:text-slate-700 text-lg">/</span>

        {/* Sub-category (Programs like Elite Performance) */}
        <div className="relative flex items-center bg-transparent">
          <Select
            value={selectedProgram}
            onChange={(val) => {
              setSelectedProgram(val);
              const matched = programs.find(p => p._id === val);
              onProgramChange?.(val, matched?.name);
            }}
            options={
              programs.length === 0
                ? [{ label: "Sub-category", value: "" }]
                : programs.map(prog => ({
                  label: prog.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
                  value: prog._id
                }))
            }
            triggerClassName="appearance-none flex items-center gap-1 text-lg font-semibold text-slate-700 dark:text-slate-300 bg-transparent outline-none cursor-pointer pr-2 hover:opacity-80"
          />
        </div>

        <span className="text-slate-300 dark:text-slate-700 text-lg">/</span>

        {/* Year Dropdown */}
        <div className="relative flex items-center bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-none min-w-[90px]">
          <Select
            value={selectedYear}
            onChange={(val) => {
              setSelectedYear(val);
              onYearChange?.(val);
              const termsForNewYear = terms.filter(t => t.year.toString() === val);
              if (termsForNewYear.length > 0) {
                setSelectedTerm(termsForNewYear[0]._id);
              } else {
                setSelectedTerm("");
              }
            }}
            options={uniqueYears.map(year => ({ label: year, value: year }))}
            triggerClassName="appearance-none flex items-center justify-between w-full text-sm font-semibold text-slate-600 dark:text-slate-400 bg-transparent outline-none cursor-pointer pr-1"
          />
        </div>

        {/* Term Dropdown */}
        <div className="relative flex items-center bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-none min-w-[100px]">
          <Select
            value={selectedTerm}
            onChange={(val) => setSelectedTerm(val)}
            options={
              filteredTerms.length === 0
                ? [{ label: "Select Term", value: "" }]
                : filteredTerms.map(term => ({ label: term.name, value: term._id }))
            }
            triggerClassName="appearance-none flex items-center justify-between w-full text-sm font-semibold text-slate-600 dark:text-slate-400 bg-transparent outline-none cursor-pointer pr-1"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        {/* <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-none bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>New Trial</span>
        </button> */}

        <div className="relative">
          <select
            value={playerType}
            onChange={(e) => onPlayerTypeChange?.(e.target.value as "BOTH" | "ALLOCATED" | "UNALLOCATED")}
            className="appearance-none flex items-center gap-1.5 pl-3.5 pr-8 py-2 border border-slate-200 rounded-none bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="BOTH">Show All Players</option>
            <option value="ALLOCATED">Allocated Players</option>
            <option value="UNALLOCATED">Unallocated Players</option>
          </select>
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {(() => {
          const userStr = localStorage.getItem("user");
          let isCoach = false;
          if (userStr) {
            try {
              const parsed = JSON.parse(userStr);
              if (parsed?.role === "COACH") {
                isCoach = true;
              }
            } catch (e) {
              console.error(e);
            }
          }

          if (isCoach) return null;

          return (
            <>
              <button onClick={onOpenCreateClass} className="flex items-center gap-1.5 px-4 py-2 rounded-none bg-[#0047FF] hover:bg-[#003cc2] text-white shadow-theme-xs transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Create Class</span>
              </button>

              <button onClick={onOpenTermSettings} className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-none bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                <span>Term Settings</span>
              </button>
            </>
          );
        })()}
      </div>
    </div>
  );
}
