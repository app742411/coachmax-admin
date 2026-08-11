import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import { useClassPlayers } from "../../hooks/usePlayers";
import PlayerDetailCard from "../players/PlayerDetailCard";

interface ViewClassPlayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string | null;
}

export default function ViewClassPlayersModal({
  isOpen,
  onClose,
  classId,
}: ViewClassPlayersModalProps) {
  const { data, isLoading, isError } = useClassPlayers(classId || "");
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);

  const classData = data?.class || data?.data;
  const players = data?.players || data?.data?.players || [];
  const totalPlayers = data?.totalPlayers !== undefined ? data.totalPlayers : (data?.data?.totalPlayers !== undefined ? data.data.totalPlayers : players.length);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl p-0 overflow-hidden bg-white dark:bg-slate-900 rounded-none" showCloseButton={false}>
        {/* Header Section matching Create Class UI */}
        <div className="relative overflow-hidden bg-[#0A1930] px-8 py-5 text-white border-l-[6px] border-[#0047FF]">
          {/* Faint Pitch Schematic Background */}
          <svg className="absolute right-0 top-0 h-full w-auto opacity-10 pointer-events-none text-white/70" viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="0.8">
            <rect x="2" y="2" width="116" height="76" rx="2" />
            <line x1="60" y1="2" x2="60" y2="78" />
            <circle cx="60" cy="40" r="15" />
            <circle cx="60" cy="40" r="1" fill="currentColor" />
            <path d="M 2 20 L 18 20 L 18 60 L 2 60" />
            <path d="M 118 20 L 102 20 L 102 60 L 118 60" />
            <path d="M 2 28 L 8 28 L 8 52 L 2 52" />
            <path d="M 118 28 L 112 28 L 112 52 L 118 52" />
          </svg>

          {/* Dotted Grid Accent */}
          <div className="absolute right-12 bottom-4 grid grid-cols-5 gap-1 opacity-60">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[#0047FF]" />
            ))}
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-white/5 text-white">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wide text-white">
                  Class Active Roster
                </h3>
                <p className="text-xs text-gray-300 mt-1 font-medium">
                  Explore enrolled participants, contact access information, and parent credentials.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col h-full max-h-[70vh] p-8 overflow-y-auto">
          {/* Top Info Card */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-none p-5 mb-8 bg-white dark:bg-slate-900 shadow-sm flex items-center flex-wrap gap-y-4">
            <div className="flex-1 min-w-[150px] px-2 border-r border-slate-100 dark:border-slate-800 last:border-0">
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase">Session ID</span>
              <div className="font-bold text-slate-900 dark:text-white text-base mt-1.5">{classData?.name || classData?.className || "summer class"}</div>
            </div>
            <div className="flex-1 min-w-[150px] px-6 border-r border-slate-100 dark:border-slate-800 last:border-0">
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase">Schedule</span>
              <div className="font-bold text-slate-700 dark:text-slate-300 text-sm mt-1.5">{classData?.dayOfWeek || "TUESDAY"}</div>
              <div className="text-[11px] font-semibold text-[#0047FF] mt-0.5">{classData?.startTime || "09:00"} - {classData?.endTime || "10:00"}</div>
            </div>
            <div className="flex-1 min-w-[150px] px-6 border-r border-slate-100 dark:border-slate-800 last:border-0">
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase">Classification</span>
              <div className="font-bold text-slate-900 dark:text-white text-sm mt-1.5">{classData?.category?.name || "ACADEMY"}</div>
            </div>
            <div className="flex-1 min-w-[150px] px-6">
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase">Instruction</span>
              <div className="font-bold text-slate-900 dark:text-white text-sm mt-1.5">{classData?.coach?.name || classData?.coach?.email || "anand coach"}</div>
            </div>
          </div>

          {/* Middle Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 border-b-2 border-[#031549] dark:border-[#336eff] pb-1">
              <svg className="w-5 h-5 text-[#031549] dark:text-[#336eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-sm font-bold text-[#031549] dark:text-white tracking-widest uppercase">Active Roster</h3>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">{totalPlayers} MEMBERS IDENTIFIED</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto custom-scrollbar border border-slate-50 dark:border-slate-800 rounded-none">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 font-semibold">Loading roster...</div>
            ) : isError ? (
              <div className="p-8 text-center text-rose-500 font-semibold">
                Failed to load players. Please try again.
              </div>
            ) : players.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-semibold">
                No players enrolled in this class.
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm z-10">
                  <tr className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.15em]">
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 text-center w-[30%]">Participant</th>
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 text-center w-[35%]">Contact Access</th>
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 text-center w-[35%]">Parent Details</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player: any) => (
                    <tr
                      key={player._id}
                      className="border-b border-slate-50 dark:border-slate-800/40 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedPlayer(player)}
                          className="flex items-center gap-4 pl-4 text-left hover:opacity-80 transition-opacity"
                        >
                          <div className="w-10 h-10 shrink-0 bg-[#101828] dark:bg-slate-700 text-white rounded-none flex items-center justify-center text-xs font-bold shadow-sm">
                            {player.jerseyNumber || "-"}
                          </div>
                          <div className="font-bold text-slate-700 dark:text-slate-200 text-[13px] hover:text-[#0047FF] dark:hover:text-[#336eff]">
                            {player.fullName || `${player.firstName} ${player.lastName}`}
                          </div>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[11px] text-slate-500 italic mb-0.5">{player.email || "No Email"}</span>
                          <span className="text-[12px] font-bold text-[#00b2ff] dark:text-[#336eff] tracking-wide">{player.phone || "No Phone"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {player.parent ? (
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{player.parent.fullName || player.parent.name}</span>
                            <span className="text-[11px] text-slate-500 mt-0.5">{player.parent.phone} / {player.parent.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Modal>

      {selectedPlayer && (
        <PlayerDetailCard
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </>
  );
}
