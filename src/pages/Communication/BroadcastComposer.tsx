import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { setPublishing } from "../../store/slices/broadcastSlice";
import { broadcastApi } from "../../services/broadcastApi";
import { toast } from "react-hot-toast";

interface BroadcastComposerProps {
  onSuccess: () => void;
}

export const BroadcastComposer: React.FC<BroadcastComposerProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const activeClassId = useAppSelector((state) => state.broadcast.activeClassId);
  const publishing = useAppSelector((state) => state.broadcast.publishing);
  const [text, setText] = useState("");

  const handlePublish = async () => {
    if (!activeClassId) {
      toast.error("Please select a broadcast room first.");
      return;
    }
    const cleanText = text.trim();
    if (!cleanText) {
      toast.error("Announcement text cannot be empty.");
      return;
    }

    dispatch(setPublishing(true));
    try {
      const res = await broadcastApi.publishAnnouncement(activeClassId, cleanText);
      if (res.success) {
        toast.success("Broadcast announcement published successfully!");
        setText("");
        onSuccess();
      } else {
        toast.error(res.message || "Failed to publish announcement.");
      }
    } catch (err: any) {
      console.error("Publish announcement error:", err);
      toast.error("Network error. Failed to publish announcement.");
    } finally {
      dispatch(setPublishing(false));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none p-5 flex flex-col gap-4 shadow-sm">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">✍️ Create Class Broadcast</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write announcement for parents... (Schedule changes, gear details, etc.)"
        className="w-full min-h-[90px] p-3 text-xs bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-none text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed resize-y"
      />

      <div className="flex justify-between items-center flex-wrap gap-2">
        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
          📢 Reaches all class parents via Real-Time Notifications
        </span>
        <button
          onClick={handlePublish}
          disabled={publishing || !activeClassId}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold rounded-none text-xs transition-colors shrink-0 shadow-lg cursor-pointer flex items-center gap-1.5"
        >
          {publishing ? (
            <>
              <span className="animate-spin text-xs">🌀</span> Publishing...
            </>
          ) : (
            "Publish Broadcast 🚀"
          )}
        </button>
      </div>
    </div>
  );
};
export default BroadcastComposer;
