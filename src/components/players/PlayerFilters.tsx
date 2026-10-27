import { ageGroupForYear } from "../../utils/dateTime";
import { useExportUsersCSV } from "../../hooks/usePlayers";
import { useTerms } from "../../hooks/useTerms";
import { useCategories } from "../../hooks/useCategories";
import { useProgramsByCategory } from "../../hooks/usePrograms";
import Select from "../form/Select";

interface PlayerFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  termFilter?: string;
  setTermFilter?: (term: string) => void;
  programFilter: string;
  setProgramFilter: (program: string) => void;
  subProgramFilter?: string;
  setSubProgramFilter?: (program: string) => void;
  filterPlayers?: any[];
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
  termFilter = "All",
  setTermFilter = () => { },
  programFilter,
  setProgramFilter,
  subProgramFilter = "All",
  setSubProgramFilter = () => { },
  filterPlayers: filterPlayersProp,
  ageFilter,
  setAgeFilter,
  statusFilter,
  setStatusFilter,
  medicalFilter = "All",
  setMedicalFilter = () => { },
}: PlayerFiltersProps) {
  const exportCSVMutation = useExportUsersCSV();
  const { terms = [] } = useTerms({ isEvent: "all" });
  const { categories = [] } = useCategories({ isEvent: "all" });
  const filterPlayers = filterPlayersProp || [];

  const selectedCategory = categories.find(
    (category) => category.name?.toLowerCase() === programFilter.toLowerCase()
  );
  const { programs: categoryPrograms = [] } = useProgramsByCategory(selectedCategory?._id);

  const subProgramOptions = Array.from(
    new Map(categoryPrograms.map((program) => [program._id, program.name])).entries()
  ).sort(([, first], [, second]) => String(first).localeCompare(String(second)));

  const programTypeOptions = [
    { label: "Program Type: All", value: "All" },
    ...categories
      .filter((category) => category.name)
      .map((category) => ({ label: category.name, value: category.name })),
  ];

  const ageOptions = Array.from(
    new Set(
      filterPlayers
        .map((player) => {
          const selectedTerm = terms.find((term) => term._id === termFilter);
          return ageGroupForYear(player.dob, selectedTerm?.year);
        })
        .filter((age): age is number => age !== null)
    )
  ).sort((first, second) => first - second);

  const ageSelectOptions = filterPlayersProp
    ? ageOptions.map((age) => ({ label: `U${age}`, value: `U${age}` }))
    : [
      { label: "U6 - U8", value: "U6-U8" },
      { label: "U9 - U10", value: "U9-U10" },
      { label: "U11 - U12", value: "U11-U12" },
      { label: "U13 - U14", value: "U13-U14" },
      { label: "U15+", value: "U15+" },
    ];

  const termOptions = [
    { label: "Term: All", value: "All" },
    ...(terms || []).map((t) => ({
      label: t.name ? (t.year ? `${t.name} (${t.year})` : t.name) : "Unnamed Term",
      value: t._id,
    })),
  ];

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
          <div className="w-full sm:w-44 flex-1 sm:flex-initial min-w-[140px]">
            <Select
              value={termFilter}
              onChange={(val) => setTermFilter(val)}
              options={termOptions}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-40 flex-1 sm:flex-initial min-w-[130px]">
            <Select
              value={programFilter}
              onChange={(val) => {
                setProgramFilter(val);
                setSubProgramFilter("All");
              }}
              options={programTypeOptions}
              className="w-full"
            />
          </div>
          {filterPlayersProp && programFilter !== "All" && (
            <div className="w-full sm:w-40 flex-1 sm:flex-initial min-w-[130px]">
              <Select
                value={subProgramFilter}
                onChange={(val) => setSubProgramFilter(val)}
                options={[
                  { label: "Sub Program: All", value: "All" },
                  ...subProgramOptions.map(([value, label]) => ({ label: String(label), value: String(value) })),
                ]}
                className="w-full"
              />
            </div>
          )}
          <div className="w-full sm:w-36 flex-1 sm:flex-initial min-w-[120px]">
            <Select
              value={ageFilter}
              onChange={(val) => setAgeFilter(val)}
              options={[
                { label: "Age Group: All", value: "All" },
                ...ageSelectOptions,
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
                { label: "PAID", value: "PAID" },
                { label: "HANDSHAKE", value: "HANDSHAKE" },
                { label: "APPROVED (UNPAID)", value: "UNPAID" },
                { label: "TRIAL", value: "TRIAL" },
                { label: "TBC", value: "TBC" },
                { label: "EXTRA", value: "EXTRA" },
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
