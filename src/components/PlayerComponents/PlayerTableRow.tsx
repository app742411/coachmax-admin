import React from "react";
// import { User } from "../../types/player"; // Decoupled
import { TableRow, TableCell } from "../ui/table";
import { CheckSquare, Square, StarIcon, CalendarIcon, PlusCircle } from "lucide-react";
import Badge from "../ui/badge/Badge";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { EyeIcon, CheckLineIcon, CloseLineIcon, MoreDotIcon } from "../../icons";

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
  onOpenSchedule,
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
              <span className="text-[10px] font-medium text-gray-400 lowercase">
                {user.email || "no-email@coachmax.app"}
              </span>
              {user.isOtpVerified && (
                <Badge size="sm" color="success" variant="light" className="h-3.5 px-1 py-0 text-[8px] border-none font-extrabold">
                  VERIFIED
                </Badge>
              )}
            </div>
            <span className="text-[10px] font-bold text-brand-500 mt-0.5">
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
          <span className="text-[10px] font-medium text-gray-400 mt-0.5">
            {user.contactName || "No Guardian"}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        <div className="flex flex-col gap-1">
          <Badge size="sm" color="success" variant="light" className="font-bold text-[9px] w-fit border border-success-200">
            {user.program?.name || user.programType || "No Program"}
          </Badge>
          <span className="text-[10px] font-bold text-gray-500">
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
