
interface PlayerStatsCardsProps {
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  eliteCount: number;
  schoolCount: number;
}

export default function PlayerStatsCards({
  totalCount,
  approvedCount,
  pendingCount,
  rejectedCount,
  eliteCount,
  schoolCount,
}: PlayerStatsCardsProps) {
  const stats = [
    {
      title: "Total Players",
      value: totalCount,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      title: "Approved",
      value: approvedCount,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Pending",
      value: pendingCount,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Rejected",
      value: rejectedCount,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Elite Players",
      value: eliteCount,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      title: "Schools Players",
      value: schoolCount,
      color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex items-center gap-3"
        >
          <div className={`p-2.5 rounded-lg shrink-0 ${stat.color}`}>{stat.icon}</div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              {stat.title}
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
