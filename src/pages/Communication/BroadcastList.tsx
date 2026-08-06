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
        // Only include classes that have a broadcastChatRoomId
        const mapped = res.data
          .filter((cls: any) => cls.broadcastChatRoomId)
          .map((cls: any) => ({
            classId: cls.broadcastChatRoomId,
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
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none p-5 flex justify-between items-center flex-wrap gap-4 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
            📢 Class Broadcast Announcements
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official updates and urgent notices for class parents
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Class Room:</label>
          <select
            value={activeClassId || ""}
            onChange={(e) => dispatch(setActiveClassId(e.target.value))}
            className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 text-slate-800 dark:text-slate-200 rounded-none px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="">-- Select Broadcast Room --</option>
            {rooms.map((room) => (
              <option key={room.classId} value={room.classId}>
                {room.className}
              </option>
            ))}
          </select>

          <button
            onClick={() => activeClassId && loadFeed(activeClassId)}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-none border border-gray-200 dark:border-gray-800 text-xs transition-colors cursor-pointer"
            title="Refresh feed"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="flex flex-col gap-4">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
          Announcements Feed
        </h4>

        {loading ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-10 text-center rounded-none text-slate-500 dark:text-slate-400 text-xs shadow-sm animate-pulse">
            <span className="animate-spin mr-2">🌀</span> Fetching announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed p-10 text-center rounded-none text-slate-500 text-xs">
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
