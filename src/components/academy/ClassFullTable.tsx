import { useState } from "react";
import { useClassFullTable, useMarkSingleAttendance, useMarkBulkAttendance, useAssignClassesToPlayer, useRemoveClassFromPlayer } from "../../hooks/usePlayers";
import { Modal } from "../ui/modal";

interface ClassFullTableProps {
  classId: string;
  timeSlotStr: string;
  categoryId?: string;
  programId?: string;
  categoryName?: string;
  programName?: string;
}

export default function ClassFullTable({ classId, timeSlotStr, categoryId, programId, categoryName, programName }: ClassFullTableProps) {
  const { data: schedule, isLoading } = useClassFullTable(classId);
  const markSingleMutation = useMarkSingleAttendance(classId);
  const markBulkMutation = useMarkBulkAttendance(classId);
  const assignClassesMutation = useAssignClassesToPlayer();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingDropData, setPendingDropData] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const removeClassMutation = useRemoveClassFromPlayer();

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const data = JSON.parse(dataStr);

      if (data.playerId) {
        // If categories/programs are available on both sides and mismatch, show confirmation
        if (
          categoryId && programId && data.categoryId && data.programId &&
          (categoryId !== data.categoryId || programId !== data.programId)
        ) {
          setPendingDropData(data);
          setIsConfirmModalOpen(true);
        } else {
          // Direct assignment
          assignClassesMutation.mutate({
            playerId: data.playerId,
            classIds: [classId],
            paymentStatus: data.paymentStatus,
            registrationRequestId: data.registrationRequestId,
          });
        }
      }
    } catch (err) {
      console.error("Failed to parse drop data", err);
    }
  };

  const confirmAssignment = () => {
    if (pendingDropData) {
      assignClassesMutation.mutate({
        playerId: pendingDropData.playerId,
        classIds: [classId],
        paymentStatus: pendingDropData.paymentStatus,
        registrationRequestId: pendingDropData.registrationRequestId,
      });
      setIsConfirmModalOpen(false);
      setPendingDropData(null);
    }
  };

  return (
    <div
      className={`border border-slate-100 dark:border-slate-800 overflow-hidden mb-6 shadow-theme-xs bg-white dark:bg-slate-900 transition-colors ${assignClassesMutation.isPending ? "opacity-75" : ""
        }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
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
            <span>{schedule.className}</span>
          </div>
          <div className="flex items-center gap-2 text-[#4facfe] bg-white/10 px-2.5 py-1 rounded-sm ml-auto">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>
              {categoryName || schedule.category?.name || "N/A"} / {programName || schedule.program?.name || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Grid Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-0 text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
              <th className="sticky left-0 z-20 bg-[#f8fafc] dark:bg-slate-900 py-2.5 px-4 min-w-[40px] w-[40px] border-b border-slate-100 dark:border-slate-800">#</th>
              <th className="sticky left-[40px] z-20 bg-[#f8fafc] dark:bg-slate-900 py-2.5 px-3 min-w-[150px] w-[150px] border-b border-slate-100 dark:border-slate-800">Player</th>
              <th className="sticky left-[190px] z-20 bg-[#f8fafc] dark:bg-slate-900 py-2.5 px-3 min-w-[90px] w-[90px] border-b border-slate-100 dark:border-slate-800">DOB</th>
              <th className="sticky left-[280px] z-20 bg-[#f8fafc] dark:bg-slate-900 py-2.5 px-3 min-w-[130px] w-[130px] border-b border-slate-100 dark:border-slate-800 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">Medical Conditions</th>
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
              <th className="sticky right-0 z-20 bg-[#f8fafc] dark:bg-slate-900 py-2.5 px-4 min-w-[70px] w-[70px] text-center border-l border-b border-slate-100 dark:border-slate-800 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? players.map((row: any, idx: number) => (
              <tr key={row.playerId} className="group border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 py-2 px-4 font-semibold text-slate-400 min-w-[40px] w-[40px] border-b border-slate-50 dark:border-slate-800/40">{idx + 1}</td>
                <td className="sticky left-[40px] z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 py-2 px-3 min-w-[150px] w-[150px] border-b border-slate-50 dark:border-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span 
                      title={row.paymentStatus || "UNKNOWN"}
                      className={`w-3 h-3 rounded-full shrink-0 border border-white dark:border-slate-800 shadow-sm ${
                        row.paymentStatus === "PAID" || row.paymentStatus === "APPROVED" ? "bg-emerald-500" : 
                        row.paymentStatus === "UNPAID" || row.paymentStatus === "REJECTED" ? "bg-rose-500" : 
                        row.paymentStatus === "TRIAL" ? "bg-blue-500" : 
                        "bg-amber-500"
                      }`}
                    />
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold">{row.name.charAt(0)}</span>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{row.name}</span>
                  </div>
                </td>
                <td className="sticky left-[190px] z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 py-2 px-3 font-semibold text-slate-500 min-w-[90px] w-[90px] border-b border-slate-50 dark:border-slate-800/40">{new Date(row.dob).toLocaleDateString()}</td>
                <td className="sticky left-[280px] z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 py-2 px-3 min-w-[130px] w-[130px] border-b border-slate-50 dark:border-slate-800/40 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">
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
                <td className="sticky right-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 py-2 px-4 text-center border-l border-b border-slate-50 dark:border-slate-800/40 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)] relative">
                  <div className="flex items-center justify-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === row.playerId ? null : row.playerId);
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 border border-slate-200 dark:border-slate-700 rounded-none bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm inline-flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                  {openMenuId === row.playerId && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 py-1.5 overflow-hidden">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          if (window.confirm("Are you sure you want to remove this player from this class?")) {
                            removeClassMutation.mutate({ userId: row.playerId, classId });
                          }
                        }}
                        disabled={removeClassMutation.isPending}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50"
                      >
                        Remove Class
                      </button>
                    </div>
                  )}
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

      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="max-w-md p-6">
        <div className="w-full">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Confirm Assignment</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Player requested for <strong>{pendingDropData?.categoryName} - {pendingDropData?.programName}</strong> but you tried to assign them to a class in another Program/Category. Do you want to proceed with this assignment?
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmAssignment}
              disabled={assignClassesMutation.isPending}
              className="px-6 py-2 text-sm font-bold bg-[#0047FF] text-white rounded-none hover:bg-blue-700 transition-colors shadow-theme-xs disabled:opacity-50"
            >
              {assignClassesMutation.isPending ? "Assigning..." : "Assign Player"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
