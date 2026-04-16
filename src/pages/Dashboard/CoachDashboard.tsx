import React from "react";
import PageMeta from "../../components/common/PageMeta";
import { useUser } from "../../context/UserContext";
import { 
  Users, 
  Calendar, 
  Activity, 
  Award, 
  Clock, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { Link } from "react-router";

const CoachDashboard: React.FC = () => {
  const { user } = useUser();

  const metrics = [
    { title: "Total Assigned Players", value: "156", icon: Users, color: "text-brand-500", bg: "bg-brand-50" },
    { title: "Weekly Training Slots", value: "12", icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Avg. Attendance", value: "94%", icon: UserCheck, color: "text-green-500", bg: "bg-green-50" },
    { title: "Performance Index", value: "8.4", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const assignedClasses = [
    { id: "1", name: "U-12 Elite Academy", day: "Monday", time: "16:00 - 17:30", location: "Field 1", students: 24, status: "Active" },
    { id: "2", name: "Junior Development Group B", day: "Wednesday", time: "15:30 - 17:00", location: "Field 3", students: 18, status: "Active" },
    { id: "3", name: "High-Performance School Program", day: "Friday", time: "14:00 - 15:30", location: "School Turf", students: 32, status: "Active" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <PageMeta
        title="Coach Dashboard | CoachMax"
        description="Coach analytics and class management"
      />

      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1e2b5e] to-[#2a3a7a] p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-extrabold uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              Live Session Status: Active
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome back, <span className="text-brand-400">Coach {user?.name?.split(' ')[0] || "Pro"}!</span>
            </h1>
            <p className="text-white/70 max-w-xl text-lg leading-relaxed">
              You have <span className="text-white font-bold">3 sessions</span> scheduled for today. Ready to push the limits of performance?
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <Link to="/training-classes" className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-500/30 flex items-center gap-2 group">
                 Launch Attendance <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>
               <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all border border-white/10 backdrop-blur-md">
                 Manage Schedule
               </button>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
             <div className="w-48 h-48 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 animate-spin-slow"></div>
                <div className="text-center">
                   <div className="text-4xl font-black text-white">88%</div>
                   <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Avg. Goal Met</div>
                </div>
             </div>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Combined Row: Metrics & Mini Profile */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {metrics.map((m, i) => (
                <div key={i} className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
                   <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl ${m.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                         <m.icon className={m.color} size={28} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m.title}</p>
                         <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{m.value}</h3>
                      </div>
                   </div>
                </div>
             ))}
           </div>
           
           <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-brand-500 rounded-full"></div>
                    Your Assigned Classes
                 </h2>
                 <Link to="/training-classes" className="text-xs font-bold text-brand-500 hover:underline">View All Schedule</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {assignedClasses.map((cls) => (
                    <div key={cls.id} className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-brand-500/30 transition-all relative overflow-hidden group">
                       <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                             <div className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-extrabold uppercase rounded-lg">
                                {cls.status}
                             </div>
                             <div className="flex items-center gap-1 text-gray-400">
                                <Users size={14} />
                                <span className="text-xs font-bold">{cls.students} Players</span>
                             </div>
                          </div>
                          <h4 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">{cls.name}</h4>
                          <div className="space-y-2">
                             <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                                <Clock size={14} />
                                <span className="font-medium">{cls.day}, {cls.time}</span>
                             </div>
                             <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                                <MapPin size={14} />
                                <span className="font-medium">{cls.location}</span>
                             </div>
                          </div>
                          <Link to="/training-classes" className="mt-6 w-full py-3 bg-gray-50 dark:bg-white/5 hover:bg-brand-500 hover:text-white text-gray-900 dark:text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2">
                             Access Sessions <ChevronRight size={14} />
                          </Link>
                       </div>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Sidebar: Coach Info & Quick Actions */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
           <div className="bg-white dark:bg-white/[0.03] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-brand-500 to-blue-600"></div>
              <div className="px-6 pb-8 -mt-12 text-center">
                 <div className="relative inline-block">
                    <img 
                       src={user?.profileImg ? `${import.meta.env.VITE_API_BASE_URL}/${user.profileImg}` : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                       alt={user?.name}
                       className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 shadow-xl object-cover mx-auto"
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center text-white">
                       <Award size={12} />
                    </div>
                 </div>
                 <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-4">{user?.name || "Professional Coach"}</h3>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Lead Academy Coach</p>
                 
                 <div className="grid grid-cols-2 gap-4 mt-8 border-y border-gray-50 dark:border-white/5 py-6">
                    <div>
                       <div className="text-lg font-black text-gray-900 dark:text-white">4.9</div>
                       <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Rating</div>
                    </div>
                    <div>
                       <div className="text-lg font-black text-gray-900 dark:text-white">6+</div>
                       <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Years Exp.</div>
                    </div>
                 </div>
                 
                 <Link to="/profile" className="mt-6 block w-full py-3 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 rounded-xl text-xs font-bold transition-all">
                    Edit Coach Profile
                 </Link>
              </div>
           </div>

           <div className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                 <Activity size={16} className="text-brand-500" />
                 Training Activity
              </h3>
              <div className="space-y-6">
                 {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-4 relative">
                       {i < 2 && <div className="absolute left-3 top-8 bottom-0 w-[1px] bg-gray-100 dark:bg-white/5"></div>}
                       <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase">March {24 - i}, 2026</p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">Updated attendance for Elite Academy</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
