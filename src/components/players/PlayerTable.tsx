import { useState, useEffect } from "react";
import { Player } from "../../types/player";

interface PlayerTableProps {
  players: Player[];
  selectedPlayerId: string;
  onSelectPlayer: (player: Player) => void;
  onDeletePlayer?: (player: Player) => void;
  onApprovePlayer?: (player: Player) => void;
  onRejectPlayer?: (player: Player) => void;
}

export default function PlayerTable({
  players,
  selectedPlayerId,
  onSelectPlayer,
  onDeletePlayer,
  onApprovePlayer,
  onRejectPlayer,
}: PlayerTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-slate-100 rounded-none shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-visible">
      <div className="overflow-visible no-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-[40px]">#</th>
              <th className="py-3 px-3 min-w-[70px]">Status</th>
              <th className="py-3 px-3 min-w-[150px]">Player</th>
              <th className="py-3 px-3 min-w-[90px]">DOB</th>
              <th className="py-3 px-3 min-w-[140px]">School</th>
              <th className="py-3 px-3 min-w-[60px] text-center">Jersey #</th>
              <th className="py-3 px-3 min-w-[90px] text-center">Program</th>
              <th className="py-3 px-3 min-w-[50px] text-center">Foot</th>
              <th className="py-3 px-3 min-w-[120px]">Contact</th>
              <th className="py-3 px-3 min-w-[160px]">Email</th>
              <th className="py-3 px-3 min-w-[110px]">Phone</th>
              <th className="py-3 px-4 w-[50px] text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => {
              const status = player.status || "PENDING";
              const avatar = player.profileImage ? `/${player.profileImage}` : `https://ui-avatars.com/api/?name=${player.fullName}`;
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
                      status === "APPROVED" ? "text-emerald-600" : status === "REJECTED" ? "text-rose-600" : "text-amber-500"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        status === "APPROVED" ? "bg-emerald-600" : status === "REJECTED" ? "bg-rose-600" : "bg-amber-500"
                      }`}
                    />
                    {status}
                  </span>
                </td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={avatar}
                      alt={player.fullName}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{player.fullName}</span>
                  </div>
                </td>
                <td className="py-4 px-3 font-semibold text-slate-500">{player.dob ? new Date(player.dob).toLocaleDateString() : "N/A"}</td>
                <td className="py-4 px-3">
                  <span className="text-slate-500 font-semibold">
                    {player.school || "N/A"}
                  </span>
                </td>
                <td className="py-4 px-3 font-semibold text-slate-700 dark:text-slate-300 text-center">
                  {player.jerseyNumber || "N/A"}
                </td>
                <td className="py-4 px-3 text-center font-bold text-slate-600 dark:text-slate-400">
                  {player.program?.name || "N/A"}
                </td>
                <td className="py-4 px-3 font-bold text-slate-600 dark:text-slate-400 text-center">
                  {player.preferredFoot === "LEFT" ? "L" : player.preferredFoot === "RIGHT" ? "R" : "-"}
                </td>
                <td className="py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">
                  {player.parentId?.fullName || "N/A"}
                </td>
                <td className="py-4 px-3 font-medium text-slate-500 dark:text-slate-400 underline">
                  {player.parentId?.email || "N/A"}
                </td>
                <td className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">
                  {player.parentId?.phone || "N/A"}
                </td>
                <td className="py-4 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="More Options"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === player._id ? null : player._id);
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  {openDropdownId === player._id && (
                    <div className="absolute right-8 top-10 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      {onApprovePlayer && (
                        <button 
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onApprovePlayer(player);
                            setOpenDropdownId(null);
                          }}
                        >
                          Approve Player
                        </button>
                      )}
                      {onRejectPlayer && (
                        <button 
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRejectPlayer(player);
                            setOpenDropdownId(null);
                          }}
                        >
                          Reject Player
                        </button>
                      )}
                      {onDeletePlayer && (
                        <button 
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-700 mt-1 pt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Are you sure you want to delete this player?")) {
                              onDeletePlayer(player);
                            }
                            setOpenDropdownId(null);
                          }}
                        >
                          Delete Player
                        </button>
                      )}
                    </div>
                  )}
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
