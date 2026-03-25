import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { EyeIcon, CheckLineIcon, CloseLineIcon, MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { getUsers, processPlayerRequest, exportUsers } from "../../api/userApi";
import { CalendarIcon, Download, CheckSquare, Square, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import PageBreadcrumb from "../common/PageBreadcrumb";
import Select from "../form/Select";

// Inline StarIcon
const StarIcon = ({ fill = "none", size = 16, className = "" }: { fill?: string; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Inline SearchIcon
const SearchIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  club: string;
  contactName: string;
  preferredFoot: string;
  skillLevel: number;
  medicalCondition: string;
  comments: string;
  status: string;
  programType: string;
  rejectReason?: string;
  createdAt: string;
  isOtpVerified?: boolean;
  isBlocked?: boolean;
  profile?: string;
  approvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  rejectedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  approvedAt?: string;
  rejectedAt?: string;
  updatedAt?: string;
}

const PlayerListComp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"APPROVED" | "PENDING" | "REJECTED">("APPROVED");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
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
      setTotalUsersCount(data.totalUsers || data.count || 0);
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

  const openRejectModal = (user: User) => {
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

  const openDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
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
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest italic transition-all ${activeTab === tab.value
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
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">{selectedUserIds.length} Selected</span>
              <button onClick={() => setSelectedUserIds([])} className="text-brand-500 hover:text-brand-700">
                <Trash2 size={12} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 whitespace-nowrap px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total: <span className="text-brand-500">{totalUsersCount}</span> Players</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsExportOpen(true)}
              disabled={exportLoading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-500/10 hover:bg-brand-500/20 rounded-xl text-xs font-black uppercase tracking-widest italic text-brand-500 shadow-sm transition-all dropdown-toggle"
            >
              <Download size={16} />
              <span>{exportLoading ? "Exporting..." : "Export"}</span>
            </button>
          </div>

          <button
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 rounded-xl text-xs font-black uppercase tracking-widest italic text-white shadow-lg shadow-brand-500/20 transition-all border-b-4 border-brand-700 active:border-b-0 active:translate-y-0.5 w-full md:w-auto min-w-[140px]"
          >
            <CalendarIcon size={16} />
            <span>Schedule</span>
          </button>
          
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
                <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Player Detail</TableCell>
                <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Club & Guardian</TableCell>
                <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Program & DOB</TableCell>
                <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Skills & Foot</TableCell>
                <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Status</TableCell>
                <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent align-[-0.125em]" />
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id} className={`${selectedUserIds.includes(user._id) ? "bg-brand-50/20 dark:bg-brand-500/5 shadow-inner" : "hover:bg-gray-50/50 dark:hover:bg-white/[0.01]"} transition-all duration-300`}>
                    <TableCell className="px-5 py-4">
                      <button onClick={() => toggleSelectUser(user._id)} className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${selectedUserIds.includes(user._id) ? "bg-brand-500 border-brand-500 shadow-md shadow-brand-500/20" : "bg-white dark:bg-white/5 border-gray-100 dark:border-gray-800"}`}>
                        {selectedUserIds.includes(user._id) ? (
                          <CheckSquare size={14} className="text-white" />
                        ) : (
                          <Square size={14} className="text-gray-100 dark:text-gray-900" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profile ? `${import.meta.env.VITE_API_BASE_URL}/${user.profile}` : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                          alt={user.fullName}
                          className="h-10 w-10 rounded-full object-cover border-2 border-brand-500/20 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                          }}
                        />
                        <div className="flex flex-col">
                          <span
                            onClick={() => openDetails(user)}
                            className="font-bold text-gray-800 text-sm dark:text-white/90 uppercase italic tracking-tighter cursor-pointer hover:text-brand-500 transition-colors"
                          >
                            {user.fullName}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-gray-400 lowercase">
                              {user.email}
                            </span>
                            {user.isOtpVerified && (
                              <Badge size="sm" color="success" variant="light" className="h-3.5 px-1 py-0 text-[8px] border-none">
                                VERIFIED
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] font-black text-brand-500 uppercase mt-0.5">
                            {user.phone}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-[11px] dark:text-white/90 uppercase italic tracking-tight">
                          {user.club}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">
                          {user.contactName} (Guardian)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex flex-col gap-1">
                        <Badge size="sm" color="success" variant="light" className="uppercase italic font-black text-[9px] w-fit border border-success-200">
                          {user.programType}
                        </Badge>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          {new Date(user.dob).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon key={s} fill={s <= user.skillLevel ? "#D02030" : "none"} size={14} className={s <= user.skillLevel ? "text-brand-700" : "text-gray-200 dark:text-gray-800"} />
                          ))}
                        </div>
                        <span className="text-[9px] font-black text-brand-500 uppercase italic tracking-widest">
                          {user.preferredFoot} FOOT
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge
                        size="sm"
                        color={user.status === "APPROVED" ? "success" : user.status === "PENDING" ? "warning" : "error"}
                        variant="light"
                        className="uppercase italic font-black text-[9px]"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="absolute">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                          className="p-2 dropdown-toggle bg-gray-100 dark:bg-white/5 shadow-sm rounded-xl text-gray-500 hover:text-brand-500 transition-all border border-transparent hover:border-brand-500/20"
                        >
                          <MoreDotIcon className="h-4 w-4" />
                        </button>

                        <Dropdown
                          isOpen={openMenuId === user._id}
                          onClose={() => setOpenMenuId(null)}
                          className="w-40 p-2"
                        >
                          <DropdownItem
                            onClick={() => { openDetails(user); setOpenMenuId(null); }}
                            className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 rounded-lg p-2"
                          >
                            <EyeIcon className="h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-widest italic">View Detail</span>
                          </DropdownItem>

                          {(user.status === "PENDING" || user.status === "REJECTED") && (
                            <DropdownItem
                              onClick={() => { handleApprove(user._id); setOpenMenuId(null); }}
                              className="flex items-center gap-2 text-success-600 hover:bg-success-50 rounded-lg p-2"
                            >
                              <CheckLineIcon className="h-4 w-4" />
                              <span className="text-xs font-black uppercase tracking-widest italic">Approve</span>
                            </DropdownItem>
                          )}
                          <DropdownItem
                            onClick={() => { setSelectedUser(user); setIsScheduleOpen(true); setOpenMenuId(null); }}
                            className="flex items-center gap-2 text-brand-600 hover:bg-brand-50 rounded-lg p-2"
                          >
                            <CalendarIcon size={16} />
                            <span className="text-xs font-black uppercase tracking-widest italic">Schedule</span>
                          </DropdownItem>
                          {(user.status === "PENDING" || user.status === "APPROVED") && (
                            <DropdownItem
                              onClick={() => { openRejectModal(user); setOpenMenuId(null); }}
                              className="flex items-center gap-2 text-error-600 hover:bg-error-50 rounded-lg p-2"
                            >
                              <CloseLineIcon className="h-4 w-4" />
                              <span className="text-xs font-black uppercase tracking-widest italic">Reject</span>
                            </DropdownItem>
                          )}
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-16 text-center text-gray-400 italic font-black uppercase tracking-widest text-[10px]">
                    No players found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="p-6 border-t border-gray-100 dark:border-white/[0.05] flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 border rounded-xl text-[10px] font-black uppercase italic tracking-widest disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all dark:border-gray-800 dark:text-gray-400"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 border rounded-xl text-[10px] font-black uppercase italic tracking-widest disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all dark:border-gray-800 dark:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* REJECT MODAL */}
      <Modal isOpen={isRejectOpen} onClose={() => setIsRejectOpen(false)} className="max-w-md">
        <div className="p-8">
          <h4 className="text-xl font-black uppercase italic tracking-tighter text-gray-800 dark:text-white mb-2">Decline Application</h4>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Provide reason for <strong>{selectedUser?.fullName}</strong></p>

          <div className="space-y-4">
            <div>
              <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Rejection Reason</Label>
              <textarea
                className="w-full mt-2 p-4 border border-gray-200 dark:border-gray-800 rounded-2xl bg-transparent focus:ring-2 focus:ring-error-500/20 outline-none min-h-[120px] text-sm dark:text-white font-medium"
                placeholder="State reason here..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsRejectOpen(false)} className="rounded-xl border-gray-200 px-6 uppercase italic font-black tracking-widest text-[10px]">Cancel</Button>
              <Button
                className="bg-error-600 hover:bg-error-700 h-10 px-6 rounded-xl uppercase italic font-black tracking-widest text-[10px] shadow-lg shadow-error-500/20"
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* DETAILS MODAL */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} className="max-w-2xl">
        <div className="p-10">
          <h4 className="text-3xl font-black uppercase italic tracking-tighter text-gray-800 dark:text-white mb-8 border-b pb-6 border-gray-100 dark:border-white/5 flex items-center justify-between">
            <span>Player <span className="text-brand-500 italic">File</span></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border px-3 py-1 rounded-full border-gray-100">ID: {selectedUser?._id.slice(-6)}</span>
          </h4>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-shrink-0">
              <img
                src={selectedUser?.profile ? `${import.meta.env.VITE_API_BASE_URL}/${selectedUser.profile}` : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                alt={selectedUser?.fullName}
                className="h-40 w-40 rounded-2xl object-cover border-4 border-gray-100 dark:border-white/5 shadow-xl bg-gray-50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                }}
              />
              <div className="mt-4 flex flex-col items-center gap-2">
                <Badge
                  size="sm"
                  color={selectedUser?.isOtpVerified ? "success" : "warning"}
                  variant="light"
                  className="uppercase italic font-black text-[9px] w-full justify-center"
                >
                  OTP {selectedUser?.isOtpVerified ? "Verified" : "Pending"}
                </Badge>
                {selectedUser?.isBlocked && (
                  <Badge size="sm" color="error" variant="light" className="uppercase italic font-black text-[9px] w-full justify-center">
                    BLOCKED
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-6">
                <DetailItem label="Full Name" value={selectedUser?.fullName} />
                <DetailItem label="Email" value={selectedUser?.email} />
                <DetailItem label="Contact Number" value={selectedUser?.phone} />
                <DetailItem label="Birth Date" value={selectedUser ? new Date(selectedUser.dob).toLocaleDateString() : ""} />
                <DetailItem label="Program Stream" value={selectedUser?.programType} isBadge color="brand" />
              </div>
              <div className="space-y-6">
                <DetailItem label="Current Club" value={selectedUser?.club} />
                <DetailItem label="Guardian Name" value={selectedUser?.contactName} />
                <DetailItem label="Master Foot" value={selectedUser?.preferredFoot} />
                <DetailItem label="Skill Rating" value={selectedUser?.skillLevel.toString()} isStars />
                <DetailItem label="Medical Notes" value={selectedUser?.medicalCondition} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-gray-100 dark:border-white/5">
            <div>
              <Label className="text-[10px] uppercase tracking-widest font-black text-gray-400 block mb-3">System Tracking</Label>
              <div className="space-y-4">
                <DetailItem label="Registered At" value={selectedUser ? new Date(selectedUser.createdAt).toLocaleString() : ""} />
                <DetailItem label="Last Updated" value={selectedUser?.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : ""} />
              </div>
            </div>
            {selectedUser?.status === "APPROVED" && selectedUser.approvedBy && (
              <div>
                <Label className="text-[10px] uppercase tracking-widest font-black text-success-500 block mb-3">Approval Details</Label>
                <div className="space-y-4">
                  <DetailItem label="Approved By" value={selectedUser.approvedBy.name} />
                  <DetailItem label="Approved At" value={selectedUser.approvedAt ? new Date(selectedUser.approvedAt).toLocaleString() : ""} />
                </div>
              </div>
            )}
            {selectedUser?.status === "REJECTED" && (
              <div>
                <Label className="text-[10px] uppercase tracking-widest font-black text-error-500 block mb-3">Rejection Details</Label>
                <div className="space-y-4">
                  <DetailItem label="Rejected By" value={selectedUser.rejectedBy?.name || "N/A"} />
                  <DetailItem label="Rejected At" value={selectedUser.rejectedAt ? new Date(selectedUser.rejectedAt).toLocaleString() : ""} />
                </div>
              </div>
            )}
          </div>

          {selectedUser?.rejectReason && (
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-error-500 block mb-3">Rejection Reason</Label>
              <p className="text-sm font-medium text-error-600 dark:text-error-400 bg-error-50/50 dark:bg-error-500/05 p-6 rounded-2xl border border-error-100 dark:border-error-500/20 italic">
                "{selectedUser?.rejectReason}"
              </p>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-gray-400 block mb-3">Self Statement / Comments</Label>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-100 dark:border-white/5 italic">
              "{selectedUser?.comments}"
            </p>
          </div>
          <div className="mt-10 flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="rounded-xl px-10 uppercase italic tracking-widest text-[10px] font-black border-gray-200">Dismiss</Button>
            {selectedUser && (
              <div className="flex gap-2">
                {(selectedUser.status === "PENDING" || selectedUser.status === "REJECTED") && (
                  <Button
                    className="bg-brand-500 hover:bg-brand-600 rounded-xl px-12 uppercase italic tracking-widest text-[10px] font-black shadow-lg shadow-brand-500/20"
                    onClick={() => { setIsDetailsOpen(false); if (selectedUser) handleApprove(selectedUser._id); }}
                    disabled={actionLoading}
                  >
                    Approve Player
                  </Button>
                )}
                {(selectedUser.status === "PENDING" || selectedUser.status === "APPROVED") && (
                  <Button
                    className="bg-error-600 hover:bg-error-700 rounded-xl px-10 uppercase italic tracking-widest text-[10px] font-black shadow-lg shadow-error-500/10"
                    onClick={() => { setIsDetailsOpen(false); if (selectedUser) openRejectModal(selectedUser); }}
                    disabled={actionLoading}
                  >
                    Reject
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* EXPORT MODAL */}
      <ExportDataModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
        selectedCount={selectedUserIds.length}
        currentFilters={{ status: activeTab, programType, search }}
      />
      
      {/* SCHEDULE MODAL */}
      <TrainingScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} user={selectedUser} />
    </>
  );
};

const ExportDataModal = ({
  isOpen,
  onClose,
  onExport,
  selectedCount,
  currentFilters
}: {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: "excel" | "csv", filters?: any) => void;
  selectedCount: number;
  currentFilters: { status: string; programType: string; search: string };
}) => {
  const [format, setFormat] = useState<"excel" | "csv">("csv");
  const [useFilters, setUseFilters] = useState(selectedCount === 0);
  const [filters, setFilters] = useState(currentFilters);

  useEffect(() => {
    if (isOpen) {
      setUseFilters(selectedCount === 0);
      setFilters(currentFilters);
    }
  }, [isOpen, selectedCount, currentFilters]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-8">
        <h4 className="text-xl font-black uppercase italic tracking-tighter text-gray-800 dark:text-white mb-2">Export Data</h4>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6"> Configure your export requirements </p>

        <div className="space-y-6">
          <div>
            <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 block">File Format</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat("csv")}
                className={`flex items-center justify-center py-3 rounded-xl border-2 transition-all font-black text-xs italic tracking-widest uppercase ${format === "csv" ? "border-brand-500 bg-brand-500/5 text-brand-500" : "border-gray-100 dark:border-white/5 text-gray-400"}`}
              >
                CSV (.csv)
              </button>
              <button
                onClick={() => setFormat("excel")}
                className={`flex items-center justify-center py-3 rounded-xl border-2 transition-all font-black text-xs italic tracking-widest uppercase ${format === "excel" ? "border-brand-500 bg-brand-500/5 text-brand-500" : "border-gray-100 dark:border-white/5 text-gray-400"}`}
              >
                EXCEL (.xlsx)
              </button>
            </div>
          </div>

          {selectedCount > 0 ? (
            <div className="p-4 bg-brand-50/50 dark:bg-brand-500/5 rounded-2xl border border-brand-100 dark:border-brand-500/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-500 flex items-center gap-2">
                <CheckSquare size={14} />
                {selectedCount} Players Selected for export
              </p>
              <button 
                onClick={() => setUseFilters(true)}
                className="mt-2 text-[8px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-500 transition-colors"
              >
                Or use filters instead?
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400 block">Filter Requirements</Label>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                   <Label className="text-[9px] uppercase font-bold text-gray-400">Status</Label>
                   <Select 
                      options={[
                        { value: "APPROVED", label: "Approved" },
                        { value: "PENDING", label: "Pending" },
                        { value: "REJECTED", label: "Rejected" }
                      ]}
                      defaultValue={filters.status}
                      onChange={(val) => setFilters({...filters, status: val})}
                   />
                </div>
                <div className="space-y-1">
                   <Label className="text-[9px] uppercase font-bold text-gray-400">Program Type</Label>
                   <Select 
                      options={[
                        { value: "", label: "All Programs" },
                        { value: "ELITE", label: "Elite" },
                        { value: "DEVELOPMENT", label: "Development" },
                        { value: "1on1 seson", label: "1on1 Session" }
                      ]}
                      defaultValue={filters.programType}
                      onChange={(val) => setFilters({...filters, programType: val})}
                   />
                </div>
                <div className="space-y-1">
                   <Label className="text-[9px] uppercase font-bold text-gray-400">Search Keywords</Label>
                   <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent text-sm focus:ring-2 focus:ring-brand-500/20 outline-none dark:text-white"
                      placeholder="e.g. Player name..."
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                   />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} className="rounded-xl border-gray-200 px-6 uppercase italic font-black tracking-widest text-[10px]">Close</Button>
            <Button
              className="bg-brand-500 hover:bg-brand-600 h-10 px-8 rounded-xl uppercase italic font-black tracking-widest text-[10px] shadow-lg shadow-brand-500/20"
              onClick={() => onExport(format, useFilters ? filters : undefined)}
            >
              Download {format.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const TrainingScheduleModal = ({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user?: User | null }) => {
  const months = [
    { name: "July", year: 2026, trainingDays: [7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30], highlightRange: { start: 1, end: 12 } },
    { name: "August", year: 2026, trainingDays: [1, 4, 6, 8, 11, 13, 15, 18, 20, 22, 25, 27, 29] },
    { name: "September", year: 2026, trainingDays: [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29], highlightRange: { start: 19, end: 30 } },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl">
      <div className="p-10">
        <h4 className="text-3xl font-black uppercase italic tracking-tighter text-gray-800 dark:text-white mb-2 flex items-center justify-between">
          <span>{user ? `Assign ${user.fullName.split(' ')[0]}'s` : "Term 2"} <span className="text-brand-500 italic">Training Schedule</span></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border px-3 py-1 rounded-full border-gray-100">{user ? user.programType : "AUSTRALIA"} 2026</span>
        </h4>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
          Weekly sessions (2-3 times/week) • Holiday clinics highlighted
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {months.map((m) => (
            <div key={m.name} className="border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden p-6 bg-gray-50/50 dark:bg-white/05">
              <h5 className="text-lg font-black uppercase italic tracking-widest text-gray-800 dark:text-white text-center mb-6 border-b pb-4 border-gray-200/50">
                {m.name}
              </h5>
              <div className="grid grid-cols-7 gap-1 text-center font-black text-[10px] uppercase text-gray-400 mb-4 tracking-tighter">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <CalendarMonth days={m.trainingDays} range={m.highlightRange} month={m.name} year={m.year} />
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-brand-50/50 dark:bg-brand-500/05 rounded-2xl border border-brand-100 dark:border-brand-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-brand-500 shadow-sm" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Training Session</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-lg bg-brand-500/20 border border-brand-500/30" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Holiday Camp</span>
            </div>
          </div>
          <Button variant="outline" onClick={onClose} className="rounded-xl px-10 uppercase italic tracking-widest text-[10px] font-black border-gray-200">Close Schedule</Button>
        </div>
      </div>
    </Modal>
  );
};

const CalendarMonth = ({ days, range, month, year }: { days: number[]; range?: { start: number; end: number }; month: string; year: number }) => {
  const getDaysInMonth = (month: string, year: number) => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getFirstDayIndex = (month: string, year: number) => {
    return new Date(`${month} 1, ${year}`).getDay();
  };

  const totalDays = getDaysInMonth(month, year);
  const firstDay = getFirstDayIndex(month, year);
  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="h-8 md:h-10" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const isTraining = days.includes(d);
    const inRange = range && d >= range.start && d <= range.end;

    cells.push(
      <div
        key={d}
        className={`h-8 md:h-10 flex items-center justify-center text-[11px] font-black transition-all rounded-lg relative overflow-hidden
          ${isTraining ? 'bg-brand-500 text-white shadow-md z-10' : 'text-gray-400'}
          ${inRange ? 'bg-brand-500/10 border border-brand-500/20' : ''}
        `}
      >
        {inRange && <div className="absolute inset-0 bg-brand-500/10" />}
        <span className="relative z-10">{d}</span>
      </div>
    );
  }

  return <div className="grid grid-cols-7 gap-1">{cells}</div>;
};

const DetailItem = ({ label, value, isBadge, isStars, color = "success" }: { label: string; value?: string; isBadge?: boolean; isStars?: boolean; color?: string }) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-[10px] uppercase tracking-widest font-black text-gray-400 block">{label}</Label>
    {isBadge ? (
      <Badge size="sm" color={color as any} variant="light" className="uppercase italic font-black text-[10px] tracking-widest px-4 py-1.5 w-fit border border-current min-w-[100px] justify-center">
        {value}
      </Badge>
    ) : isStars ? (
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarIcon key={s} fill={s <= (Number(value) || 0) ? "#D02030" : "none"} size={18} className={s <= (Number(value) || 0) ? "text-brand-700" : "text-gray-200 dark:text-gray-800"} />
        ))}
      </div>
    ) : (
      <p className="text-sm font-black text-gray-800 dark:text-white/90 uppercase italic tracking-tight">{value || "NOT SPECIFIED"}</p>
    )}
  </div>
);

export default PlayerListComp;
