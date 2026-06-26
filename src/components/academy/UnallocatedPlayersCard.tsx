import { UnallocatedPlayer } from "../../types/academy";

interface UnallocatedPlayersCardProps {
  players: UnallocatedPlayer[];
}

export default function UnallocatedPlayersCard({ players }: UnallocatedPlayersCardProps) {
  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, idx) => (
          <svg
            key={idx}
            className={`w-2.5 h-2.5 ${idx < count ? "fill-current" : "text-slate-200 dark:text-slate-700"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.53 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-4 rounded-xl shadow-theme-xs mb-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Unallocated Players
          </h3>
          <span className="bg-blue-50 text-[#0047FF] text-[10px] font-bold px-1.5 py-0.5 rounded-full dark:bg-blue-950/20 dark:text-blue-400">
            {players.length}
          </span>
        </div>
        <a href="#unallocated" className="text-[10px] font-semibold text-[#0047FF] hover:underline">
          View all
        </a>
      </div>

      <div className="space-y-3.5 mb-4">
        {players.map((p) => (
          <div key={p.id} className="flex gap-3 items-start justify-between">
            <div className="flex gap-2 min-w-0">
              <img
                src={p.avatar}
                alt={p.name}
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-100"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 leading-tight">
                  {p.name}
                </h4>
                <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                  {p.details}
                </span>
                <div className="mt-1">{renderStars(p.rating)}</div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Requested</span>
              <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold block mt-0.5">
                {p.requested}
              </span>
              <div className="mt-1 flex justify-end">
                <span className="text-[8px] font-bold text-[#0047FF] bg-blue-50 px-1 py-0.5 rounded uppercase dark:bg-blue-950/20 dark:text-blue-400">
                  {p.programCode}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drag area */}
      <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-center gap-2">
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
