import { Calendar, MapPin, Clock } from "lucide-react";

export default function MatchScheduleHome() {
 const matches = [
  {
   id: 1,
   homeTeam: "CoachMax Lions",
   awayTeam: "West Coast FC",
   time: "15:30",
   date: "Mar 25",
   venue: "Main Stadium",
   league: "U-18 Elite League",
   homeLogo: "ML",
   awayLogo: "WC",
  },
  {
   id: 2,
   homeTeam: "CoachMax Bulls",
   awayTeam: "Central Tigers",
   time: "10:00",
   date: "Mar 28",
   venue: "Pitch 4",
   league: "U-15 Junior Pro",
   homeLogo: "MB",
   awayLogo: "CT",
  },
  {
   id: 3,
   homeTeam: "CoachMax Eagles",
   awayTeam: "Ocean View Acad.",
   time: "18:00",
   date: "Mar 30",
   venue: "Training Complex",
   league: "Friendly Match",
   homeLogo: "ME",
   awayLogo: "OV",
  },
 ];

 return (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
   <div className="flex items-center justify-between mb-8">
    <div>
     <h3 className="text-lg font-bold text-gray-900 dark:text-white  tracking-tight">
      Next Fixtures
     </h3>
     <p className="mt-1 text-xs text-gray-400 font-bold ">Upcoming Action</p>
    </div>
    <div className="w-10 h-1 bg-brand-500 rounded-full"></div>
   </div>

   <div className="space-y-6">
    {matches.map((match) => (
     <div key={match.id} className="relative pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
      <div className="flex items-center justify-between mb-4">
        <span className="px-2 py-1 rounded bg-brand-50 dark:bg-brand-500/10 text-[9px] font-bold text-brand-600 tracking-[0.1em]">{match.league}</span>
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 ">
         <Calendar size={13} className="text-brand-500/50" />
         {match.date}
        </div>
      </div>

      <div className="flex items-center gap-4">
       <div className="flex-1">
        <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{match.homeTeam}</p>
        <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-gray-400">
          <MapPin size={10} /> {match.venue}
        </div>
       </div>
       
       <div className="flex flex-col items-center">
        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-1">VS</span>
        <span className="flex items-center gap-1 text-[10px] font-bold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-full"><Clock size={9}/> {match.time}</span>
       </div>

       <div className="flex-1 text-right">
         <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{match.awayTeam}</p>
         <p className="text-[10px] font-bold text-gray-400 mt-1 ">Away Game</p>
       </div>
      </div>
     </div>
    ))}
   </div>
  </div>
 );
}
