import { Player } from "../../types/player";

interface PlayerTableProps {
  players: Player[];
  selectedPlayerId: string;
  onSelectPlayer: (player: Player) => void;
  onDeletePlayer?: (player: Player) => void;
}

export default function PlayerTable({
  players,
  selectedPlayerId,
  onSelectPlayer,
  onDeletePlayer,
}: PlayerTableProps) {
  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500 justify-center">
        {Array.from({ length: 5 }).map((_, idx) => (
          <svg
            key={idx}
            className={`w-3.5 h-3.5 ${
              idx < count ? "fill-current" : "text-slate-200 dark:text-slate-700"
            }`}
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
    <div className="bg-white border border-slate-100 rounded-none shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-[40px]">#</th>
              <th className="py-3 px-3 min-w-[70px]">Status</th>
              <th className="py-3 px-3 min-w-[150px]">Player</th>
              <th className="py-3 px-3 min-w-[90px]">DOB</th>
              <th className="py-3 px-3 min-w-[140px]">Medical Conditions</th>
              <th className="py-3 px-3 min-w-[60px] text-center">Jersey #</th>
              <th className="py-3 px-3 min-w-[90px] text-center">Skill</th>
              <th className="py-3 px-3 min-w-[50px] text-center">Foot</th>
              <th className="py-3 px-3 min-w-[120px]">Contact</th>
              <th className="py-3 px-3 min-w-[160px]">Email</th>
              <th className="py-3 px-3 min-w-[110px]">Phone</th>
              <th className="py-3 px-4 w-[50px] text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => {
              const status = "Paid"; // Fallback as not in backend
              const avatar = player.parentId?.userId?.profileImage || `https://ui-avatars.com/api/?name=${player.name}`;
              const skillNum = player.skillLevel === "BEGINNER" ? 1 : player.skillLevel === "INTERMEDIATE" ? 3 : 5;
              return (
              <tr
                key={player._id}
                onClick={() => onSelectPlayer(player)}
                className={`border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-all ${
                  selectedPlayerId === player._id ? "bg-slate-50 dark:bg-slate-800/40" : ""
                }`}
              >
                <td className="py-4 px-4 font-semibold text-slate-500">{idx + 1}</td>
                <td className="py-4 px-3">
                  <span
                    className={`inline-flex items-center gap-1 font-bold ${
                      status === "Paid" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        status === "Paid" ? "bg-emerald-600" : "bg-rose-600"
                      }`}
                    />
                    {status}
                  </span>
                </td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={avatar}
                      alt={player.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{player.name}</span>
                  </div>
                </td>
                <td className="py-4 px-3 font-semibold text-slate-500">{new Date(player.dob).toLocaleDateString()}</td>
                <td className="py-4 px-3">
                  <span
                    className={
                      player.medicalConditions !== "None"
                        ? "text-rose-600 font-bold"
                        : "text-slate-500 font-semibold"
                    }
                  >
                    {player.medicalConditions || "None"}
                  </span>
                </td>
                <td className="py-4 px-3 font-semibold text-slate-700 dark:text-slate-300 text-center">
                  {player.jerseyNumber}
                </td>
                <td className="py-4 px-3 text-center">{renderStars(skillNum)}</td>
                <td className="py-4 px-3 font-bold text-slate-600 dark:text-slate-400 text-center">
                  {player.preferredFoot === "LEFT" ? "L" : "R"}
                </td>
                <td className="py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">
                  {player.parentId?.userId?.name || "N/A"}
                </td>
                <td className="py-4 px-3 font-medium text-slate-500 dark:text-slate-400 underline">
                  {player.parentId?.userId?.email || "N/A"}
                </td>
                <td className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">
                  {player.parentId?.phone || "N/A"}
                </td>
                <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      title="More Options"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    {onDeletePlayer && (
                      <button 
                        className="text-rose-400 hover:text-rose-600 p-1"
                        title="Delete Player"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete this player?")) {
                            onDeletePlayer(player);
                          }
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
