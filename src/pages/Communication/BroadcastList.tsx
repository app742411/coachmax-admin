import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  setAnnouncements,
  setLoading,
  setBroadcastRooms,
  setActiveClassId,
} from "../../store/slices/broadcastSlice";
import { broadcastApi } from "../../services/broadcastApi";
import { BroadcastCard } from "../../components/chat/BroadcastCard";
import { Megaphone, RotateCw, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getCoachGetClasses } from "../../api/coaches";

export const BroadcastList: React.FC = () => {
  const dispatch = useAppDispatch();
  const announcements = useAppSelector((state) => state.broadcast.announcements);
  const rooms = useAppSelector((state) => state.broadcast.broadcastRooms);
  const activeClassId = useAppSelector((state) => state.broadcast.activeClassId);
  const loading = useAppSelector((state) => state.broadcast.loading);

  const loadRooms = async () => {
    try {
      const res = await getCoachGetClasses();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data
          .map((cls: any) => ({
            classId: cls.broadcastChatRoomId || cls.broadcastRoomId || cls._id || cls.classId,
            className: cls.name || cls.className || "Class Broadcast",
          }));
        dispatch(setBroadcastRooms(mapped));
        if (mapped.length > 0 && !activeClassId) {
          dispatch(setActiveClassId(mapped[0].classId));
        }
      } else if (!res.success) {
        toast.error(res.message || "Failed to load classes.");
      }
    } catch (err: any) {
      console.error("Load broadcast rooms error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to load classes.";
      toast.error(msg);
    }
  };


  const loadFeed = async (classId: string) => {
    dispatch(setLoading(true));
    try {
      const res = await broadcastApi.getBroadcastMessages(classId);
      if (res.success && res.data) {
        // Map messages into announcements format
        const mappedAnnouncements = res.data.map((msg: any) => ({
          _id: msg._id,
          classId: classId,
          className: rooms.find((r) => r.classId === classId)?.className || "Class Broadcast",
          text: msg.text,
          sender: msg.sender?.user || { fullName: "Coach" },
          createdAt: msg.createdAt,
        }));
        dispatch(setAnnouncements(mappedAnnouncements));
      } else {
        dispatch(setAnnouncements([]));
        if (!res.success && res.message) {
          toast.error(res.message);
        }
      }
    } catch (err: any) {
      console.error("Load announcements error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to load announcements.";
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };


  useEffect(() => {
    loadRooms();
  }, [dispatch]);

  useEffect(() => {
    if (activeClassId) {
      loadFeed(activeClassId);
    }
  }, [activeClassId]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 flex justify-between items-center flex-wrap gap-4 shadow-theme-xs">
        <div>
          <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider flex items-center gap-2">
            <Megaphone size={16} className="text-[#0047FF]" />
            <span>Class Broadcast Announcements</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Official updates and urgent notices for class parents
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Class Room:</label>
          <select
            value={activeClassId || ""}
            onChange={(e) => dispatch(setActiveClassId(e.target.value))}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-none px-4 py-2 h-[38px] text-xs font-bold focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] cursor-pointer"
          >
            <option value="" className="font-bold text-xs">-- Select Broadcast Room --</option>
            {rooms.map((room) => (
              <option key={room.classId} value={room.classId} className="font-bold text-xs">
                {room.className}
              </option>
            ))}
          </select>

          <button
            onClick={() => activeClassId && loadFeed(activeClassId)}
            className="px-4 py-2 h-[38px] bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-none border border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-theme-xs"
            title="Refresh feed"
          >
            <RotateCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="flex flex-col gap-4">
        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
          Announcements Feed
        </h4>

        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center rounded-none text-slate-500 dark:text-slate-400 text-xs shadow-theme-xs flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin text-[#0047FF]" />
            <span className="font-bold uppercase tracking-wider text-[11px]">Fetching announcements...</span>
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed p-12 text-center rounded-none text-slate-400 dark:text-slate-500 text-xs font-medium italic shadow-theme-xs">
            No announcements published in this room yet.
          </div>
        ) : (
          announcements.map((ann) => (
            <BroadcastCard key={ann._id} announcement={ann} />
          ))
        )}
      </div>
    </div>
  );
};
export default BroadcastList;
