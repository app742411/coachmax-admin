import { useExportUsersCSV } from "../../hooks/usePlayers";

interface PlayerFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  programFilter: string;
  setProgramFilter: (program: string) => void;
  ageFilter: string;
  setAgeFilter: (age: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export default function PlayerFilters({
  searchQuery,
  setSearchQuery,
  programFilter,
  setProgramFilter,
  ageFilter,
  setAgeFilter,
  statusFilter,
  setStatusFilter,
}: PlayerFiltersProps) {
  const exportCSVMutation = useExportUsersCSV();

  return (
    <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-2xl shadow-theme-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search player by name, contact, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 outline-none text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
          >
            <option value="All">Program Type: All</option>
            <option value="School">School</option>
            <option value="Academy">Academy</option>
          </select>
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 outline-none text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
          >
            <option value="All">Age Group: All</option>
            <option value="U10">U9 - U10</option>
            <option value="U12">U11 - U12</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 outline-none text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-semibold text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>More Filters</span>
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0047FF] hover:bg-[#003cc2] font-semibold text-white transition-all shadow-theme-xs">
            <span>+ Add Player</span>
          </button>
        </div>
      </div>

      {/* Bulk actions and export */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <button className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
          <span>Bulk Actions</span>
          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex gap-2">
          <button 
            onClick={() => exportCSVMutation.mutate(statusFilter === "All" ? "APPROVED" : statusFilter)}
            disabled={exportCSVMutation.isPending}
            className="px-3.5 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{exportCSVMutation.isPending ? "Exporting..." : "Export"}</span>
          </button>
          <button className="px-3.5 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
            </svg>
            <span>Columns</span>
          </button>
        </div>
      </div>
    </div>
  );
}
