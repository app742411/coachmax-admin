import { useExportUsersCSV } from "../../hooks/usePlayers";

import Select from "../form/Select";

interface PlayerFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  programFilter: string;
  setProgramFilter: (program: string) => void;
  ageFilter: string;
  setAgeFilter: (age: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  medicalFilter?: string;
  setMedicalFilter?: (val: string) => void;
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
  medicalFilter = "All",
  setMedicalFilter = () => { },
}: PlayerFiltersProps) {
  const exportCSVMutation = useExportUsersCSV();

  return (
    <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-none shadow-theme-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between mb-4">
        <div className="relative flex-1 max-w-md w-full">
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
            className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 rounded-none outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs w-full lg:w-auto">
          <button
            onClick={() => exportCSVMutation.mutate(statusFilter === "All" ? "APPROVED" : statusFilter)}
            disabled={exportCSVMutation.isPending}
            className="px-3.5 py-1.5 border border-slate-200 text-xs font-semibold rounded-none bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{exportCSVMutation.isPending ? "Exporting..." : "Export"}</span>
          </button>
          <div className="w-full sm:w-40 flex-1 sm:flex-initial min-w-[130px]">
            <Select
              value={programFilter}
              onChange={(val) => setProgramFilter(val)}
              options={[
                { label: "Program Type: All", value: "All" },
                { label: "School", value: "School" },
                { label: "Academy", value: "Academy" }
              ]}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-40 flex-1 sm:flex-initial min-w-[130px]">
            <Select
              value={ageFilter}
              onChange={(val) => setAgeFilter(val)}
              options={[
                { label: "Age Group: All", value: "All" },
                { label: "U9 - U10", value: "U10" },
                { label: "U11 - U12", value: "U12" }
              ]}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-36 flex-1 sm:flex-initial min-w-[120px]">
            <Select
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={[
                { label: "Status: All", value: "All" },
                { label: "Paid", value: "Paid" },
                { label: "Unpaid", value: "Unpaid" }
              ]}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-36 flex-1 sm:flex-initial min-w-[120px]">
            <Select
              value={medicalFilter}
              onChange={(val) => setMedicalFilter && setMedicalFilter(val)}
              options={[
                { label: "Medical: All", value: "All" },
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
              ]}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
