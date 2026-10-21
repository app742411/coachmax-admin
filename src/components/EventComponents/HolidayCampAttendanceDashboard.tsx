// src/components/EventComponents/HolidayCampAttendanceDashboard.tsx
import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  Check,
  X,
  Search,
  Filter,
  Users,
  ChevronDown,
  ChevronRight,
  Sun,
  Clock,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Edit,
  Save,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getEventAttendanceGrid,
  markEventSingleAttendance,
  markEventBulkAttendance,
  getEventRegistrationDetails,
  updateEventRegistrationPaymentStatus
} from "../../api/eventApi";
import {
  StatusIcon,
  getPlayerStatusTextClass,
  StatusUpdateMenuList,
  StatusColorCode
} from "../common/StatusColorCode";
import { AttendanceCellFlag, AttendanceStatusDropdown } from "../common/AttendanceReasonMenu";
import { useSidebarBadges } from "../../hooks/useSidebarBadges";

interface HolidayCampAttendanceDashboardProps {
  eventId: string;
}

export const HolidayCampAttendanceDashboard: React.FC<HolidayCampAttendanceDashboardProps> = ({ eventId }) => {
  const { markItemAsRead, isItemRead } = useSidebarBadges();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingRegistration, setViewingRegistration] = useState<any>(null);
  const [updatingCell, setUpdatingCell] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; placement: 'top' | 'bottom' } | null>(null);
  const [openAttendanceMenu, setOpenAttendanceMenu] = useState<{
    playerId: string;
    sessionId: string;
    sessionDate: string;
    currentStatus: string;
    currentReason?: string;
    markedByParent?: boolean;
    playerName?: string;
  } | null>(null);
  const [attendanceMenuPos, setAttendanceMenuPos] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = () => {
    if (!openMenuId) return;
    const trigger = document.getElementById(`trigger-${openMenuId}`);
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 240;
    const menuEl = document.getElementById("portal-action-menu");
    const menuHeight = menuEl ? menuEl.offsetHeight : 280;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top = rect.bottom + window.scrollY;
    let placement: 'top' | 'bottom' = 'bottom';

    if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
      top = rect.top - menuHeight + window.scrollY;
      placement = 'top';
    }

    let left = rect.right - menuWidth + window.scrollX;
    if (left < 10) left = 10;

    setMenuPosition({ top, left, placement });
  };

  useEffect(() => {
    if (openMenuId) {
      updatePosition();
      const handleScrollOrResize = () => updatePosition();
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest("#portal-action-menu") && !target.closest(`[id^="trigger-"]`)) {
          setOpenMenuId(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    } else {
      setMenuPosition(null);
    }
  }, [openMenuId]);

  const handleUpdatePaymentStatus = async (registrationId: string, playerId: string, newStatus: string) => {
    try {
      if (registrationId) {
        markItemAsRead("eventRegistrations", registrationId);
      }
      await updateEventRegistrationPaymentStatus(registrationId, newStatus, { eventId, playerId });
      setData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.map((pl: any) =>
            pl.playerId === playerId ? { ...pl, paymentStatus: newStatus } : pl
          ),
        };
      });
      toast.success(`Payment status updated to ${newStatus}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update payment status");
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await getEventAttendanceGrid(eventId);
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load holiday camp attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchAttendance();
    }
  }, [eventId]);

  const handleOpenAttendanceMenu = (
    playerId: string,
    sessionId: string,
    dateStr: string,
    currentStatus: string,
    currentReason: string,
    markedByParent: boolean,
    playerName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const menuWidth = 220;
    const menuHeight = 240;
    let top = rect.bottom + window.scrollY;
    let left = rect.left + window.scrollX;
    if (rect.bottom + menuHeight > window.innerHeight) {
      top = rect.top - menuHeight + window.scrollY;
    }
    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - 10;
    }

    setAttendanceMenuPos({ top, left });
    setOpenAttendanceMenu({
      playerId,
      sessionId,
      sessionDate: dateStr,
      currentStatus,
      currentReason: currentReason || "",
      markedByParent: markedByParent || false,
      playerName: playerName || "",
    });
  };

  const handleSetAttendanceStatus = async (status: string, reason?: string) => {
    if (!openAttendanceMenu) return;
    const { playerId, sessionId, sessionDate } = openAttendanceMenu;
    setOpenAttendanceMenu(null);

    const cellKey = `${playerId}_${sessionId}`;
    setUpdatingCell(cellKey);

    try {
      await markEventSingleAttendance(eventId, {
        sessionDate,
        campSessionId: sessionId,
        playerId,
        status,
        reason,
      });

      // Optimistic update
      setData((prev: any) => {
        if (!prev) return prev;
        const newPlayers = prev.players.map((p: any) => {
          if (p.playerId === playerId) {
            return {
              ...p,
              attendance: {
                ...p.attendance,
                [sessionId]: {
                  ...p.attendance[sessionId],
                  status,
                  reason: reason !== undefined ? reason : p.attendance[sessionId]?.reason,
                },
              },
            };
          }
          return p;
        });

        // Update session summary counts
        const newSummaries = prev.sessionSummaries.map((s: any) => {
          if (s.sessionId === sessionId) {
            let presentCount = 0;
            let absentCount = 0;
            newPlayers.forEach((p: any) => {
              const att = p.attendance[sessionId];
              if (att && att.isRegistered) {
                if (att.status === "PRESENT" || att.status === "LATE") presentCount++;
                if (att.status === "ABSENT") absentCount++;
              }
            });
            return { ...s, presentCount, absentCount };
          }
          return s;
        });

        return { ...prev, players: newPlayers, sessionSummaries: newSummaries };
      });

      toast.success(
        reason
          ? `Attendance updated to ${status} with reason`
          : `Attendance updated to ${status}`
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update attendance");
    } finally {
      setUpdatingCell(null);
    }
  };

  const handleToggleAttendance = async (playerId: string, sessionId: string, dateStr: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PRESENT" ? "ABSENT" : currentStatus === "ABSENT" ? "NOT_MARKED" : "PRESENT";
    const cellKey = `${playerId}_${sessionId}`;
    setUpdatingCell(cellKey);

    try {
      await markEventSingleAttendance(eventId, {
        sessionDate: dateStr,
        campSessionId: sessionId,
        playerId,
        status: nextStatus,
      });

      // Optimistic update
      setData((prev: any) => {
        if (!prev) return prev;
        const newPlayers = prev.players.map((p: any) => {
          if (p.playerId === playerId) {
            return {
              ...p,
              attendance: {
                ...p.attendance,
                [sessionId]: {
                  ...p.attendance[sessionId],
                  status: nextStatus,
                },
              },
            };
          }
          return p;
        });

        // Update session summary counts
        const newSummaries = prev.sessionSummaries.map((s: any) => {
          if (s.sessionId === sessionId) {
            let presentCount = 0;
            let absentCount = 0;
            newPlayers.forEach((p: any) => {
              const att = p.attendance[sessionId];
              if (att && att.isRegistered) {
                if (att.status === "PRESENT") presentCount++;
                if (att.status === "ABSENT") absentCount++;
              }
            });
            return { ...s, presentCount, absentCount };
          }
          return s;
        });

        return { ...prev, players: newPlayers, sessionSummaries: newSummaries };
      });

      toast.success(`Marked as ${nextStatus.toLowerCase()}`, { duration: 1500 });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update attendance");
    } finally {
      setUpdatingCell(null);
    }
  };

  const handleOpenRegistrationDetails = async (regId: string) => {
    try {
      if (regId) {
        markItemAsRead("eventRegistrations", regId);
      }
      const res = await getEventRegistrationDetails(regId);
      if (res.success) {
        setViewingRegistration(res.data);
      }
    } catch (e) {
      toast.error("Failed to load registration details");
    }
  };

  // Group sessions into Week 1, Week 2, etc. (matching screenshot)
  const groupedSessionsByWeek = useMemo(() => {
    if (!data?.sessions) return [];
    const sessions = data.sessions;
    const weeks: { weekLabel: string; dateRangeLabel: string; sessions: any[] }[] = [];

    // Distinct dates
    const distinctDates: string[] = Array.from(new Set<string>(sessions.map((s: any) => new Date(s.sessionDate).toISOString().split("T")[0]))).sort();

    // Group into chunks of up to 5 days (Mon-Fri)
    const chunkSize = 5;
    for (let i = 0; i < distinctDates.length; i += chunkSize) {
      const chunk = distinctDates.slice(i, i + chunkSize);
      const weekNum = Math.floor(i / chunkSize) + 1;
      const firstDate = new Date(chunk[0]);
      const lastDate = new Date(chunk[chunk.length - 1]);

      const dateRangeLabel = `${firstDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })} - ${lastDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}`;

      const weekSessions = sessions.filter((s: any) => {
        const dStr = new Date(s.sessionDate).toISOString().split("T")[0];
        return chunk.includes(dStr);
      });

      weeks.push({
        weekLabel: `Week ${weekNum}`,
        dateRangeLabel,
        sessions: weekSessions,
      });
    }

    return weeks;
  }, [data?.sessions]);

  // Distinct dates across all sessions for column headers
  const distinctDates = useMemo(() => {
    if (!data?.sessions) return [];
    const map = new Map<string, { dateStr: string; dayOfWeek: string; formattedDay: string; sessions: any[] }>();

    data.sessions.forEach((s: any) => {
      const d = new Date(s.sessionDate);
      const dStr = d.toISOString().split("T")[0];
      if (!map.has(dStr)) {
        map.set(dStr, {
          dateStr: dStr,
          dayOfWeek: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
          formattedDay: `${d.getUTCDate()}/${d.getUTCMonth() + 1}`,
          sessions: [],
        });
      }
      map.get(dStr)!.sessions.push(s);
    });

    return Array.from(map.values()).sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  }, [data?.sessions]);

  // Filter players
  const filteredPlayers = useMemo(() => {
    if (!data?.players) return [];
    return data.players.filter((p: any) => {
      const matchesSearch = !searchQuery ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const st = (p.paymentStatus || "").toUpperCase();
      const filterUpper = statusFilter.toUpperCase();

      const matchesStatus =
        statusFilter === "all" ||
        st === filterUpper ||
        (statusFilter === "paid" && (st === "PAID" || st === "APPROVED" || st === "ACTIVE")) ||
        (statusFilter === "unpaid" && st !== "PAID" && st !== "APPROVED" && st !== "ACTIVE");

      return matchesSearch && matchesStatus;
    });
  }, [data?.players, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent" />
      </div>
    );
  }

  if (!data || !data.sessions || data.sessions.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <Calendar size={36} className="mx-auto text-gray-400 mb-2" />
        <h4 className="text-base font-bold text-gray-800 dark:text-white">No Camp Sessions Configured</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
          This holiday camp does not currently have any configured dates or sessions. Edit the event to enable dates and Full Day / Half Day pricing.
        </p>
      </div>
    );
  }

  const event = data.event;

  return (
    <div className="space-y-3">
      {/* Top Banner Card (matching screenshot top bar) */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2.5 px-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded border border-amber-200 dark:border-amber-900/50 flex items-center justify-center shrink-0">
            <Sun size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm md:text-base font-bold text-[#031549] dark:text-white leading-tight">{event.title}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 text-[10px] font-bold rounded-full border border-green-200 dark:border-green-800">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Registrations Open
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-brand-500" />
                {new Date(event.startDate).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })} - {new Date(event.endDate).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span>•</span>
              <span>{event.venueName || event.address}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white w-44 focus:w-56 transition-all outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white outline-none font-medium"
          >
            <option value="all">All Payments</option>
            <option value="PAID">PAID</option>
            <option value="HANDSHAKE">HANDSHAKE</option>
            <option value="UNPAID">APPROVED (UNPAID)</option>
            <option value="TRIAL">TRIAL</option>
            <option value="TBC">TBC</option>
            <option value="EXTRA">EXTRA</option>
          </select>
        </div>
      </div>

      {/* Main Full-Width Player Attendance Matrix */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            {/* Header: Week Grouping */}
            <thead>
              <tr className="bg-[#031549] text-white">
                <th className="py-2 px-2 w-10 text-center border-r border-[#082269]">#</th>
                <th className="py-2 px-3 w-56 text-left border-r border-[#082269]">PLAYER</th>
                <th className="py-2 px-2 w-20 text-center border-r border-[#082269]">DOB</th>
                {groupedSessionsByWeek.map((week, idx) => (
                  <th
                    key={week.weekLabel}
                    colSpan={week.sessions.length > 0 ? Array.from(new Set(week.sessions.map((s: any) => new Date(s.sessionDate).toISOString().split("T")[0]))).length : 1}
                    className={`py-1.5 px-2 text-center font-bold tracking-wider ${
                      idx % 2 === 0 ? "bg-[#031549]" : "bg-[#06206d]"
                    } border-r border-[#082269]`}
                  >
                    <div className="text-xs">{week.weekLabel}</div>
                    <div className="text-[9px] font-normal text-gray-300">{week.dateRangeLabel}</div>
                  </th>
                ))}
                <th className="py-2 px-2 w-14 text-center">ACTION</th>
              </tr>

              {/* Sub-header: Individual Dates */}
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[10px] border-b border-gray-200 dark:border-gray-700">
                <th className="py-1 px-1 border-r border-gray-200 dark:border-gray-700"></th>
                <th className="py-1 px-1 border-r border-gray-200 dark:border-gray-700"></th>
                <th className="py-1 px-1 border-r border-gray-200 dark:border-gray-700"></th>
                {distinctDates.map((d) => (
                  <th key={d.dateStr} className="py-1 px-1 text-center border-r border-gray-200 dark:border-gray-700 min-w-[65px]">
                    <div className="text-[9px] text-gray-400 font-medium">{d.dayOfWeek}</div>
                    <div className="text-[11px] font-bold text-gray-800 dark:text-white">{d.formattedDay}</div>
                  </th>
                ))}
                <th className="py-1 px-1"></th>
              </tr>
            </thead>

            {/* Body: Player Rows */}
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((p: any) => (
                  <tr key={p.playerId} className="hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition-colors">
                    {/* Row Number */}
                    <td className="py-2 px-2 text-center text-gray-400 font-medium border-r border-gray-100 dark:border-gray-800">
                      {p.rowNumber}
                    </td>

                    {/* Player Info - Program Style with Status Icon and Color */}
                    <td className="py-2 px-3 border-r border-gray-100 dark:border-gray-800 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        {/* Program-style Payment Status Icon Indicator & Unread Indicator */}
                        <div className="flex items-center gap-1 shrink-0">
                          {!isItemRead("eventRegistrations", p.registrationId) && p.paymentStatus !== "PAID" && (
                            <span
                              className="w-2 h-2 rounded-full bg-rose-500 shrink-0"
                              title="Unread Registration"
                            />
                          )}
                          <div 
                            className="w-4 h-4 flex items-center justify-center shrink-0"
                            title={["TRIAL", "TBC", "EXTRA", "OTHERS", "SUBSTITUTE"].includes((p.paymentStatus || "").toUpperCase()) ? (p.paymentStatus || "").toUpperCase() : undefined}
                          >
                            <StatusIcon status={p.paymentStatus} size="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-[#031549] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {p.name ? p.name.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div className="truncate min-w-0 flex-1">
                          <span
                            onClick={() => handleOpenRegistrationDetails(p.registrationId)}
                            title={p.name}
                            className={`font-bold hover:underline cursor-pointer truncate block text-xs leading-tight ${getPlayerStatusTextClass(p.paymentStatus)}`}
                          >
                            {p.name}
                          </span>
                          <span className="text-[10px] text-gray-400 block truncate">{p.email || p.phone || "Participant"}</span>
                        </div>
                      </div>
                    </td>

                    {/* DOB */}
                    <td className="py-2 px-2 text-center text-gray-500 dark:text-gray-400 font-medium border-r border-gray-100 dark:border-gray-800 whitespace-nowrap text-xs">
                      {p.dob ? new Date(p.dob).toLocaleDateString("en-GB") : "-"}
                    </td>

                    {/* Date Cells */}
                    {distinctDates.map((d) => {
                      const matchingSession = d.sessions.find((s: any) => {
                        const att = p.attendance[s._id.toString()];
                        return att && att.isRegistered;
                      }) || d.sessions[0];

                      const sessId = matchingSession?._id?.toString();
                      const att = sessId ? p.attendance[sessId] : null;
                      const isRegistered = att?.isRegistered;
                      const sessionType = att?.sessionType || matchingSession?.sessionType || "FULL_DAY";
                      const status = att?.status || "NOT_REGISTERED";
                      const isUpdating = updatingCell === `${p.playerId}_${sessId}`;

                      return (
                        <td
                          key={d.dateStr}
                          className="relative py-1 px-1 text-center border-r border-gray-100 dark:border-gray-800 align-middle group/cell"
                        >
                          {isRegistered ? (
                            <div className="relative inline-block">
                              <AttendanceCellFlag
                                reason={att?.reason}
                                markedByParent={att?.markedByParent}
                                status={status}
                              />
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={(e) =>
                                  handleOpenAttendanceMenu(
                                    p.playerId,
                                    sessId,
                                    d.dateStr,
                                    status,
                                    att?.reason || "",
                                    att?.markedByParent || false,
                                    p.name,
                                    e
                                  )
                                }
                                title={`${sessionType === "FULL_DAY" ? "Full Day (8am-4pm)" : "Half Day (8am-2pm)"} - Status: ${status}${att?.reason ? ` (Reason: ${att.reason})` : ''} - Click to update`}
                                className={`w-8 h-8 mx-auto flex items-center justify-center rounded transition-all transform active:scale-90 ${
                                  sessionType === "FULL_DAY"
                                    ? "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
                                    : "bg-[#93c5fd] text-[#1e3a8a] hover:bg-[#60a5fa]"
                                } ${isUpdating ? "opacity-40 animate-pulse" : ""}`}
                              >
                                {status === "PRESENT" && (
                                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                    <Check size={11} strokeWidth={3} />
                                  </div>
                                )}
                                {status === "ABSENT" && (
                                  <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center shadow-sm">
                                    <X size={11} strokeWidth={3} />
                                  </div>
                                )}
                                {status === "LATE" && (
                                  <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                                    <Clock size={11} strokeWidth={3} />
                                  </div>
                                )}
                                {(status === "NOT_MARKED" || status === "NOT_REGULAR") && (
                                  <span className="text-[10px] font-bold opacity-80">
                                    {sessionType === "FULL_DAY" ? "FD" : "HD"}
                                  </span>
                                )}
                              </button>
                            </div>
                          ) : (
                            <div className="w-8 h-8 mx-auto flex items-center justify-center text-gray-300 dark:text-gray-600 font-bold text-xs bg-gray-50/50 dark:bg-gray-800/20 rounded">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Three-Dot Action Button for Payment Status Update */}
                    <td className="py-1 px-1 text-center border-l border-gray-100 dark:border-gray-800 min-w-[46px] w-[46px]">
                      <div className="flex items-center justify-center relative">
                        <button
                          id={`trigger-${p.playerId}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === p.playerId ? null : p.playerId);
                          }}
                          className={`p-1 border rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm inline-flex items-center justify-center ${
                            openMenuId === p.playerId
                              ? "border-[#0047FF] bg-blue-50/50 dark:bg-blue-950/20 text-[#0047FF]"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                          }`}
                          title="Update Payment Status / View Details"
                        >
                          <svg className="w-3.5 h-3.5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={distinctDates.length + 4} className="py-8 text-center text-gray-400 text-xs">
                    No participants match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Footer: TOTAL REGISTERED & Summary counts per date */}
            <tfoot>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-bold border-t-2 border-gray-300 dark:border-gray-700">
                <td colSpan={3} className="py-2 px-3 text-left tracking-wider text-xs border-r border-gray-200 dark:border-gray-700">
                  TOTAL REGISTERED
                </td>
                {distinctDates.map((d) => {
                  let totalDateReg = 0;
                  let fullDayReg = 0;
                  let halfDayReg = 0;

                  d.sessions.forEach((s: any) => {
                    const summary = (data.sessionSummaries || []).find((ss: any) => ss.sessionId === s._id.toString());
                    const regCount = summary?.registeredCount || 0;
                    totalDateReg += regCount;
                    if (s.sessionType === "FULL_DAY") fullDayReg += regCount;
                    if (s.sessionType === "HALF_DAY") halfDayReg += regCount;
                  });

                  return (
                    <td key={d.dateStr} className="py-1 px-1 text-center border-r border-gray-200 dark:border-gray-700">
                      <div className="text-xs font-black text-[#031549] dark:text-white">{totalDateReg}</div>
                      <div className="text-[8px] text-sky-600 dark:text-sky-400 font-semibold leading-tight">
                        {halfDayReg} (2pm)
                      </div>
                      <div className="text-[8px] text-blue-700 dark:text-blue-300 font-semibold leading-tight">
                        {fullDayReg} (4pm)
                      </div>
                    </td>
                  );
                })}
                <td className="py-1 px-1"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Color Legend & Program Status Legend */}
        <div className="p-2.5 px-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#93c5fd] inline-block shadow-sm" />
              <span>8:00am - 2:00pm ($70 Half Day)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#1d4ed8] inline-block shadow-sm" />
              <span>8:00am - 4:00pm ($90 Full Day)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 inline-block text-center text-gray-400 leading-4 text-[10px]">
                -
              </span>
              <span>No registration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check size={10} strokeWidth={3} />
              </div>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Present (Attendance marked)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
                <Clock size={10} strokeWidth={3} />
              </div>
              <span className="text-amber-700 dark:text-amber-400 font-bold">Late</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center">
                <X size={10} strokeWidth={3} />
              </div>
              <span className="text-red-700 dark:text-red-400 font-bold">Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <span className="text-gray-600 dark:text-gray-400 font-bold">Reason Attached (Hover flag to view)</span>
            </div>
          </div>

          {/* Program Status Color Code Legend */}
          <div className="pt-1.5 border-t border-gray-200/60 dark:border-gray-700/60">
            <StatusColorCode />
          </div>
        </div>
      </div>

      {/* Portal Menu for 3-Dot Payment Status Update (Program style) */}
      {openMenuId && menuPosition && (() => {
        const activePlayer = data?.players?.find((pl: any) => pl.playerId === openMenuId);
        if (!activePlayer) return null;
        return createPortal(
          <div
            id="portal-action-menu"
            style={{
              position: "absolute",
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              width: "240px",
            }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-[99999] py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 rounded-none flex flex-col"
          >
            {/* Header: Player Name & Current Status */}
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50">
              <span className="text-xs font-bold text-gray-800 dark:text-white block truncate">
                {activePlayer.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-gray-400">Payment Status:</span>
                <span className={`text-[10px] font-bold uppercase ${getPlayerStatusTextClass(activePlayer.paymentStatus)}`}>
                  {activePlayer.paymentStatus}
                </span>
              </div>
            </div>

            {/* Status Update Menu List from StatusColorCode */}
            <StatusUpdateMenuList
              currentStatus={activePlayer.paymentStatus}
              onSelectStatus={(newStatus) => {
                setOpenMenuId(null);
                handleUpdatePaymentStatus(activePlayer.registrationId, activePlayer.playerId, newStatus);
              }}
            />

            <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(null);
                  handleOpenRegistrationDetails(activePlayer.registrationId);
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
              >
                <FileText size={14} className="text-brand-500" />
                View Registration & Invoice
              </button>
            </div>
          </div>,
          document.body
        );
      })()}

      {/* Registration Details & Invoice Modal */}
      {viewingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 bg-[#031549] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText size={18} className="text-brand-400" />
                  Player Registration & Camp Invoice
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  {viewingRegistration.registration?.user?.fullName} — {event.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingRegistration(null)}
                className="p-1 hover:bg-white/10 rounded text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Status</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">
                    {viewingRegistration.registration?.status}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Payment Status</span>
                  <span
                    className={`text-sm font-bold ${
                      viewingRegistration.registration?.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {viewingRegistration.registration?.paymentStatus}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Amount</span>
                  <span className="text-sm font-bold text-[#031549] dark:text-brand-400">
                    ${viewingRegistration.registration?.totalAmount || 0}
                  </span>
                </div>
              </div>

              {/* Booked Sessions Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Booked Camp Sessions
                </h4>
                <div className="border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800">
                  {(viewingRegistration.registration?.selectedSessions || []).map((s: any, idx: number) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-gray-800 dark:text-white block">
                          {new Date(s.sessionDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="text-gray-400 text-[11px]">
                          {s.sessionType === "FULL_DAY" ? "Full Day" : "Half Day"} • {s.startTime} - {s.endTime}
                        </span>
                      </div>
                      <span className="font-bold text-gray-800 dark:text-white text-sm">
                        ${s.fee}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Associated Invoice Link */}
              {viewingRegistration.registration?.invoice && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-950 dark:text-blue-200 block">
                      Invoice #{viewingRegistration.registration.invoice.invoiceNumber}
                    </span>
                    <span className="text-[11px] text-blue-700 dark:text-blue-400">
                      Total: ${viewingRegistration.registration.invoice.totalAmount} • Status: {viewingRegistration.registration.invoice.paymentStatus}
                    </span>
                  </div>
                  <a
                    href={`/invoices/${viewingRegistration.registration.invoice._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#031549] text-white hover:bg-brand-600 text-xs font-bold transition-all shadow-sm"
                  >
                    View Invoice
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingRegistration(null)}
                className="px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-white text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Status & Reason Dropdown (Portal) */}
      {openAttendanceMenu && attendanceMenuPos && (
        <AttendanceStatusDropdown
          isOpen={Boolean(openAttendanceMenu)}
          position={attendanceMenuPos}
          currentStatus={openAttendanceMenu.currentStatus}
          currentReason={openAttendanceMenu.currentReason}
          markedByParent={openAttendanceMenu.markedByParent}
          playerName={openAttendanceMenu.playerName}
          sessionDateStr={openAttendanceMenu.sessionDate}
          onSelectStatus={handleSetAttendanceStatus}
          onClose={() => setOpenAttendanceMenu(null)}
        />
      )}
    </div>
  );
};

export default HolidayCampAttendanceDashboard;
