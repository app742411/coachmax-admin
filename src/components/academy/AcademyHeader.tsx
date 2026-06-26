
interface AcademyHeaderProps {
  programType?: "Academy" | "School";
}

export default function AcademyHeader({ programType = "Academy" }: AcademyHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6 xl:flex-row xl:items-center xl:justify-between">
      {/* Title & Dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Programs</h1>
          <svg className="w-4 h-4 text-slate-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <span className="text-slate-300 dark:text-slate-700 text-lg">/</span>

        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="text-xl font-bold text-slate-900 dark:text-white">{programType}</span>
          <svg className="w-4 h-4 text-slate-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <span className="text-slate-300 dark:text-slate-700 text-lg">/</span>

        <div className="flex items-center gap-1.5 cursor-pointer bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">2026</span>
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="flex items-center gap-1.5 cursor-pointer bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Term 2</span>
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
