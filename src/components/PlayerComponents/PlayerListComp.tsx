import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getUsers, processPlayerRequest, exportUsers } from "../../api/userApi";
import { CalendarIcon, Download, CheckSquare, Square, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import PageBreadcrumb from "../common/PageBreadcrumb";
import Select from "../form/Select";
// import { User } from "../../types/player"; // Decoupled

// Extracted Components
import PlayerTableRow from "./PlayerTableRow";
import PlayerDetailsModal from "./PlayerDetailsModal";
import RejectModal from "./RejectModal";
import ExportDataModal from "./ExportDataModal";
import TrainingScheduleModal from "./TrainingScheduleModal";
import AssignClassModal from "./AssignClassModal";

// Inline SearchIcon
const SearchIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlayerListComp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"APPROVED" | "PENDING" | "REJECTED">("APPROVED");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAssignClassOpen, setIsAssignClassOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [programType, setProgramType] = useState<string>("");

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length && users.length > 0) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(u => u._id));
    }
  };

  const handleExport = async (format: "excel" | "csv", filters?: any) => {
    setExportLoading(true);
    try {
      const exportData: any = { format };
      if (selectedUserIds.length > 0) {
        exportData.userIds = selectedUserIds;
      } else if (filters) {
        if (filters.status) exportData.status = filters.status;
        if (filters.programType) exportData.programType = filters.programType;
        if (filters.search) exportData.search = filters.search;
      }

      const blob = await exportUsers(exportData);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `players_export_${new Date().getTime()}.${format === "excel" ? "xlsx" : "csv"}`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      toast.success(`${format.toUpperCase()} export successful`);
    } catch (err) {
      console.error(err);
      toast.error("Export failed.");
    } finally {
      setExportLoading(false);
      setIsExportOpen(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers(activeTab, page, limit, search, programType);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch players.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, search, programType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Are you sure you want to approve this player?")) return;
    setActionLoading(true);
    try {
      await processPlayerRequest(id, "APPROVED");
      toast.success("Player approved successfully!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve player.");
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (user: any) => {
    setSelectedUser(user);
    setRejectReason("");
    setIsRejectOpen(true);
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectReason) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    setActionLoading(true);
    try {
      await processPlayerRequest(selectedUser._id, "REJECTED", rejectReason);
      toast.success("Player rejected successfully!");
      setIsRejectOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject player.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePlayer = async (updatedUser: any) => {
    // Sync state or re-fetch
    fetchUsers();
    toast.success("Player updated successfully!");
  };

  const openDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const openSchedule = (user: any) => {
    setSelectedUser(user);
    setIsScheduleOpen(true);
  };

  const openAssignClass = (user: any) => {
    setSelectedUser(user);
    setIsAssignClassOpen(true);
  };

  const tabs = [
    { title: "Users (Approved)", value: "APPROVED" },
    { title: "Pending", value: "PENDING" },
    { title: "Rejected", value: "REJECTED" },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Players Management" />

      {/* TABS & SEARCH */}
      <div className="mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value as any);
                setPage(1);
              }}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.value
                ? "bg-white dark:bg-white/10 text-brand-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          {selectedUserIds.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-xl dark:bg-white/5 border border-brand-500/20">
              <span className="text-[10px] font-bold text-brand-500">{selectedUserIds.length} Selected</span>
              <button onClick={() => setSelectedUserIds([])} className="text-brand-500 hover:text-brand-700">
                <Trash2 size={12} />
              </button>
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setIsExportOpen(true)}
              disabled={exportLoading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-500/10 hover:bg-brand-500/20 rounded-xl text-xs font-bold text-brand-500 shadow-sm transition-all dropdown-toggle"
            >
              <Download size={16} />
              <span>{exportLoading ? "Exporting..." : "Export"}</span>
            </button>
          </div>

          {/* <button
            onClick={() => { setSelectedUser(null); setIsScheduleOpen(true); }}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-brand-500/20 transition-all border-b-4 border-brand-700 active:border-b-0 active:translate-y-0.5 w-full md:w-auto min-w-[140px]"
          >
            <CalendarIcon size={16} />
            <span>Schedule</span>
          </button> */}

          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              placeholder="Search Player..."
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 outline-none transition-all dark:text-white"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="w-full md:w-48">
            <Select
              placeholder="Program Type"
              options={[
                { value: "", label: "All Programs" },
                { value: "ELITE", label: "Elite" },
                { value: "DEVELOPMENT", label: "Development" },
                { value: "1on1 seson", label: "1on1 Session" }
              ]}
              onChange={(val: string) => {
                setProgramType(val);
                setPage(1);
              }}
              defaultValue={programType}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02]">
              <TableRow>
                <TableCell isHeader className="px-5 py-4 w-12 border-b border-gray-100 dark:border-white/[0.05]">
                  <button onClick={toggleSelectAll} className="h-5 w-5 rounded border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center transition-all bg-white dark:bg-white/5">
                    {selectedUserIds.length === users.length && users.length > 0 ? (
                      <CheckSquare size={14} className="text-brand-500" />
                    ) : (
                      <Square size={14} className="text-gray-300 dark:text-gray-600" />
                    )}
                  </button>
                </TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-xs text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Player Detail</TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-xs text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Shirt</TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-xs text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Club & Guardian</TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-xs text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Program & DOB</TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-xs text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Skills & Foot</TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-xs text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Status</TableCell>
                <TableCell isHeader className="px-5 py-4 font-bold text-xs text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-20 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent align-[-0.125em]" />
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <PlayerTableRow
                    key={user._id}
                    user={user}
                    isSelected={selectedUserIds.includes(user._id)}
                    onToggleSelect={toggleSelectUser}
                    onOpenDetails={openDetails}
                    onApprove={handleApprove}
                    onReject={openRejectModal}
                    onOpenSchedule={openSchedule}
                    onAssignClass={openAssignClass}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="px-5 py-16 text-center text-gray-400 font-bold text-[10px]">
                    No players found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="p-6 border-t border-gray-100 dark:border-white/[0.05] flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 border rounded-xl text-[10px] font-bold disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all dark:border-gray-800 dark:text-gray-400"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 border rounded-xl text-[10px] font-bold disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all dark:border-gray-800 dark:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <RejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        selectedUser={selectedUser}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        handleReject={handleReject}
        actionLoading={actionLoading}
      />

      <PlayerDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        selectedUser={selectedUser}
        onApprove={handleApprove}
        onReject={openRejectModal}
        onUpdate={handleUpdatePlayer}
        actionLoading={actionLoading}
      />

      <ExportDataModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
        selectedCount={selectedUserIds.length}
        currentFilters={{ status: activeTab, programType, search }}
      />

      <TrainingScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        user={selectedUser}
      />

      {isAssignClassOpen && selectedUser && (
        <AssignClassModal
          isOpen={isAssignClassOpen}
          onClose={() => setIsAssignClassOpen(false)}
          player={selectedUser}
          onSuccess={fetchUsers}
        />
      )}
    </>
  );
};

export default PlayerListComp;
