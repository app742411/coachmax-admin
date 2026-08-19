import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Badge from "../../components/ui/badge/Badge";
import { MoreVertical } from "lucide-react";
import { useAppDispatch } from "../../store";
import { setActiveRoomId } from "../../store/slices/chatSlice";
import { chatApi } from "../../services/chatApi";
import toast from "react-hot-toast";

interface ClassItem {
  _id: string;
  name: string;
  trainingType: string;
  sessionDuration: number;
  status: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  term?: { name: string; year: number };
  program?: { name: string };
  category?: { name: string };
  coach?: { name: string };
  players?: any[];
  broadcastChatRoomId?: string;
}

interface ClassTableProps {
  classes: ClassItem[];
  isLoading: boolean;
  onEditClass?: (cls: ClassItem) => void;
  onViewPlayers?: (cls: ClassItem) => void;
  onDeleteClass?: (cls: ClassItem) => void;
}

export default function ClassTable({ classes, isLoading, onEditClass, onViewPlayers, onDeleteClass }: ClassTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleClassChat = async (cls: ClassItem) => {
    try {
      let roomId = cls.broadcastChatRoomId || "";

      // If room already exists, use it directly (Text Class)
      if (!roomId) {
        // No existing room — create it via broadcast API (Chat Active)
        const broadcastRes = await chatApi.broadcastToClass(cls._id, "Broadcast channel active");
        if (broadcastRes && broadcastRes.success) {
          toast.success(broadcastRes.message || "Broadcast message sent successfully");
          if (broadcastRes.data?.room?._id) {
            roomId = broadcastRes.data.room._id;
          }
        } else if (broadcastRes && !broadcastRes.success) {
          toast.error(broadcastRes.message || "Failed to send broadcast");
        }
      }

      if (roomId) {
        dispatch(setActiveRoomId(roomId));
      }

      const userStr = localStorage.getItem("user");
      let isCoach = false;
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          isCoach = parsed?.role === "COACH";
        } catch (e) {
          console.error(e);
        }
      }
      navigate(isCoach ? "/messages" : "/communication");
    } catch (error) {
      console.error("Error setting up class broadcast:", error);
      navigate("/messages");
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-slate-100 rounded-none shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs [&_th]:border [&_th]:border-slate-700/50 [&_td]:border [&_td]:border-slate-200 dark:[&_td]:border-slate-700">
          <thead>
            <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-[40px]">#</th>
              <th className="py-3 px-3 min-w-[150px]">Name</th>
              <th className="py-3 px-3 min-w-[140px]">Program / Term</th>
              <th className="py-3 px-3 min-w-[120px]">Schedule</th>
              <th className="py-3 px-3 min-w-[120px]">Location</th>
              <th className="py-3 px-3 min-w-[120px]">Coach</th>
              <th className="py-3 px-3 min-w-[80px]">Status</th>
              <th className="py-3 px-3 min-w-[110px]">Chat</th>
              <th className="py-3 px-4 w-[50px] text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500 font-semibold">
                  Loading classes...
                </td>
              </tr>
            ) : classes.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500 font-semibold">
                  No classes found.
                </td>
              </tr>
            ) : (
              classes.map((cls, idx) => (
                <tr
                  key={cls._id}
                  className="border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-default"
                >
                  <td className="py-4 px-4 font-semibold text-slate-500">{idx + 1}</td>
                  <td className="py-4 px-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{cls.name}</div>
                    <div className="mt-1.5 w-full max-w-[140px]">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold mb-1">
                        <span>Capacity</span>
                        <span>{cls.players?.length || 0} / {cls.capacity}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            ((cls.players?.length || 0) / (cls.capacity || 1)) >= 1
                              ? "bg-rose-500"
                              : ((cls.players?.length || 0) / (cls.capacity || 1)) >= 0.8
                                ? "bg-amber-500"
                                : "bg-[#0047FF]"
                          }`}
                          style={{ width: `${Math.min(100, ((cls.players?.length || 0) / (cls.capacity || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="text-slate-700 dark:text-slate-300 font-bold">{cls.program?.name || "N/A"}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{cls.term?.name || "N/A"} ({cls.term?.year || ""})</div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="text-slate-700 dark:text-slate-300 font-bold capitalize">{cls.dayOfWeek?.toLowerCase()}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{cls.startTime} - {cls.endTime}</div>
                  </td>
                  <td className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">
                    {cls.location}
                  </td>
                  <td className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">
                    {cls.coach?.name || "Unassigned"}
                  </td>
                  <td className="py-4 px-3">
                    <Badge color={cls.status === "ACTIVE" ? "success" : "warning"}>
                      {cls.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClassChat(cls);
                      }}
                      className="flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700/50 px-2.5 py-1 rounded-[4px] text-[10px] font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
                      title={cls.broadcastChatRoomId ? "Open Class Chat" : "Start Class Broadcast"}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {cls.broadcastChatRoomId ? "Text Class" : "Chat Active"}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="inline-flex items-center justify-center w-7 h-7 bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 transition-colors shadow-sm"
                      title="More Options"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === cls._id ? null : cls._id);
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openDropdownId === cls._id && (
                      <div className="absolute right-8 top-10 w-36 bg-white dark:bg-slate-800 rounded-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEditClass) onEditClass(cls);
                            setOpenDropdownId(null);
                          }}
                        >
                          Edit Class
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onViewPlayers) onViewPlayers(cls);
                            setOpenDropdownId(null);
                          }}
                        >
                          View Players
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors border-t border-slate-100 dark:border-slate-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteClass) onDeleteClass(cls);
                            setOpenDropdownId(null);
                          }}
                        >
                          Delete Class
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
