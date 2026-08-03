import React from "react";

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  roleText?: string;
  isOnline?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  roleText,
  isOnline,
}) => {
  const initials = title.charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base tracking-wide shadow-inner">
            {initials}
          </div>
          {isOnline && (
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 absolute -bottom-0.5 -right-0.5 animate-pulse"></div>
          )}
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-snug">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-emerald-400 font-medium">Online now</span>
              </>
            ) : (
              subtitle
            )}
          </p>
        </div>
      </div>

      {roleText && (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {roleText}
        </span>
      )}
    </div>
  );
};
