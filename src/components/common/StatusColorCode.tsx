import React from 'react';

export interface StatusColorInfo {
  key: string;
  label: string;
  dotColor: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  menuHoverClass: string;
  description: string;
}

export const STATUS_REGISTRY: Record<string, StatusColorInfo> = {
  PAID: {
    key: "PAID",
    label: "PAID",
    dotColor: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    badgeClass: "bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400",
    menuHoverClass: "hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20",
    description: "Paid & Confirmed Active"
  },
  ACTIVE: {
    key: "ACTIVE",
    label: "PAID",
    dotColor: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    badgeClass: "bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400",
    menuHoverClass: "hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20",
    description: "Active / Paid Status"
  },
  APPROVED: {
    key: "APPROVED",
    label: "PAID",
    dotColor: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    badgeClass: "bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400",
    menuHoverClass: "hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20",
    description: "Approved & Paid"
  },
  TRIAL: {
    key: "TRIAL",
    label: "TRIAL",
    dotColor: "bg-rose-500",
    textClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-50 dark:bg-rose-950/40",
    borderClass: "border-rose-200 dark:border-rose-800",
    badgeClass: "bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400",
    menuHoverClass: "hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/20",
    description: "Trial Session (Red Text)"
  },
  UNPAID: {
    key: "UNPAID",
    label: "APPROVED (UNPAID)",
    dotColor: "bg-amber-500",
    textClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/40",
    borderClass: "border-amber-200 dark:border-amber-800",
    badgeClass: "bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400",
    menuHoverClass: "hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20",
    description: "Approved & Fee Allocated (Pending Payment)"
  },
  TBC: {
    key: "TBC",
    label: "TBC",
    dotColor: "bg-slate-400 border border-slate-300 dark:border-slate-500 shadow-xs",
    textClass: "text-slate-400 dark:text-slate-400",
    bgClass: "bg-slate-50 dark:bg-slate-800/40",
    borderClass: "border-slate-300 dark:border-slate-700",
    badgeClass: "bg-slate-100 border border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 shadow-xs",
    menuHoverClass: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700/50",
    description: "To Be Confirmed"
  },
  HANDSHAKE: {
    key: "HANDSHAKE",
    label: "HANDSHAKE",
    dotColor: "bg-teal-500",
    textClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-50 dark:bg-teal-950/40",
    borderClass: "border-teal-200 dark:border-teal-800",
    badgeClass: "bg-teal-50 border border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-400",
    menuHoverClass: "hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/20",
    description: "Handshake Deal (Scholarship / Director Approved)"
  },
  EXTRA: {
    key: "EXTRA",
    label: "EXTRA",
    dotColor: "bg-[#dee08b] border border-amber-400/50",
    textClass: "text-[#8a8c23] dark:text-[#dee08b]",
    bgClass: "bg-[#dee08b]/20 dark:bg-amber-950/40",
    borderClass: "border-[#dee08b] dark:border-amber-800",
    badgeClass: "bg-[#dee08b]/30 border border-[#dee08b] text-[#8a8c23] dark:text-[#dee08b]",
    menuHoverClass: "hover:bg-[#dee08b]/20 hover:text-[#8a8c23] dark:hover:text-[#dee08b]",
    description: "Extra Player Status"
  },
  OTHERS: {
    key: "OTHERS",
    label: "EXTRA",
    dotColor: "bg-[#dee08b] border border-amber-400/50",
    textClass: "text-[#8a8c23] dark:text-[#dee08b]",
    bgClass: "bg-[#dee08b]/20 dark:bg-amber-950/40",
    borderClass: "border-[#dee08b] dark:border-amber-800",
    badgeClass: "bg-[#dee08b]/30 border border-[#dee08b] text-[#8a8c23] dark:text-[#dee08b]",
    menuHoverClass: "hover:bg-[#dee08b]/20 hover:text-[#8a8c23] dark:hover:text-[#dee08b]",
    description: "Extra Player Status"
  },
  SUBSTITUTE: {
    key: "SUBSTITUTE",
    label: "SUBSTITUTE",
    dotColor: "bg-[#dee08b] border border-amber-400/50",
    textClass: "text-[#8a8c23] dark:text-[#dee08b]",
    bgClass: "bg-[#dee08b]/20 dark:bg-amber-950/40",
    borderClass: "border-[#dee08b] dark:border-amber-800",
    badgeClass: "bg-[#dee08b]/30 border border-[#dee08b] text-[#8a8c23] dark:text-[#dee08b]",
    menuHoverClass: "hover:bg-[#dee08b]/20 hover:text-[#8a8c23] dark:hover:text-[#dee08b]",
    description: "Substitute Player"
  }
};

export const getStatusConfig = (status?: string): StatusColorInfo => {
  const key = (status || "UNPAID").toUpperCase();
  return STATUS_REGISTRY[key] || STATUS_REGISTRY.UNPAID;
};

export const STATUS_COLOR_CONFIG = STATUS_REGISTRY;

export const getPlayerStatusTextClass = (status?: string): string => {
  const st = (status || "").toUpperCase();
  if (st === "TRIAL") {
    return "text-rose-600 dark:text-rose-400 hover:text-rose-700";
  }
  if (st === "TBC") {
    return "text-slate-400 dark:text-slate-400 hover:text-slate-500 dark:hover:text-slate-300";
  }
  if (st === "EXTRA" || st === "OTHERS" || st === "SUBSTITUTE") {
    return "text-[#9ca02e] dark:text-[#dee08b] hover:text-[#8a8c23]";
  }
  return "text-slate-800 dark:text-slate-200 hover:text-[#0047FF] dark:hover:text-[#336eff]";
};

