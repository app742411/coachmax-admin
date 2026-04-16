import React from "react";
import { Clock } from "lucide-react";

interface SessionNavigatorProps {
  sessions: string[];
  activeSession: string;
  label: string;
  onSelectSession: (session: string) => void;
}

const SessionNavigator: React.FC<SessionNavigatorProps> = ({
  sessions,
  activeSession,
  label,
  onSelectSession,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-2">
        <Clock size={16} className="text-brand-500" />
        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em]">
          {label}
        </h4>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 px-1 pt-4">
        {sessions.map((session) => (
          <button
            key={session}
            onClick={() => onSelectSession(session)}
            className={`px-8 py-4 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-300 border-2 ${activeSession === session
                ? "bg-[#e8f0fe] border-brand-500 text-brand-600 shadow-md transform -translate-y-1"
                : "bg-white dark:bg-white/5 border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
              }`}
          >
            {session}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SessionNavigator;
