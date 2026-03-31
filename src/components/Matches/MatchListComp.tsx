import { useState } from "react";
import { 
  MapPin, 
  Clock, 
  UserPlus, 
  TrendingUp,
  History
} from "lucide-react";
import Badge from "../ui/badge/Badge";
import ScoreUpdateModal from "./ScoreUpdateModal";

const MatchListComp = ({ type = "UPCOMING" }: { type: "UPCOMING" | "FINISHED" }) => {
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  // Mock data for demonstration
  const matches: any[] = type === "UPCOMING" ? [
    { id: 1, team: "U14 Elite Squad", opponent: "Brisbane Central B", date: "June 28, 2024", time: "10:30 AM", venue: "Home (H-Field)", category: "LEAGUE", status: "SCHEDULED" },
    { id: 2, team: "Development A", opponent: "Gold Coast Tigers", date: "June 30, 2024", time: "09:00 AM", venue: "Away (GC Arena)", category: "INTER-SCHOOL", status: "PENDING" },
  ] : [
    { id: 3, team: "Academy A Team", opponent: "Wooloowin United", date: "June 20, 2024", time: "05:00 PM", venue: "Home (H-Field)", category: "LEAGUE", status: "COMPLETED", score: "3 - 1", result: "WON" },
    { id: 4, team: "Under-12 Elite", opponent: "Petrie Terrace", date: "June 18, 2024", time: "04:30 PM", venue: "Away (PT Fields)", category: "FRIENDLY", status: "COMPLETED", score: "0 - 2", result: "LOST" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">
            {type === "UPCOMING" ? "Current Fixtures Registry" : "Competitive History"}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            {type === "UPCOMING" ? "Monitor and manage upcoming academy matches" : "Verified results and point distributions"}
          </p>
        </div>
        <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-100 dark:border-gray-800">
          <button className="px-4 py-2 bg-white dark:bg-gray-700 text-brand-500 rounded-lg text-[10px] font-bold uppercase shadow-sm">All Levels</button>
          <button className="px-4 py-2 text-gray-400 rounded-lg text-[10px] font-bold uppercase hover:text-gray-600 transition-colors">Elite Only</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {matches.map((match) => (
          <div key={match.id} className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-brand-500/20 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              
              {/* PRIMARY MATCH INFO */}
              <div className="flex items-center gap-10">
                 <div className="hidden sm:flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100/50 dark:border-gray-700 w-32 h-32 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                    <span className="text-[10px] font-black uppercase text-gray-400 mb-1 leading-none">{match.date.split(",")[0].split(" ")[0]}</span>
                    <span className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-brand-500">{match.date.split(",")[0].split(" ")[1]}</span>
                    <span className="text-[10px] font-black uppercase text-gray-400 mt-1 leading-none">2024</span>
                 </div>

                 <div className="flex flex-col md:flex-row md:items-center gap-12">
                    <div className="space-y-3">
                       <span className="text-[9px] font-black text-brand-500 uppercase tracking-[0.3em] block">{match.category}</span>
                       <div className="flex items-center gap-6">
                          <div className="text-center w-32">
                             <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase leading-none truncate">{match.team}</h4>
                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2 block">CM ACADEMY</span>
                          </div>
                          <div className="text-2xl font-black text-gray-200 uppercase italic">VS</div>
                          <div className="text-center w-32">
                             <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase leading-none truncate">{match.opponent}</h4>
                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2 block">GUEST TEAM</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-12 gap-y-4 border-t lg:border-t-0 lg:border-l border-gray-50 dark:border-gray-800 pt-6 lg:pt-0 lg:pl-12">
                       <div className="flex items-center gap-3 text-gray-500">
                          <Clock size={14} className="text-brand-500" />
                          <span className="text-xs font-bold uppercase">{match.time}</span>
                       </div>
                       <div className="flex items-center gap-3 text-gray-500">
                          <MapPin size={14} className="text-brand-500" />
                          <span className="text-xs font-bold uppercase truncate max-w-[120px]">{match.venue}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* ACTION & STATUS HUB */}
              <div className="flex items-center gap-6 lg:border-l border-gray-50 dark:border-gray-800 lg:pl-10">
                 {type === "FINISHED" ? (
                   <div className="text-center lg:min-w-[140px]">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-2">Final Outcome</span>
                      <div className="text-3xl font-black text-gray-900 dark:text-white tracking-widest mb-1">{match.score}</div>
                      <Badge 
                        variant="light" 
                        color={match.result === "WON" ? "success" : "error"}
                        className="text-[9px] font-black px-6 rounded-full"
                      >
                        {match.result}
                      </Badge>
                   </div>
                 ) : (
                   <div className="text-center lg:min-w-[140px]">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-4">Registry State</span>
                      <Badge 
                        variant="light" 
                        color="primary"
                        className="text-[9px] font-black px-8 py-1.5 rounded-full uppercase"
                      >
                        {match.status}
                      </Badge>
                   </div>
                 )}

                 <div className="flex flex-col gap-3">
                   {type === "FINISHED" ? (
                     <>
                       <button className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-brand-500 transition-colors shadow-sm active:scale-95">
                          <History size={18} />
                       </button>
                       <button 
                         onClick={() => setSelectedMatch(match)}
                         className="p-3 bg-brand-500 text-white rounded-2xl shadow-xl shadow-brand-500/20 active:scale-95 transition-all hover:scale-105"
                       >
                          <TrendingUp size={18} />
                       </button>
                     </>
                   ) : (
                     <button 
                       onClick={() => setSelectedMatch(match)}
                       className="px-6 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200 active:scale-95 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                     >
                        MANAGE SQUAD <UserPlus size={14} />
                     </button>
                   )}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMatch && (
        <ScoreUpdateModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </div>
  );
};

export default MatchListComp;
