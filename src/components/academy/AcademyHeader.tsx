import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";

interface AcademyHeaderProps {
  programType?: string;
  onCategoryChange?: (categoryId: string) => void;
  onProgramChange?: (programId: string) => void;
}

export default function AcademyHeader({ programType = "Academy", onCategoryChange, onProgramChange }: AcademyHeaderProps) {
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
        const catRes = await apiClient.get("/api/user/getCategories");
        if (catRes.data && Array.isArray(catRes.data)) {
          setCategories(catRes.data);
          // Find the category matching the programType (e.g. "Academy" -> "ACADEMY")
          const matched = catRes.data.find(c => c.name.toLowerCase() === programType.toLowerCase());
          if (matched) {
            setSelectedCategory(matched._id);
            onCategoryChange?.(matched._id);
          } else if (catRes.data.length > 0) {
            setSelectedCategory(catRes.data[0]._id);
            onCategoryChange?.(catRes.data[0]._id);
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
            onProgramChange?.(programsRes.data[0]._id);
          } else {
            setSelectedProgram("");
            onProgramChange?.("");
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
            const firstTerm = allTerms[0];
            setSelectedYear(firstTerm.year.toString());
            setSelectedTerm(firstTerm._id);
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

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    const termsForNewYear = terms.filter(t => t.year.toString() === newYear);
    if (termsForNewYear.length > 0) {
      setSelectedTerm(termsForNewYear[0]._id);
    } else {
      setSelectedTerm("");
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6 xl:flex-row xl:items-center xl:justify-between">
      {/* Title & Dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Programs (Static) */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Programs</h1>
          <svg className="w-4 h-4 text-slate-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <span className="text-slate-300 dark:text-slate-700 text-lg">/</span>

        {/* Category (Academy/School/Holiday...) */}
        <div className="relative flex items-center bg-transparent">
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              onCategoryChange?.(e.target.value);
            }}
            className="appearance-none text-xl font-bold text-[#0047FF] bg-transparent outline-none cursor-pointer pr-6"
          >
            {categories.length === 0 && <option value="">{programType}</option>}
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="text-base font-normal text-slate-900">
                {cat.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
              </option>
            ))}
          </select>
          <svg className="absolute right-0 w-4 h-4 text-[#0047FF] pointer-events-none mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <span className="text-slate-300 dark:text-slate-700 text-lg">/</span>

        {/* Sub-category (Programs like Elite Performance) */}
        <div className="relative flex items-center bg-transparent">
          <select 
            value={selectedProgram}
            onChange={(e) => {
              setSelectedProgram(e.target.value);
              onProgramChange?.(e.target.value);
            }}
            className="appearance-none text-lg font-semibold text-slate-700 dark:text-slate-300 bg-transparent outline-none cursor-pointer pr-6"
          >
            {programs.length === 0 && <option value="">Sub-category</option>}
            {programs.map((prog) => (
              <option key={prog._id} value={prog._id} className="text-base font-normal text-slate-900">
                {prog.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
              </option>
            ))}
          </select>
          <svg className="absolute right-0 w-4 h-4 text-slate-400 pointer-events-none mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <span className="text-slate-300 dark:text-slate-700 text-lg">/</span>

        {/* Year Dropdown */}
        <div className="relative flex items-center bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          <select 
            value={selectedYear}
            onChange={handleYearChange}
            className="appearance-none text-sm font-bold text-slate-700 dark:text-slate-300 bg-transparent outline-none cursor-pointer pr-5"
          >
            {uniqueYears.length === 0 && <option value="2026">2026</option>}
            {uniqueYears.map((year) => (
              <option key={year} value={year} className="text-base font-normal text-slate-900">{year}</option>
            ))}
          </select>
          <svg className="absolute right-1.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Term Dropdown */}
        <div className="relative flex items-center bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          <select 
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="appearance-none text-sm font-bold text-slate-700 dark:text-slate-300 bg-transparent outline-none cursor-pointer pr-5"
          >
            {filteredTerms.length === 0 && <option value="">Term 2</option>}
            {filteredTerms.map((term) => (
              <option key={term._id} value={term._id} className="text-base font-normal text-slate-900">{term.name}</option>
            ))}
          </select>
          <svg className="absolute right-1.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>New Trial</span>
        </button>

        <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Add Player</span>
        </button>

        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0047FF] hover:bg-[#003cc2] text-white shadow-theme-xs transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Create Class</span>
        </button>

        <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          <span>Term Settings</span>
        </button>
      </div>
    </div>
  );
}
