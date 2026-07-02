import { useClassFullTable, useMarkSingleAttendance, useMarkBulkAttendance } from "../../hooks/usePlayers";

interface ClassFullTableProps {
  classId: string;
  timeSlotStr: string;
}

export default function ClassFullTable({ classId, timeSlotStr }: ClassFullTableProps) {
  const { data: schedule, isLoading } = useClassFullTable(classId);
  const markSingleMutation = useMarkSingleAttendance(classId);
  const markBulkMutation = useMarkBulkAttendance(classId);

  if (isLoading) {
    return <div className="p-4 text-center text-sm text-slate-500">Loading class data...</div>;
  }

  if (!schedule) {
    return null;
  }

  // Map API response to the table format
  const sessions = schedule.sessions || [];
  const players = schedule.players || [];

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "PRESENT":
        return (
          <div className="flex justify-center text-emerald-600">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "ABSENT":
        return (
          <div className="flex justify-center text-rose-600">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "LATE":
        return (
          <div className="flex justify-center text-amber-500">
            <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
        );
      case "NOT_MARKED":
      default:
        return (
          <div className="flex justify-center text-slate-300 dark:text-slate-700">
            <span className="font-semibold">—</span>
          </div>
        );
    }
  };

  const handleToggleAttendance = (playerId: string, sessionDate: string, currentStatus: string) => {
    // Cycle: NOT_MARKED -> PRESENT -> ABSENT -> NOT_MARKED
    let newStatus = "PRESENT";
    if (currentStatus === "PRESENT") newStatus = "ABSENT";
    else if (currentStatus === "ABSENT") newStatus = "NOT_MARKED";

    markSingleMutation.mutate({
      sessionDate,
      playerId,
      status: newStatus,
    });
  };

  const handleMarkAllPresent = (sessionDate: string) => {
    const records = players.map((p: any) => ({
      player: p.playerId,
      status: "PRESENT",
    }));

    markBulkMutation.mutate({
      sessionDate,
      records,
    });
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: `${d.getDate()}/${d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}`
    };
  };

  return (
    <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden mb-6 shadow-theme-xs bg-white dark:bg-slate-900">
      {/* Table Header Bar */}
      <div className="bg-[#031549] text-white px-5 py-3.5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-5 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{timeSlotStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{schedule.className}</span>
          </div>
        </div>
      </div>

      {/* Attendance Grid Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
              <th className="py-2.5 px-4 w-[40px]">#</th>
              <th className="py-2.5 px-3 min-w-[130px]">Player</th>
              <th className="py-2.5 px-3 min-w-[80px]">DOB</th>
              <th className="py-2.5 px-3 min-w-[120px]">Medical Conditions</th>
              {sessions.map((sessionDate: string, idx: number) => {
                const formatted = formatDateLabel(sessionDate);
                return (
                  <th key={sessionDate} className="py-2.5 px-1.5 text-center min-w-[50px] font-semibold border-l border-slate-100 dark:border-slate-800/40 relative group">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-slate-400 font-bold">{idx + 1}</span>
                      <span className="text-slate-500">{formatted.day}</span>
                      <span className="text-slate-500 font-bold">{formatted.date}</span>
                    </div>
                    {/* Mark All Present button on hover */}
                    <button 
                      onClick={() => handleMarkAllPresent(sessionDate)}
                      className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Mark all present"
                    >
                      <svg className="w-4 h-4 text-[#0047FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </th>
                );
              })}
              <th className="py-2.5 px-4 w-[70px] text-center border-l border-slate-100 dark:border-slate-800/40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? players.map((row: any, idx: number) => (
              <tr key={row.playerId} className="border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                <td className="py-2 px-4 font-semibold text-slate-400">{idx + 1}</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">{row.name.charAt(0)}</span>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{row.name}</span>
                  </div>
                </td>
                <td className="py-2 px-3 font-semibold text-slate-500">{new Date(row.dob).toLocaleDateString()}</td>
                <td className="py-2 px-3">
                  <span className={row.adminNote ? "text-rose-600 font-bold" : "text-slate-500 font-semibold"}>
                    {row.adminNote || "None"}
                  </span>
                </td>
                {sessions.map((sessionDate: string) => {
                  const status = row.attendance?.[sessionDate] || "NOT_MARKED";
                  return (
                    <td 
                      key={sessionDate} 
                      className="py-2 px-1.5 border-l border-slate-50 dark:border-slate-800/20 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      onClick={() => handleToggleAttendance(row.playerId, sessionDate, status)}
                    >
                      {renderStatusIcon(status)}
                    </td>
                  );
                })}
                <td className="py-2 px-4 text-center border-l border-slate-50 dark:border-slate-800/20">
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm inline-flex items-center justify-center">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5 + sessions.length} className="text-center py-4 text-sm text-slate-500">
                  No players in this class.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
