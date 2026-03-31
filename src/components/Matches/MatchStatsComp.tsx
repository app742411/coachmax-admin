import { Trophy, AlertCircle, CheckCircle2, Flag, User, Activity } from "lucide-react";

const MatchStatsComp = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* GLOBAL STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatItem title="Total Played" value="28" icon={<Flag size={20}/>} color="brand" />
        <StatItem title="Wins (CM)" value="18" icon={<CheckCircle2 size={20}/>} color="success" />
        <StatItem title="Defeats" value="6" icon={<AlertCircle size={20}/>} color="error" />
        <StatItem title="Draws" value="4" icon={<Activity size={20}/>} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEADING SCORERS HUB */}
        <div className="lg:col-span-12 xl:col-span-8 p-10 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Top Performers Registry</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Individual player impact across current league</p>
            </div>
            <button className="px-5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-bold text-gray-400 hover:text-brand-500 transition-colors">VIEW FULL LEADERBOARD</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <TopPlayerCard name="Alex Blue" goals={12} assists={5} mvp={3} rank={1} />
             <TopPlayerCard name="Jordan Red" goals={8} assists={9} mvp={2} rank={2} />
             <TopPlayerCard name="Sam Green" goals={7} assists={2} mvp={4} rank={3} />
          </div>
        </div>

        {/* TEAM SYNC DASHBOARD */}
        <div className="lg:col-span-12 xl:col-span-4 p-8 bg-brand-500 rounded-[2.5rem] text-white shadow-2xl shadow-brand-500/20 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={150} />
          </div>
          <div>
            <span className="text-white/70 font-bold text-[10px] uppercase tracking-[0.4em] block mb-4">Elite League Standings</span>
            <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-6">CM ACADEMY <br/> CURRENT SCORE</h3>
            <div className="space-y-4">
               <StandingItem team="Academy A Team" points={54} rank={1} active />
               <StandingItem team="Development Squad" points={42} rank={4} />
               <StandingItem team="Under-12 Elite" points={38} rank={2} />
            </div>
          </div>
          <button className="mt-12 bg-white text-brand-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">VIEW ALL GROUPS</button>
        </div>
      </div>
    </div>
  );
};

// HELPERS
const StatItem = ({ title, value, icon, color }: any) => {
  const colorMap: any = {
    brand: "bg-brand-500 text-white",
    success: "bg-success-500 text-white",
    error: "bg-error-500 text-white",
    warning: "bg-warning-500 text-white"
  };

  const borderMap: any = {
    brand: "border-brand-500/10 shadow-brand-500/5",
    success: "border-success-500/10 shadow-success-500/5",
    error: "border-error-500/10 shadow-error-500/5",
    warning: "border-warning-500/10 shadow-warning-500/5"
  };

  return (
    <div className={`p-8 rounded-[2rem] border bg-white dark:bg-gray-900 shadow-xl transition-all hover:scale-[1.02] ${borderMap[color]}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</h3>
    </div>
  );
};

const TopPlayerCard = ({ name, goals, assists, mvp, rank }: any) => (
  <div className="p-6 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-3xl relative group hover:border-brand-500/30 transition-all">
    <div className="absolute top-4 right-4 text-gray-200 dark:text-white/5 font-black text-5xl leading-none italic group-hover:text-brand-500/10 transition-colors">#{rank}</div>
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-brand-500 shadow-sm border border-gray-100/50 dark:border-gray-700 transition-colors">
        <User size={18} />
      </div>
      <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{name}</span>
    </div>
    <div className="grid grid-cols-3 gap-2">
       <StatBox label="Goals" val={goals} />
       <StatBox label="Assist" val={assists} />
       <StatBox label="MVP" val={mvp} />
    </div>
  </div>
);

const StatBox = ({ label, val }: any) => (
  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-50 dark:border-gray-700/50 text-center">
    <span className="text-[10px] font-black text-gray-900 dark:text-white block leading-none">{val}</span>
    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 block">{label}</span>
  </div>
);

const StandingItem = ({ team, points, rank, active }: any) => (
  <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${active ? "bg-white/10 border-white/20" : "bg-transparent border-transparent"}`}>
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-black italic text-white/40">#{rank}</span>
      <span className="text-xs font-bold leading-none">{team}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-black">{points}</span>
      <span className="text-[8px] font-bold uppercase text-white/50 tracking-widest">PTS</span>
    </div>
  </div>
);

export default MatchStatsComp;
