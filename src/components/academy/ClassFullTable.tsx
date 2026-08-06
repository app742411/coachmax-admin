import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../store";
import { setActiveRoomId } from "../../store/slices/chatSlice";
import apiClient from "../../api/apiClient";
import { useClassFullTable, useMarkSingleAttendance, useMarkBulkAttendance, useAssignClassesToPlayer, useRemoveClassFromPlayer } from "../../hooks/usePlayers";
import { Modal } from "../ui/modal";
import GenerateInvoiceModal from "../InvoiceManagement/GenerateInvoiceModal";
import PlayerDetailCard from "../players/PlayerDetailCard";
import AddCoachNoteModal from "../CoachManagement/AddCoachNoteModal";
import { chatApi } from "../../services/chatApi";

interface ClassFullTableProps {
  classId: string;
  timeSlotStr: string;
  categoryId?: string;
  programId?: string;
  categoryName?: string;
  programName?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  index?: number;
}

export default function ClassFullTable({ classId, timeSlotStr, categoryId, programId, categoryName, programName, isExpanded = true, onToggle, index }: ClassFullTableProps) {
  const { data: schedule, isLoading } = useClassFullTable(classId);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChatWithParent = async (row: any) => {
    const parentId = row.parent?.id || row.parent?._id || row.parentId;
    if (!parentId) {
      alert("Parent ID not found for this player.");
      return;
    }

    try {
      const res = await apiClient.post("/api/coach/chat/direct", { parentId });
      if (res.data && res.data.success && res.data.data) {
        const roomId = res.data.data._id;
        dispatch(setActiveRoomId(roomId));

        // Determine destination route based on role
        const userStr = localStorage.getItem("user");
        let isCoach = false;
        if (userStr) {
          try {
            const parsed = JSON.parse(userStr);
            isCoach = parsed?.role === "COACH";
          } catch (e) {
            console.error(e);
          }
        }
        navigate(isCoach ? "/messages" : "/communication");
      } else {
        alert(res.data?.message || "Failed to start conversation.");
      }
    } catch (error: any) {
      console.error("Chat redirection error:", error);
      alert(error?.response?.data?.message || "Failed to start direct conversation.");
    }
  };

  const markSingleMutation = useMarkSingleAttendance(classId);
  const markBulkMutation = useMarkBulkAttendance(classId);
  const assignClassesMutation = useAssignClassesToPlayer();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingDropData, setPendingDropData] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const removeClassMutation = useRemoveClassFromPlayer();
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const queryClient = useQueryClient();
  const [invoicePlayer, setInvoicePlayer] = useState<any | null>(null);
  const [coachNotePlayer, setCoachNotePlayer] = useState<{ playerId: string; name: string; classId?: string } | null>(null);

  const handleClassChat = async () => {
    try {
      // Use broadcastChatRoomId directly from the schedule data (returned by getClassFullTable)
      let roomId = schedule?.broadcastChatRoomId || "";

      // If no room exists yet, create one via broadcast API
      if (!roomId) {
        const broadcastRes = await chatApi.broadcastToClass(classId, "Broadcast channel active");
        if (broadcastRes && broadcastRes.success) {
          toast.success(broadcastRes.message || "Broadcast message sent successfully");
          if (broadcastRes.data?.room?._id) {
            roomId = broadcastRes.data.room._id;
          }
        } else if (broadcastRes && !broadcastRes.success) {
          toast.error(broadcastRes.message || "Failed to send broadcast");
        }
      }

      if (roomId) {
        dispatch(setActiveRoomId(roomId));
      } else {
        dispatch(setActiveRoomId(classId));
      }

      const userStr = localStorage.getItem("user");
      let isCoach = false;
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          isCoach = parsed?.role === "COACH";
        } catch (e) {
          console.error(e);
        }
      }
      navigate(isCoach ? "/messages" : "/communication");
    } catch (error) {
      console.error("Error setting up class broadcast:", error);
      dispatch(setActiveRoomId(classId));
      navigate("/messages");
    }
  };

  const handleUpdateStatus = async (userId: string, paymentStatus: string) => {
    try {
      await apiClient.put(`/api/admin/updatePaymentStatus/${userId}`, { paymentStatus });
      queryClient.invalidateQueries({ queryKey: ["classFullTable", classId] });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
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
      className={`relative border overflow-hidden shadow-theme-xs transition-colors duration-200 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 ${assignClassesMutation.isPending ? "opacity-75" : ""
        }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 pointer-events-none z-[100] border-2 border-emerald-500 bg-emerald-500/10" />
      )}
      {/* Table Header Bar */}
      <div
        className={`bg-[#031549] text-white px-5 py-2.5 flex flex-wrap gap-4 items-center justify-between ${onToggle ? 'cursor-pointer select-none' : ''}`}
        onClick={onToggle}
      >
        <div className="flex flex-wrap items-center gap-5 text-xs font-semibold flex-1">
          <div className="flex items-center gap-2">
            {index !== undefined && <span className="text-slate-300 font-bold">{index}.</span>}
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{timeSlotStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>{schedule.className}</span>
          </div>
          {schedule.coach?.name && (
            <div className="flex items-center gap-1.5 text-slate-200">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Coach {schedule.coach.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-[4px] ml-auto sm:ml-4 border border-white/5 shadow-sm">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-200">
              {categoryName || schedule.category?.name || "N/A"}
              <span className="mx-1.5 text-slate-400/60 font-normal text-xs">/</span>
              <span className="text-[#38bdf8]">{programName || schedule.program?.name || "N/A"}</span>
            </span>
          </div>
          {players.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClassChat();
              }}
              className="flex items-center gap-1.5 border border-white/20 hover:bg-white/10 text-white px-3 py-1.5 rounded-[4px] text-[10px] font-semibold transition-all active:scale-95 cursor-pointer ml-2 shadow-sm"
              title="Text Class Parents"
            >
              <svg className="w-3.5 h-3.5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {schedule?.broadcastChatRoomId ? "Text Class" : "Chat Active"}
            </button>
          )}
        </div>
        {onToggle && (
          <div className="ml-2 pl-4 border-l border-white/10 shrink-0">
            <svg className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {/* Attendance Grid Table */}
      {isExpanded && (
        <div className={`overflow-x-auto custom-scrollbar transition-[min-height] duration-150 ${openMenuId ? 'min-h-[260px]' : ''}`}>
          <table className="w-full text-left border-separate border-spacing-0 text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                <th className="sticky left-0 z-20 bg-[#f8fafc] dark:bg-slate-900 py-2.5 px-4 min-w-[40px] w-[40px] border-b border-slate-100 dark:border-slate-800">#</th>
                <th className="sticky left-[40px] z-20 bg-[#f8fafc] dark:bg-slate-900 py-2.5 px-3 min-w-[150px] w-[150px] border-b border-slate-100 dark:border-slate-800">Player</th>
                <th className="sticky left-[190px] z-20 bg-[#f8fafc] dark:bg-slate-900 py-2.5 px-3 min-w-[90px] w-[90px] border-b border-slate-100 dark:border-slate-800">DOB</th>
                <th className="sticky left-[280px] z-20 bg-[#f8fafc] dark:bg-slate-900 py-2.5 px-3 text-center min-w-[130px] w-[130px] border-b border-slate-100 dark:border-slate-800 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">Medical Conditions</th>
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
                <th className="right-0 z-20 bg-[#f8fafc] dark:bg-slate-900 py-2.5 px-4 min-w-[70px] w-[70px] text-center border-l border-b border-slate-100 dark:border-slate-800 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)]"></th>
              </tr>
            </thead>
            <tbody>
              {players.length > 0 ? players.map((row: any, idx: number) => (
                <tr key={row.playerId} className={`group border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/40 dark:hover:bg-slate-800/10 ${openMenuId === row.playerId ? 'relative z-30' : ''}`}>
                  <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 py-2 px-4 font-semibold text-slate-400 min-w-[40px] w-[40px] border-b border-slate-50 dark:border-slate-800/40">{idx + 1}</td>
                  <td className="sticky left-[40px] z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 py-2 px-3 min-w-[150px] w-[150px] border-b border-slate-50 dark:border-slate-800/40">
                    <div className="flex items-center gap-2">
                      <span
                        title={row.paymentStatus || "UNKNOWN"}
                        className={`w-3 h-3 rounded-full shrink-0 border border-white dark:border-slate-800 shadow-sm ${row.paymentStatus === "PAID" || row.paymentStatus === "APPROVED" ? "bg-emerald-500" :
                          row.paymentStatus === "REJECTED" || row.paymentStatus === "TRIAL" ? "bg-rose-500" :
                            row.paymentStatus === "UNPAID" ? "bg-amber-500" :
                              "bg-amber-500"
                          }`}
                      />
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold">{row.name.charAt(0)}</span>
                      </div>
                      <button
                        onClick={() => setSelectedPlayer({
                          _id: row.playerId,
                          fullName: row.name,
                          dob: row.dob,
                          jerseyNumber: row.jerseyNumber || "-",
                          preferredFoot: row.preferredFoot || "N/A",
                          status: row.paymentStatus || "PENDING",
                          program: schedule?.program,
                          category: schedule?.category
                        })}
                        className="font-bold text-slate-700 dark:text-slate-200 hover:text-[#0047FF] dark:hover:text-[#336eff] text-left hover:underline transition-all"
                      >
                        {row.name}
                      </button>
                    </div>
                  </td>
                  <td className="sticky left-[190px] z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 py-2 px-3 font-semibold text-slate-500 min-w-[90px] w-[90px] border-b border-slate-50 dark:border-slate-800/40">{new Date(row.dob).toLocaleDateString()}</td>
                  <td className="sticky left-[280px] z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 py-2 px-3 text-center min-w-[130px] w-[130px] border-b border-slate-50 dark:border-slate-800/40 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">
                    {row.isMedicalCondition ? (
                      <span className="text-rose-600 font-bold text-xs truncate block max-w-full" title={row.medicalConditionDetails}>
                        {row.medicalConditionDetails || "Yes"}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold">- No</span>
                    )}
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
                  <td className={`sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 py-2 px-4 text-center border-l border-b border-slate-50 dark:border-slate-800/40 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)] ${openMenuId === row.playerId ? 'z-40' : 'z-10'}`}>
                    <div className="flex items-center justify-center relative">
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
                      <div className={`absolute right-10 ${idx >= 3 || (players.length > 1 && idx >= players.length - 2) ? 'bottom-8' : 'top-8'} w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-[500] animate-in fade-in zoom-in-95 duration-100 py-1.5 overflow-hidden`}>
                        {(() => {
                          const userStr = localStorage.getItem("user");
                          let isCoach = false;
                          if (userStr) {
                            try {
                              const parsed = JSON.parse(userStr);
                              if (parsed?.role === "COACH") {
                                isCoach = true;
                              }
                            } catch (e) {
                              console.error(e);
                            }
                          }

                          if (isCoach) {
                            return (
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    setCoachNotePlayer({
                                      playerId: row.playerId,
                                      name: row.name,
                                      classId
                                    });
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                  Add Coach Note
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    handleChatWithParent(row);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-700 mt-1 pt-1"
                                >
                                  Chat
                                </button>
                              </div>
                            );
                          }

                          return (
                            <>
                              <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 mb-1">
                                Update Status
                              </div>
                              {["TRIAL", "UNPAID", "PAID", "OVER_DUE"]
                                .filter(status => status !== row.paymentStatus)
                                .map((status) => {
                                  let activeClasses = "";

                                  if (status === "PAID") {
                                    activeClasses = "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20";
                                  } else if (status === "UNPAID") {
                                    activeClasses = "text-slate-700 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20";
                                  } else if (status === "OVER_DUE" || status === "TRIAL") {
                                    activeClasses = "text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/20";
                                  }

                                  return (
                                    <button
                                      key={status}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(null);
                                        handleUpdateStatus(row.playerId, status);
                                      }}
                                      className={`w-full text-left px-4 py-1.5 text-xs font-semibold transition-colors ${activeClasses}`}
                                    >
                                      {status.replace("_", " ")}
                                    </button>
                                  );
                                })}
                              <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    handleChatWithParent(row);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                  Chat
                                </button>
                              </div>
                              <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    setInvoicePlayer({
                                      _id: row.playerId,
                                      name: row.name,
                                      parentId: row.parent?.id || row.parent?._id || row.parentId
                                    });
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-700 mt-1 pt-1"
                                >
                                  Generate Invoice
                                </button>
                              </div>
                              <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
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
                            </>
                          );
                        })()}
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
      )}

      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="max-w-2xl p-6">
        <div className="w-full">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Confirm Assignment</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            The player requested a different program or category than the one you are assigning them to. Please review the details below before proceeding.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">Requested</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Category:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{pendingDropData?.categoryName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Program:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{pendingDropData?.programName || "N/A"}</span>
                </div>
                {pendingDropData?.preferredClasses && pendingDropData.preferredClasses.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Preferred Classes:</span>
                    <ul className="space-y-1">
                      {pendingDropData.preferredClasses.map((c: any) => (
                        <li key={c.id} className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1">
                          {c.dayOfWeek.substring(0, 3)} {c.startTime}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
              <h4 className="text-xs font-bold text-[#0047FF] mb-3 uppercase">Assigning To</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Category:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{categoryName || schedule.category?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Program:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{programName || schedule.program?.name || "N/A"}</span>
                </div>
                <div className="pt-3 border-t border-blue-200 dark:border-blue-800/50 mt-3">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Class:</span>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded px-2 py-1 inline-block">
                    {timeSlotStr} - {schedule.className}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors border border-transparent hover:border-slate-300 rounded-none"
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

      <GenerateInvoiceModal
        isOpen={!!invoicePlayer}
        onClose={() => setInvoicePlayer(null)}
        player={invoicePlayer}
      />

      {selectedPlayer && (
        <PlayerDetailCard
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      {coachNotePlayer && (
        <AddCoachNoteModal
          isOpen={coachNotePlayer !== null}
          onClose={() => setCoachNotePlayer(null)}
          playerId={coachNotePlayer.playerId}
          playerName={coachNotePlayer.name}
          classId={coachNotePlayer.classId}
        />
      )}
    </div>
  );
}
