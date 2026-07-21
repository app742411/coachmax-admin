import { Modal } from "../ui/modal";
import { UnallocatedPlayer } from "../../types/academy";

interface PlayersListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  players: UnallocatedPlayer[];
}

export default function PlayersListModal({ isOpen, onClose, title, players }: PlayersListModalProps) {
  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, idx) => (
          <svg
            key={idx}
            className={`w-3 h-3 ${idx < count ? "fill-current" : "text-slate-200 dark:text-slate-700"}`}
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
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {renderStars(p.rating)}
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
