import { useState } from "react";
import { 
  Trophy, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Monitor, 
  ChevronRight, 
  X
} from "lucide-react";

const ScheduleMatchForm = ({ onCancel }: any) => {
  const [formData, setFormData] = useState({
    matchType: "INTER-SCHOOL",
    opponent: "",
    venue: "HOME",
    customVenue: "",
    date: "",
    time: "",
    team: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Match Scheduled:", formData);
    onCancel();
  };

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden group animate-in zoom-in duration-300">
      <div className="absolute top-10 right-10">
        <button onClick={onCancel} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-brand-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="mb-12">
        <span className="text-brand-500 font-bold text-[10px] uppercase tracking-[0.4em] block mb-4">Elite Fixtures</span>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">Schedule Competitive Match</h3>
        <p className="text-gray-400 font-medium text-sm mt-2">Design and register upcoming league or exhibition matches.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* MATCH TYPE */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 block">Competiton Tier</label>
            <div className="flex bg-gray-50 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
              {["INTER-SCHOOL", "LEAGUE", "FRIENDLY"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, matchType: t })}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    formData.matchType === t 
                      ? "bg-white dark:bg-gray-700 text-brand-500 shadow-sm" 
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* TEAM SELECTION */}
          <InputGroup 
            label="Internal Academy Team" 
            placeholder="Select Team (e.g. U14 Elite)" 
            icon={<Users size={16}/>} 
            value={formData.team} 
            onChange={(e:any) => setFormData({...formData, team: e.target.value})}
          />

          {/* OPPONENT */}
          <InputGroup 
            label="Opponent Registry" 
            placeholder="Opponent School or Club Name" 
            icon={<Trophy size={16}/>} 
            value={formData.opponent} 
            onChange={(e:any) => setFormData({...formData, opponent: e.target.value})}
          />

          {/* VENUE TYPE */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 block">Venue Control</label>
            <div className="flex bg-gray-50 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
              {["HOME", "AWAY"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setFormData({ ...formData, venue: v })}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    formData.venue === v 
                      ? "bg-white dark:bg-gray-700 text-brand-500 shadow-sm" 
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* DATE */}
          <InputGroup 
            label="Scheduled Date" 
            type="date" 
            icon={<Calendar size={16}/>} 
            value={formData.date} 
            onChange={(e:any) => setFormData({...formData, date: e.target.value})}
          />

          {/* TIME */}
          <InputGroup 
            label="Kickoff Time" 
            type="time" 
            icon={<Clock size={16}/>} 
            value={formData.time} 
            onChange={(e:any) => setFormData({...formData, time: e.target.value})}
          />

          {formData.venue === "AWAY" && (
            <div className="md:col-span-2">
               <InputGroup 
                 label="Guest Venue Details" 
                 placeholder="Full street address and field number" 
                 icon={<MapPin size={16}/>} 
                 value={formData.customVenue} 
                 onChange={(e:any) => setFormData({...formData, customVenue: e.target.value})}
               />
            </div>
          )}
        </div>

        <div className="pt-10 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
           <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
              <Monitor size={14} className="text-brand-500" />
              <span>Broadcast to registry and school schedules</span>
           </div>
           <div className="flex gap-4">
              <button 
                type="button" 
                onClick={onCancel}
                className="px-10 py-5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 transition-all active:scale-95"
              >
                DISCARD
              </button>
              <button 
                type="submit" 
                className="px-12 py-5 bg-brand-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                FINALIZE FIXTURE <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

const InputGroup = ({ label, icon, placeholder, value, onChange, type = "text" }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 block">{label}</label>
    <div className="relative group">
       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-500 transition-colors">
          {icon}
       </span>
       <input 
         type={type} 
         placeholder={placeholder}
         className="w-full h-14 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-2xl pl-12 pr-6 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-brand-500/30 transition-all"
         value={value}
         onChange={onChange}
       />
    </div>
  </div>
);

export default ScheduleMatchForm;
