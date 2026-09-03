import React from 'react';

export interface StatusColorInfo {
  key: string;
  label: string;
  dotClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  description?: string;
}

export const STATUS_COLOR_CONFIG: Record<string, StatusColorInfo> = {
  PAID: {
    key: "PAID",
    label: "PAID",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    description: "Paid & Confirmed"
  },
  ACTIVE: {
    key: "ACTIVE",
    label: "ACTIVE",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    description: "Active Status"
  },
  TRIAL: {
    key: "TRIAL",
    label: "TRIAL",
    dotClass: "bg-rose-500",
    textClass: "text-rose-600 dark:text-rose-400 hover:text-rose-700",
    bgClass: "bg-rose-50 dark:bg-rose-950/40",
    borderClass: "border-rose-200 dark:border-rose-800",
    description: "Trial Session (Red Text)"
  },
  UNPAID: {
    key: "UNPAID",
    label: "UNPAID",
    dotClass: "bg-amber-500",
    textClass: "text-amber-500 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/40",
    borderClass: "border-amber-200 dark:border-amber-800",
    description: "Unpaid / Pending"
  },
  EXTRA: {
    key: "EXTRA",
    label: "EXTRA",
    dotClass: "bg-[#dee08b] border border-amber-400",
    textClass: "text-amber-500 dark:text-amber-400",
    bgClass: "bg-[#dee08b] dark:bg-amber-950/60",
    borderClass: "border-amber-300 dark:border-amber-800",
    description: "Extra Player Status"
  },
  OTHERS: {
    key: "OTHERS",
    label: "EXTRA",
    dotClass: "bg-[#dee08b] border border-amber-400",
    textClass: "text-amber-500 dark:text-amber-400",
    bgClass: "bg-[#dee08b] dark:bg-amber-950/60",
    borderClass: "border-amber-300 dark:border-amber-800",
    description: "Extra Player Status"
  },
  SUBSTITUTE: {
    key: "SUBSTITUTE",
    label: "SUBSTITUTE",
    dotClass: "bg-[#dee08b] border border-amber-400",
    textClass: "text-amber-500 dark:text-amber-400",
    bgClass: "bg-[#dee08b] dark:bg-amber-950/60",
    borderClass: "border-amber-300 dark:border-amber-800",
    description: "Substitute Player"
  }
};

/**
 * Returns helper class names for player name text in tables
 */
export const getPlayerStatusTextClass = (status?: string): string => {
  const st = (status || "").toUpperCase();
  if (st === "TRIAL") {
    return "text-rose-600 dark:text-rose-400 hover:text-rose-700";
  }
  if (st === "EXTRA" || st === "OTHERS" || st === "SUBSTITUTE") {
    return "text-[#9ca02e] dark:text-[#dee08b] hover:text-[#8a8c23]";
  }
  return "text-slate-800 dark:text-slate-200 hover:text-[#0047FF] dark:hover:text-[#336eff]";
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
    <div className={`flex justify-center text-amber-500 ${className}`} title={status || "Unpaid"}>
      <svg className={`${size} fill-current`} viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    </div>
  );
};

/**
 * Common Color Legend Bar component for Program & Team Matrix tables
 */
interface StatusColorCodeProps {
  isTeam?: boolean;
  className?: string;
}

export const StatusColorCode: React.FC<StatusColorCodeProps> = ({
  isTeam = false,
  className = ""
}) => {
  const legendItems = [
    { key: "PAID", label: "Paid", dot: "bg-emerald-500" },
    { key: "TRIAL", label: "Trial (Red)", dot: "bg-rose-500" },
    { key: "UNPAID", label: "Unpaid", dot: "bg-amber-500" },
    { key: "EXTRA", label: "Extra", dot: "bg-[#dee08b] border border-amber-400" },
    ...(isTeam ? [{ key: "SUBSTITUTE", label: "Substitute", dot: "bg-[#dee08b] border border-amber-400" }] : []),
  ];

  return (
    <div className={`flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 ${className}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Colors:</span>
      <div className="flex flex-wrap items-center gap-2.5">
        {legendItems.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5 bg-slate-100/60 dark:bg-slate-800/60 px-2 py-0.5 rounded-[4px] border border-slate-200/50 dark:border-slate-700/50">
            <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusColorCode;