export const StatusDot: React.FC<{ status: string; className?: string }> = ({ status, className = "w-2 h-2" }) => {
  const config = getStatusConfig(status);
  return <span className={`rounded-full shrink-0 ${config.dotColor} ${className}`} />;
};

export interface StatusIconProps {
  status: string;
  className?: string;
  size?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status, className = "", size = "w-5 h-5" }) => {
  const s = (status || "").toUpperCase();

  if (s === "PAID" || s === "APPROVED" || s === "ACTIVE") {
    return (
      <div className={`flex justify-center text-emerald-600 ${className}`} title="Paid / Active">
        <svg className={`${size} fill-current`} viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  if (s === "TRIAL") {
    return (
      <div className={`flex justify-center text-rose-600 ${className}`} title="Trial">
        <svg className={`${size} fill-current`} viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v3.5c0 .414.336.75.75.75h3.25a.75.75 0 000-1.5H10.75V6.75z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  if (s === "TBC") {
    return (
      <div className={`flex justify-center text-slate-400 dark:text-slate-400 ${className}`} title="TBC (To Be Confirmed)">
        <svg className={`${size}`} viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M8.5 7.5a1.5 1.5 0 1 1 2.5 1.1c-.6.4-1 1-1 1.9v.2" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="13.5" r="0.8" fill="#64748B" />
        </svg>
      </div>
    );
  }

  if (s === "HANDSHAKE") {
    return (
      <div className={`flex justify-center ${className}`} title="Handshake">
        <svg className={`${size}`} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#0D9488" />
          <path d="M11 10.5L8.5 8C7.9 7.4 7 7.4 6.4 8v0c-.6.6-.6 1.5 0 2.1l3.5 3.5c.4.4 1 .4 1.4 0l2.2-2.2M13 10.5l2.5-2.5c.6-.6 1.5-.6 2.1 0v0c.6.6.6 1.5 0 2.1l-3.5 3.5c-.4.4-1 .4-1.4 0l-.8-.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.5 12l2 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (s === "SUBSTITUTE") {
    return (
      <div className={`flex justify-center text-[#9ca02e] dark:text-[#dee08b] ${className}`} title="Substitute">
        <svg className={`${size} fill-current`} viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.609-1.276z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  if (s === "EXTRA" || s === "OTHERS") {
    return (
      <div className={`flex justify-center text-[#9ca02e] dark:text-[#dee08b] ${className}`} title="Extra Player">
        <svg className={`${size} fill-current`} viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex justify-center text-amber-500 ${className}`} title={status || "Approved (Unpaid)"}>
      <svg className={`${size} fill-current`} viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    </div>
  );
};

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = "" }) => {
  const config = getStatusConfig(status);
  return (
    <span className={`px-2 py-0.5 font-bold text-[9px] uppercase rounded-none shadow-xs ${config.badgeClass} ${className}`}>
      {config.label}
    </span>
  );
};

export interface StatusUpdateMenuListProps {
  currentStatus?: string;
  onSelectStatus: (statusKey: string) => void;
  allowedStatuses?: string[];
  isTeam?: boolean;
}

export const StatusUpdateMenuList: React.FC<StatusUpdateMenuListProps> = ({
  currentStatus = "",
  onSelectStatus,
  allowedStatuses,
  isTeam = false,
}) => {
  const defaultKeys = isTeam
    ? ["TRIAL", "UNPAID", "PAID", "TBC", "HANDSHAKE", "EXTRA", "SUBSTITUTE"]
    : ["TRIAL", "UNPAID", "PAID", "TBC", "HANDSHAKE", "EXTRA"];

  const keys = allowedStatuses || defaultKeys;
  const currentUpper = (currentStatus || "").toUpperCase();

  return (
    <>
      <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 mb-1">
        Update Status
      </div>
      {keys
        .filter((k) => k.toUpperCase() !== currentUpper)
        .map((key) => {
          const config = getStatusConfig(key);
          return (
            <button
              key={key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectStatus(config.key);
              }}
              className={`w-full text-left px-4 py-1.5 text-xs font-bold transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-200 ${config.menuHoverClass}`}
            >
              <StatusIcon status={key} size="w-3.5 h-3.5" className="shrink-0" />
              <span>{config.label}</span>
            </button>
          );
        })}
    </>
  );
};

export const DEFAULT_UPDATE_STATUS_KEYS = [
  "TRIAL",
  "UNPAID",
  "PAID",
  "TBC",
  "HANDSHAKE",
  "EXTRA",
  "SUBSTITUTE"
];

interface StatusColorCodeProps {
  isTeam?: boolean;
  className?: string;
}

export const StatusColorCode: React.FC<StatusColorCodeProps> = ({
  isTeam = false,
  className = ""
}) => {
  const legendItems = [
    STATUS_REGISTRY.PAID,
    STATUS_REGISTRY.UNPAID,
    STATUS_REGISTRY.TRIAL,
    STATUS_REGISTRY.TBC,
    STATUS_REGISTRY.HANDSHAKE,
    STATUS_REGISTRY.EXTRA,
    ...(isTeam ? [STATUS_REGISTRY.SUBSTITUTE] : []),
  ];

  return (
    <div className={`flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 ${className}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Colors:</span>
      <div className="flex flex-wrap items-center gap-2.5">
        {legendItems.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5 bg-slate-100/60 dark:bg-slate-800/60 px-2 py-0.5 rounded-[4px] border border-slate-200/50 dark:border-slate-700/50">
            <StatusIcon status={item.key} size="w-3.5 h-3.5" className="shrink-0" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusColorCode;

