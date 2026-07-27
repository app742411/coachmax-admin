import { Modal } from "../ui/modal";
import { UnallocatedPlayer } from "../../types/academy";

interface PlayersListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  players: UnallocatedPlayer[];
}

export default function PlayersListModal({ isOpen, onClose, title, players }: PlayersListModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-850 dark:text-white uppercase tracking-wider">{title}</h2>
            <span className="bg-blue-50 text-[#0047FF] text-xs font-bold px-2 py-0.5 rounded-full dark:bg-blue-950/20 dark:text-blue-400">
              {players.length} Players
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
          {players.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">
              No players found in this list.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((p) => (
                <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="flex items-start gap-4">
                    
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                        <span className="flex items-center justify-center w-5 h-5 bg-blue-50 text-[#0047FF] text-[8px] font-bold rounded-full dark:bg-blue-900/40 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-800/50">
                          {p.programCode}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1 pt-1">
                      <h4 className="text-sm font-bold text-slate-850 dark:text-white truncate pr-2">
                        {p.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 uppercase tracking-wide">
                        {p.details}
                      </p>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-400 min-w-[60px]">Program:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {p.fullProgramName || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-400 min-w-[60px]">Category:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {p.categoryName || "N/A"}
                          </span>
                        </div>
                        {p.termName && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-slate-400 min-w-[60px]">Term:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                              {p.termName}
                            </span>
                          </div>
                        )}
                        {p.preferredClasses && p.preferredClasses.length > 0 && (
                          <div className="flex items-start gap-1.5 text-xs pt-1">
                            <span className="text-slate-400 min-w-[60px] pt-0.5">Classes:</span>
                            <div className="flex flex-wrap gap-1">
                              {p.preferredClasses.map(c => (
                                <span key={c.id} className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                                  {c.dayOfWeek.substring(0, 3)} {c.startTime}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-end">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                          REQ: {p.requested}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </Modal>
  );
}
