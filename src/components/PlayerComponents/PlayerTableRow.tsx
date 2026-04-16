import React, { useState } from "react";
// import { User } from "../../types/player"; // Decoupled
import { TableRow, TableCell } from "../ui/table";
import { CheckSquare, Square, StarIcon, PlusCircle, Edit2, X as CloseIcon, Loader2 } from "lucide-react";
import Badge from "../ui/badge/Badge";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { EyeIcon, CheckLineIcon, CloseLineIcon, MoreDotIcon } from "../../icons";
import { useMutation } from "@tanstack/react-query";
import { updateAdminNote } from "../../api/adminApi";
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
        className="group/note flex items-center justify-between gap-2 text-gray-400 font-medium italic cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-lg transition-colors py-1 px-2"
        onClick={() => setIsOpen(true)}
      >
        <span className="truncate max-w-[100px] text-[12px]">{note || "Add note..."}</span>
        <Edit2 size={10} className="text-gray-300 opacity-0 group-hover/note:opacity-100 transition-opacity" />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-start">
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

interface PlayerTableRowProps {
  user: any;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenDetails: (user: any) => void;
  onApprove: (id: string) => void;
  onReject: (user: any) => void;
  onOpenSchedule: (user: any) => void;
  onAssignClass: (user: any) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
}

