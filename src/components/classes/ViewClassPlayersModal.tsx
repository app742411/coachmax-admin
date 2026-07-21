import { Modal } from "../../components/ui/modal";
import { useClassPlayers } from "../../hooks/usePlayers";

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

  const classData = data?.class;
  const players = data?.players || [];
  const totalPlayers = data?.totalPlayers || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl p-0 overflow-hidden bg-white dark:bg-slate-900 rounded-none" showCloseButton={true}>
      <div className="flex flex-col h-full max-h-[85vh] p-8">
        
        {/* Top Info Card */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-none p-5 mb-8 bg-white dark:bg-slate-900 shadow-sm flex items-center flex-wrap gap-y-4">
          <div className="flex-1 min-w-[150px] px-2 border-r border-slate-100 dark:border-slate-800 last:border-0">
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase">Session ID</span>
            <div className="font-bold text-slate-900 dark:text-white text-base mt-1.5">{classData?.name || "summer class"}</div>
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
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">{totalPlayers} MEMBERS IDENTIFED</span>
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
                  <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 text-center w-[35%]">Operational Stats</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player: any) => (
                  <tr
                    key={player._id}
                    className="border-b border-slate-50 dark:border-slate-800/40 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 pl-4">
                        <div className="w-10 h-10 shrink-0 bg-[#101828] dark:bg-slate-700 text-white rounded-none flex items-center justify-center text-xs font-bold shadow-sm">
                          {player.jerseyNumber || "-"}
                        </div>
                        <div className="font-bold text-slate-700 dark:text-slate-200 text-[13px]">
                          {player.fullName || `${player.firstName} ${player.lastName}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[11px] text-slate-500 italic mb-0.5">{player.email}</span>
                        <span className="text-[12px] font-bold text-[#00b2ff] dark:text-[#336eff] tracking-wide">{player.phone || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {player.preferredFoot && (
                          <span className="bg-[#eff6ff] text-[#3b82f6] dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-none text-[10px] font-bold tracking-wider uppercase">
                            {player.preferredFoot}
                          </span>
                        )}
                        {player.skillLevel && (
                          <span className="bg-[#fef2f2] text-[#ef4444] dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-none text-[10px] font-bold tracking-wider uppercase">
                            LVL {player.skillLevel}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
}
