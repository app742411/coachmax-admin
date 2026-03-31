import { useState } from "react";
import { X, Trophy, Save, UserPlus, CheckCircle2, Zap } from "lucide-react";
import Badge from "../ui/badge/Badge";

const ScoreUpdateModal = ({ match, onClose }: any) => {
  const [scoreHome, setScoreHome] = useState(match.score ? match.score.split(" - ")[0] : 0);
  const [scoreAway, setScoreAway] = useState(match.score ? match.score.split(" - ")[1] : 0);
  
  // Mock player roster for performance tracking
  const [roster, setRoster] = useState([
    { id: 1, name: "Alex Blue", goals: 1, assists: 0, rating: 8.5, played: true },
    { id: 2, name: "Jordan Red", goals: 0, assists: 1, rating: 7.2, played: true },
    { id: 3, name: "Sam Green", goals: 2, assists: 0, rating: 9.1, played: true },
    { id: 4, name: "Casey White", goals: 0, assists: 0, rating: 6.5, played: false },
  ]);

  const updatePlayer = (id: number, field: string, value: any) => {
    setRoster(roster.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-gray-900/40 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="p-10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="p-4 bg-brand-500 rounded-2xl shadow-xl shadow-brand-500/20 text-white">
                <Trophy size={24} />
             </div>
             <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none uppercase tracking-tighter">Performance Update Hub</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{match.team} VS {match.opponent} | {match.date}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-brand-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
           
           {/* SCORE SECTION */}
           <div className="flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/[0.01] rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800/10">
              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-10">Final Competitive Score</span>
              <div className="flex items-center gap-12">
                 <div className="text-center group">
                    <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase mb-6 group-hover:text-brand-500 transition-colors">{match.team}</h4>
                    <input 
                      type="number" 
                      className="w-24 h-24 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-3xl text-4xl font-black text-center text-gray-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
                      value={scoreHome}
                      onChange={(e) => setScoreHome(parseInt(e.target.value))}
                    />
                 </div>
                 <div className="text-4xl font-black text-gray-200 uppercase italic mt-16">-</div>
                 <div className="text-center group">
                    <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase mb-6 group-hover:text-brand-500 transition-colors">{match.opponent}</h4>
                    <input 
                      type="number" 
                      className="w-24 h-24 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-3xl text-4xl font-black text-center text-gray-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
                      value={scoreAway}
                      onChange={(e) => setScoreAway(parseInt(e.target.value))}
                    />
                 </div>
              </div>
           </div>

           {/* INDIVIDUAL PERFORMANCE HUB */}
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                   <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Individual Performance Registry</h4>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Assign goals, assists, and expert ratings for the official archive</p>
                </div>
                <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                   ADD GUEST PLAYER <UserPlus size={14}/>
                </button>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Academy Player</th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">In SQUAD</th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Goals</th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Assists</th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Rating (1-10)</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {roster.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                           <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{player.name}</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex justify-center">
                              <button 
                                onClick={() => updatePlayer(player.id, "played", !player.played)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${player.played ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "bg-gray-50 dark:bg-gray-800 text-gray-300 border border-transparent"}`}
                              >
                                {player.played ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border border-current" />}
                              </button>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <input 
                             type="number" 
                             className="w-16 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs font-bold border border-transparent focus:border-brand-500 outline-none" 
                             value={player.goals}
                             onChange={(e) => updatePlayer(player.id, "goals", parseInt(e.target.value))}
                           />
                        </td>
                        <td className="px-6 py-5">
                           <input 
                             type="number" 
                             className="w-16 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs font-bold border border-transparent focus:border-brand-500 outline-none" 
                             value={player.assists}
                             onChange={(e) => updatePlayer(player.id, "assists", parseInt(e.target.value))}
                           />
                        </td>
                        <td className="px-6 py-5">
                           <input 
                             type="number" 
                             step="0.1" 
                             className="w-20 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs font-bold border border-transparent focus:border-brand-500 outline-none" 
                             value={player.rating}
                             onChange={(e) => updatePlayer(player.id, "rating", parseFloat(e.target.value))}
                           />
                        </td>
                        <td className="px-8 py-5 text-right">
                           <Badge 
                             variant="light" 
                             color={player.rating >= 8 ? "success" : player.rating >= 6 ? "warning" : "error"}
                             className="text-[9px] font-black px-4 rounded-full"
                           >
                             {player.rating >= 8 ? "MOTM" : player.rating >= 6 ? "PRO" : "SUB"}
                           </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-10 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
           <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
              <Zap size={14} className="text-brand-500 fill-brand-500" />
              <span>Performance snapshots are immutable once verified</span>
           </div>
           <div className="flex gap-4">
              <button onClick={onClose} className="px-10 py-5 bg-gray-50 dark:bg-gray-800 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">DISCARD</button>
              <button 
                onClick={onClose}
                className="px-12 py-5 bg-brand-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/20 active:scale-95 transition-all hover:scale-105 flex items-center gap-2"
              >
                VERIFY RESULTS <Save size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreUpdateModal;
