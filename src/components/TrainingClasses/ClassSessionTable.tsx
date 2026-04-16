import React, { useState } from "react";
import { Download, Printer, Plus, RefreshCw, AlertCircle, Loader2, Edit2, X as CloseIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { updateAdminNote, exportClassCSV } from "../../api/adminApi";
import { toast } from "react-hot-toast";

const AdminNoteCell: React.FC<{ playerId: string; initialNote: string }> = ({ playerId, initialNote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(initialNote);

  const mutation = useMutation({
    mutationFn: (newNote: string) => updateAdminNote(playerId, newNote),
    onSuccess: () => {
      toast.success("Admin note updated");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to update admin note");
    }
  });

  const handleSave = () => {
    mutation.mutate(note);
  };

  return (
    <>
      <div
        className="group/note flex items-center justify-between gap-2 px-4 py-2.5 text-gray-500 font-medium italic cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-lg transition-colors min-h-[40px]"
        onClick={() => setIsOpen(true)}
      >
        <span className="truncate max-w-[150px]">{note || "Add note..."}</span>
        <Edit2 size={10} className="text-gray-300 opacity-0 group-hover/note:opacity-100 transition-opacity" />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-gray-100 dark:border-white/5">
            <div className="p-6 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
              <h4 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-1.5 h-6 bg-brand-500 rounded-full"></div>
                Admin Note
              </h4>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-gray-400">
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="p-8">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 block">
                Update Player Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-32 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none dark:text-white"
                placeholder="Enter administrative notes here..."
                autoFocus
              ></textarea>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-white/[0.02] flex items-center justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={mutation.isPending}
                className="px-8 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface Player {
  playerId: string;
  name: string;
  jerseyNumber: number;
  attendance: Record<string, string>;
  phone?: string;
  guardian?: string;
  email?: string;
  dob?: string;
  ffaNumber?: string;
  hasMedical?: boolean;
  adminNote?: string;
  [key: string]: any;
}

interface ClassFullTable {
  classId: string;
  className: string;
  totalSessions: number;
  sessions: string[];
  players: Player[];
}

interface ClassSessionTableProps {
  session: string;
  classData: ClassFullTable | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onMarkAttendance?: (playerId: string, sessionDate: string, status: string) => void;
  onMarkBulkAttendance?: (sessionDate: string, status: string) => void;
}

const ClassSessionTable: React.FC<ClassSessionTableProps> = ({
  session,
  classData,
  loading,
  error,
  onRetry,
  onMarkAttendance,
  onMarkBulkAttendance,
}) => {
  const players = classData?.players || [];
  const sessions = classData?.sessions || [];
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!classData?.classId) {
      toast.error("Class ID not found");
      return;
    }
    setExporting(true);
    try {
      const blob = await exportClassCSV(classData.classId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${classData.className}_roster.csv`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      toast.success("Roster exported successfully");
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const formatFullDate = (dateStr: string) => {
    try {
      if (!dateStr) return "—";
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full px-6 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-2 h-6 bg-brand-500 rounded-full"></div>
            {classData?.className || "Class Roster"} - {session}
          </h3>
          {/* <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            2026 - Term 1 - Attendance &amp; Roster
          </p> */}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRetry}
            className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-brand-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-brand-500 transition-colors disabled:opacity-50"
            title="Export to CSV"
          >
            {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          </button>
          <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-brand-500 transition-colors">
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <Loader2 size={40} className="animate-spin text-brand-500" />
          <p className="text-sm font-bold uppercase tracking-widest">Loading class roster…</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-red-400">
          <AlertCircle size={40} />
          <p className="text-sm font-bold">{error}</p>
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-brand-500 text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && players.length === 0 && classData && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-gray-300 dark:text-white/20">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M3 7h18M3 12h18M3 17h10" />
            </svg>
          </div>
          <p className="text-sm font-bold uppercase tracking-widest">No players found</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && classData && players.length > 0 && (
        <div className="overflow-x-auto custom-scrollbar shadow-inner">
          <table className="w-full text-[11px] border-collapse min-w-[1400px]">
            <thead>
              <tr className="bg-[#1e2b5e] text-white">
                <th className="border border-white/10 px-2 py-3 font-extrabold">#</th>
                <th className="border border-white/10 px-2 py-3 font-extrabold">P</th>
                <th className="border border-white/10 px-2 py-3 font-extrabold">I</th>
                <th className="border border-white/10 px-4 py-3 text-left font-extrabold whitespace-nowrap">
                  Training - {session.split(' - ')[0]}
                </th>
                <th className="border border-white/10 px-6 py-3 text-left font-extrabold min-w-[180px]">Student</th>
                {sessions.map((_, idx) => (
                  <th key={idx} className="border border-white/10 px-2 py-3 font-extrabold bg-[#2a3a7a]">
                    {idx + 1}
                  </th>
                ))}
                <th className="border border-white/10 px-4 py-3 font-extrabold">#</th>
                <th className="border border-white/10 px-4 py-3 font-extrabold whitespace-nowrap">FFA Nr</th>
                <th className="border border-white/10 px-4 py-3 font-extrabold text-left">D.O.B</th>
                <th className="border border-white/10 px-2 py-3 font-extrabold">MED</th>
                <th className="border border-white/10 px-4 py-3 text-left font-extrabold whitespace-nowrap">Contact (Guardian / Phone)</th>
                <th className="border border-white/10 px-4 py-3 text-left font-extrabold whitespace-nowrap">Admin Note</th>
              </tr>
              <tr className="bg-brand-50 dark:bg-white/5 text-brand-700 dark:text-brand-400">
                <th colSpan={5} className="border border-gray-100 dark:border-white/5 py-1 text-[10px] font-bold text-gray-400 italic">
                  Academy Operations Registry
                </th>
                {sessions.map((date, i) => (
                  <th
                    key={i}
                    className="border border-gray-100 dark:border-white/5 px-1 py-1 text-[8px] font-extrabold uppercase group/header relative"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>{formatDate(date)}</span>
                      {onMarkBulkAttendance && (
                        <button
                          onClick={() => onMarkBulkAttendance(date, "PRESENT")}
                          className="opacity-0 group-hover/header:opacity-100 transition-opacity bg-brand-500 text-white rounded p-0.5"
                          title="Mark all present"
                        >
                          <Plus size={8} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th colSpan={6} className="border border-gray-100 dark:border-white/5 py-1"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {players.map((player, idx) => (
                <tr
                  key={player.playerId}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="border border-gray-100 dark:border-white/5 text-center px-2 py-2.5 font-bold text-gray-400">
                    {idx + 1}
                  </td>
                  <td className="border border-gray-100 dark:border-white/5 text-center px-2 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mx-auto bg-green-500"></div>
                  </td>
                  <td className="border border-gray-100 dark:border-white/5 text-center px-2 py-2.5"></td>
                  <td className="border border-gray-100 dark:border-white/5 px-4 py-2.5 text-gray-600 dark:text-gray-400 font-medium">
                    {session.split(' - ')[0]}
                  </td>
                  <td className="border border-gray-100 dark:border-white/5 px-6 py-2.5 font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors uppercase tracking-tight">
                    <div className="flex flex-col gap-0.5">
                      <span>{player.name}</span>
                      <a
                        href={`mailto:${player.email}`}
                        className="text-[12px] font-medium text-brand-600 dark:text-brand-400 hover:underline lowercase italic tracking-normal normal-case transition-colors"
                      >
                        {player.email || "—"}
                      </a>
                    </div>
                  </td>
                  {sessions.map((date, j) => {
                    const status = player.attendance ? player.attendance[date] : "NOT_MARKED";

                    const handleToggle = () => {
                      if (!onMarkAttendance) return;
                      let nextStatus = "PRESENT";
                      if (status === "PRESENT") nextStatus = "ABSENT";
                      if (status === "ABSENT") nextStatus = "NOT_MARKED";
                      onMarkAttendance(player.playerId, date, nextStatus);
                    };

                    return (
                      <td
                        key={j}
                        className="border border-gray-100 dark:border-white/5 text-center px-1 py-2.5 cursor-pointer hover:bg-brand-50/50 dark:hover:bg-brand-500/5 transition-colors"
                        onClick={handleToggle}
                        title={`Current: ${status}. Click to cycle.`}
                      >
                        <div className="flex items-center justify-center">
                          {status === 'PRESENT' ? (
                            <div className="w-5 h-5 rounded-md bg-green-500 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          ) : status === 'ABSENT' ? (
                            <div className="w-5 h-5 rounded-md bg-red-500 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-md border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-transparent hover:border-brand-300 transition-colors"></div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="border border-gray-100 dark:border-white/5 text-center px-4 py-2.5 font-bold text-indigo-600 dark:text-indigo-400">
                    {player.jerseyNumber || "—"}
                  </td>
                  <td className="border border-gray-100 dark:border-white/5 text-center px-4 py-2.5 font-bold text-gray-500">
                    {player.ffaNumber || "—"}
                  </td>
                  <td className="border border-gray-100 dark:border-white/5 px-4 py-2.5 text-gray-500 whitespace-nowrap">
                    {formatFullDate(player.dob || "")}
                  </td>
                  <td
                    className={`border border-gray-100 dark:border-white/5 text-center px-2 py-2.5 text-[9px] font-extrabold uppercase ${player.hasMedical
                      ? "text-orange-500 bg-orange-50/50 dark:bg-orange-500/10"
                      : "text-gray-300 dark:text-white/20"
                      }`}
                  >
                    {player.hasMedical ? "ALERT" : "N/A"}
                  </td>
                  <td className="border border-gray-100 dark:border-white/5 px-4 py-2.5 text-gray-700 dark:text-gray-300 font-bold">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-brand-600 dark:text-brand-400 uppercase tracking-tighter">{player.guardian || player.gurdian || "—"}</span>
                      <span className="text-[12px] text-gray-400">{player.phone || "No Phone"}</span>
                    </div>
                  </td>
                  <td className="border border-gray-100 dark:border-white/5 p-0">
                    <AdminNoteCell playerId={player.playerId} initialNote={player.adminNote || player["admin note"] || ""} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Legend */}
      {!loading && !error && classData && (
        <div className="p-6 bg-gray-50 dark:bg-white/[0.01] flex items-center justify-between border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Absent</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-bold">
            Total Enrolled: {players.length} {players.length === 1 ? "Player" : "Players"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassSessionTable;
