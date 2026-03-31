import { TrendingUp } from "lucide-react";
import Badge from "../ui/badge/Badge";

const PerformanceComp = () => {
  // Mock data for performance metrics
  const performanceData = [
    { id: 1, name: "Liam Stone", speed: 85, stamina: 72, technique: 90, lastSync: "2 hours ago" },
    { id: 2, name: "Noah Park", speed: 78, stamina: 88, technique: 65, lastSync: "1 hour ago" },
    { id: 3, name: "Ethan Hunt", speed: 92, stamina: 64, technique: 82, lastSync: "5 minutes ago" },
    { id: 4, name: "Mason Reed", speed: 70, stamina: 95, technique: 77, lastSync: "Yesterday" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Player Analytics</h3>
          <p className="text-xs text-gray-500 mt-1">Monitor developmental milestones and technical growth</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:text-brand-500 transition-all">
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all">
            Update Stats
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {performanceData.map((player) => (
          <div key={player.id} className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-brand-500/20 transition-all">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-brand-500 shadow-sm border border-transparent group-hover:border-brand-500/10">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-none mb-1">{player.name}</h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Scouted Profile</span>
                </div>
              </div>
              <Badge color="success" variant="light" className="text-[9px] font-bold px-4 py-1 rounded-full">Elite Class</Badge>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                  <span>Speed Progression</span>
                  <span className="text-brand-500">{player.speed}%</span>
                </div>
                <div className="h-1 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-500 rounded-full group-hover:bg-brand-600 transition-all duration-700" 
                    style={{ width: `${player.speed}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                  <span>Stamina / Output</span>
                  <span className="text-success-500">{player.stamina}%</span>
                </div>
                <div className="h-1 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success-500 rounded-full group-hover:bg-success-600 transition-all duration-700" 
                    style={{ width: `${player.stamina}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                  <span>Technical Ball Control</span>
                  <span className="text-blue-500">{player.technique}%</span>
                </div>
                <div className="h-1 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full group-hover:bg-blue-600 transition-all duration-700" 
                    style={{ width: `${player.technique}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between text-[10px] font-bold text-gray-300">
              <span className="uppercase tracking-widest">Analytics Pulse</span>
              <span className="text-gray-400 uppercase">LAST SYNCED: {player.lastSync}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceComp;