const PlayerTableRow: React.FC<PlayerTableRowProps> = ({
  user,
  isSelected,
  onToggleSelect,
  onOpenDetails,
  onApprove,
  onReject,
  onOpenSchedule: _onOpenSchedule,
  onAssignClass,
  openMenuId,
  setOpenMenuId,
}) => {
  const getSkillColor = (level: number) => {
    switch (level) {
      case 1: return "#ef4444"; // Red
      case 2: return "#f97316"; // Orange
      case 3: return "#eab308"; // Yellow
      case 4: return "#84cc16"; // Lime
      case 5: return "#22c55e"; // Green
      default: return "#94a3b8"; // Slate
    }
  };

  const skillColor = getSkillColor(user.skillLevel || 0);

  // Helper to format date
  const formatDate = (dateStr: any) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toISOString().split('T')[0];
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <TableRow className={`${isSelected ? "bg-brand-50/20 dark:bg-brand-500/5 shadow-inner" : "hover:bg-gray-50/50 dark:hover:bg-white/[0.01]"} transition-all duration-300`}>
      <TableCell className="px-5 py-4">
        <button onClick={() => onToggleSelect(user._id)} className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${isSelected ? "bg-brand-500 border-brand-500 shadow-md shadow-brand-500/20" : "bg-white dark:bg-white/5 border-gray-100 dark:border-gray-800"}`}>
          {isSelected ? (
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
              onClick={() => onOpenDetails(user)}
              className="font-bold text-gray-800 text-sm dark:text-white/90 tracking-tighter cursor-pointer hover:text-brand-500 transition-colors"
            >
              {user.fullName || "Unnamed Player"}
            </span>
            <div className="flex items-center gap-1.5">
              <a
                href={user.email ? `mailto:${user.email}` : "#"}
                className="text-[12px] font-medium text-brand-600 dark:text-brand-400 hover:underline lowercase italic tracking-normal normal-case transition-colors"
                onClick={(e) => !user.email && e.preventDefault()}
              >
                {user.email || "no-email@coachmax.app"}
              </a>
              {user.isOtpVerified && (
                <Badge size="sm" color="success" variant="light" className="h-3.5 px-1 py-0 text-[8px] border-none font-extrabold">
                  VERIFIED
                </Badge>
              )}
            </div>
            <span className="text-[12px] font-bold text-brand-500 mt-0.5">
              {user.phone || "N/A"}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        <div className="flex items-center justify-start">
          <span className="font-extrabold text-gray-900 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs min-w-[36px] text-center shadow-sm">
            {user.jerseyNumber || user.shirtNumber || "-"}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-[11px] dark:text-white/90 tracking-tight">
            {user.club || "No Club"}
          </span>
          <span className="text-[12px] font-medium text-gray-400 mt-0.5">
            {user.contactName || "No Guardian"}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] font-extrabold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">
              {user.category?.name || "No Category"}
            </span>
            <span className="text-[9px] font-extrabold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">
              {user.program?.name || user.programType || "No Program"}
            </span>
          </div>
          <span className="text-[11px] font-bold text-gray-500 ml-0.5">
            {formatDate(user.dob)}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon
                key={s}
                fill={s <= (user.skillLevel || 0) ? skillColor : "none"}
                size={14}
                className={s <= (user.skillLevel || 0) ? "" : "text-gray-200 dark:text-gray-800"}
                style={{ color: s <= (user.skillLevel || 0) ? skillColor : undefined }}
              />
            ))}
          </div>
          <span className="text-[9px] font-bold text-brand-500 uppercase">
            {user.preferredFoot || "N/A"} FOOT
          </span>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        <Badge
          size="sm"
          color={user.status === "APPROVED" ? "success" : user.status === "PENDING" ? "warning" : "error"}
          variant="light"
          className="font-bold text-[9px]"
        >
          {user.status || "UNKNOWN"}
        </Badge>
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        <AdminNoteCell playerId={user._id} initialNote={user.adminNote || user["admin note"] || ""} />
      </TableCell>
      <TableCell className="px-5 py-4 text-end">
        <div className="flex justify-end pr-4">
          <div className="absoulate">
            <button
              onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
              className="p-2 dropdown-toggle bg-gray-100 dark:bg-white/5 shadow-sm rounded-xl text-gray-500 hover:text-brand-500 transition-all border border-transparent hover:border-brand-500/20"
            >
              <MoreDotIcon className="h-4 w-4" />
            </button>

            <Dropdown
              isOpen={openMenuId === user._id}
              onClose={() => setOpenMenuId(null)}
              className="w-44 p-2 z-[999]"
            >
              <DropdownItem
                onClick={() => { onOpenDetails(user); setOpenMenuId(null); }}
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 rounded-lg p-2"
              >
                <EyeIcon className="h-4 w-4" />
                <span className="text-xs font-bold">View Detail</span>
              </DropdownItem>

              <DropdownItem
                onClick={() => { onAssignClass(user); setOpenMenuId(null); }}
                className="flex items-center gap-2 text-brand-600 hover:bg-brand-50 rounded-lg p-2"
              >
                <PlusCircle size={16} />
                <span className="text-xs font-bold">Assign Class</span>
              </DropdownItem>

              {(user.status === "PENDING" || user.status === "REJECTED") && (
                <DropdownItem
                  onClick={() => { onApprove(user._id); setOpenMenuId(null); }}
                  className="flex items-center gap-2 text-success-600 hover:bg-success-50 rounded-lg p-2"
                >
                  <CheckLineIcon className="h-4 w-4" />
                  <span className="text-xs font-bold">Approve</span>
                </DropdownItem>
              )}
              {/* <DropdownItem
                onClick={() => { onOpenSchedule(user); setOpenMenuId(null); }}
                className="flex items-center gap-2 text-brand-600 hover:bg-brand-50 rounded-lg p-2"
              >
                <CalendarIcon size={16} />
                <span className="text-xs font-bold">Schedule</span>
              </DropdownItem> */}
              {(user.status === "PENDING" || user.status === "APPROVED") && (
                <DropdownItem
                  onClick={() => { onReject(user); setOpenMenuId(null); }}
                  className="flex items-center gap-2 text-error-600 hover:bg-error-50 rounded-lg p-2"
                >
                  <CloseLineIcon className="h-4 w-4" />
                  <span className="text-xs font-bold">Reject</span>
                </DropdownItem>
              )}
            </Dropdown>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PlayerTableRow;
