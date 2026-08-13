import { UnallocatedPlayer } from "../../types/academy";

interface UnallocatedPlayersCardProps {
  players: UnallocatedPlayer[];
  totalCount: number;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore?: boolean;
  onAssignPlayer?: (player: any) => void;
  onViewAll?: () => void;
}

export default function UnallocatedPlayersCard({
  players,
  totalCount,
  hasMore,
  onLoadMore,
  isLoadingMore,
  onAssignPlayer,
  onViewAll
}: UnallocatedPlayersCardProps) {
  return (
    <div className="bg-white border border-slate-200 dark:border-slate-700 dark:bg-slate-900 p-4 rounded-none shadow-sm mb-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Unallocated Players
          </h3>
          <span className="bg-blue-50 text-[#0047FF] text-[10px] font-bold px-1.5 py-0.5 rounded-full dark:bg-blue-950/20 dark:text-blue-400">
            {totalCount}
          </span>
        </div>
        <button
          onClick={onViewAll}
          className="text-[10px] font-semibold text-[#0047FF] hover:underline bg-transparent border-none cursor-pointer"
        >
          View all
        </button>
      </div>

      <div className="space-y-3.5 mb-4">
        {players.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-semibold">
            No unallocated players
          </div>
        ) : (
          players.map((p) => (
            <div
              key={p.id}
              className="flex gap-3 items-start justify-between cursor-move hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-md transition-all p-2.5 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", JSON.stringify({
                  playerId: p.id,
                  registrationRequestId: p.registrationRequestId,
                  paymentStatus: p.paymentStatus || "TRIAL",
                  categoryId: p.categoryId,
                  programId: p.programId,
                  categoryName: p.categoryName,
                  programName: p.fullProgramName,
                  preferredClasses: p.preferredClasses || []
                }));
              }}
            >
              <div className="flex gap-2 min-w-0 flex-1 pr-2">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-100"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 leading-tight truncate">
                    {p.name}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.categoryName && p.categoryName !== "N/A" && (
                      <span className="text-[8px] text-slate-500 font-semibold border border-slate-200 dark:border-slate-700 px-1 py-0.5 rounded uppercase whitespace-nowrap">
                        {p.categoryName}
                      </span>
                    )}
                    {p.fullProgramName && p.fullProgramName !== "N/A" && (
                      <span className="text-[8px] text-slate-500 font-semibold border border-slate-200 dark:border-slate-700 px-1 py-0.5 rounded uppercase whitespace-nowrap">
                        {p.fullProgramName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[8px] text-slate-500 font-semibold bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded uppercase whitespace-nowrap">
                      {p.details}
                    </span>
                    {p.termName && (
                      <span className="text-[8px] text-slate-500 font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-1 py-0.5 rounded uppercase whitespace-nowrap">
                        {p.termName}
                      </span>
                    )}
                  </div>

                  {p.preferredClasses && p.preferredClasses.length > 0 && (
                    <div className="mt-1 w-full">
                      <style>{`
                        .no-scrollbar::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                      <div className="flex gap-1 no-scrollbar w-full overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {p.preferredClasses.map(c => (
                          <span key={c.id} className="text-[8px] bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                            {c.dayOfWeek.substring(0, 3)} {c.startTime}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {onAssignPlayer && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignPlayer(p);
                      }}
                      className="mt-2.5 w-full flex items-center justify-center gap-1 py-1 px-2 border border-[#0047FF] hover:bg-[#0047FF] text-[#0047FF] hover:text-white dark:hover:bg-blue-950/20 text-[9px] font-bold transition-all rounded-none cursor-pointer"
                      title="Assign to the currently opened class"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Assign to Class</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Requested</span>
                <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold block mt-0.5">
                  {p.requested}
                </span>
                <div className="mt-1 flex justify-end">
                  <span className="text-[8px] font-bold text-[#0047FF] bg-blue-50 px-1 py-0.5 rounded-none uppercase dark:bg-blue-950/20 dark:text-blue-400">
                    {p.programCode}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-2 pb-4 border-t border-slate-100 dark:border-slate-800 mb-3">
          <button
            type="button"
            disabled={isLoadingMore}
            onClick={onLoadMore}
            className="w-full py-2 text-[9px] font-bold border border-slate-200 dark:border-slate-850 text-[#0047FF] hover:bg-[#0047FF]/5 disabled:opacity-50 rounded transition-all cursor-pointer select-none"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Drag area */}
      <div
        onClick={onViewAll}
        className="border border-dashed border-slate-200 dark:border-slate-800 rounded-none p-3 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-950/30 transition-all select-none"
      >
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.57V10c0-1.105-.895-2-2-2S5 8.895 5 10v1.57c0 1.253.208 2.457.59 3.58m1.282.59A13.917 13.917 0 0012 11.57V10a5 5 0 0110 0v1.57c0 1.253-.208 2.457-.59 3.58m-1.283.59A13.917 13.917 0 0014 11.57V10m0 0a2 2 0 10-4 0M12 2v4M12 6H8m4 0h4" />
        </svg>
        <span className="text-[10px] text-slate-500 font-semibold text-center leading-normal">
          Drag player to allocate to a class <br />
          or click to view all
        </span>
      </div>
    </div>
  );
}
