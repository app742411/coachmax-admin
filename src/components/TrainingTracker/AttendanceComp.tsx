import { UserCheck, Calendar } from "lucide-react";
import Badge from "../ui/badge/Badge";

const AttendanceComp = () => {
  // Mock data for demonstration
  const attendanceData = [
    { id: 1, name: "Alex Blue", date: "2024-06-20", session: "Morning Elite Training", status: "PRESENT" },
    { id: 2, name: "Jordan Red", date: "2024-06-20", session: "Morning Elite Training", status: "LATE" },
    { id: 3, name: "Sam Green", date: "2024-06-20", session: "Morning Elite Training", status: "ABSENT" },
    { id: 4, name: "Casey White", date: "2024-06-20", session: "Evening Development", status: "PRESENT" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Daily Attendance</h3>
          <p className="text-xs text-gray-500 mt-1">Track and monitor daily session presence</p>
        </div>
        <button className="px-5 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all">
          Mark New Attendance
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Player Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Training Session</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {attendanceData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-all">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-brand-500">
                      <UserCheck size={18} />
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{item.session}</span>
                </td>
                <td className="px-6 py-5 text-center">
                   <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400">
                    <Calendar size={12} />
                    {item.date}
                   </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <Badge 
                      variant="light" 
                      color={item.status === "PRESENT" ? "success" : item.status === "LATE" ? "warning" : "error"}
                      className="text-[9px] font-bold px-4 rounded-full"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceComp;
