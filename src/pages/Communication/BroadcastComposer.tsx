import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { setPublishing } from "../../store/slices/broadcastSlice";
import { broadcastApi } from "../../services/broadcastApi";
import { Megaphone, Bell, Loader2, Send } from "lucide-react";
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
      const msg = err?.response?.data?.message || err?.message || "Failed to publish announcement.";
      toast.error(msg);
    } finally {
      dispatch(setPublishing(false));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 flex flex-col gap-4 shadow-theme-xs">
      <div className="flex items-center gap-2">
        <Megaphone size={16} className="text-[#0047FF]" />
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide">
          Create Class Broadcast
        </h3>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write announcement for parents... (Schedule changes, gear details, etc.)"
        className="w-full min-h-[100px] p-4 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-none text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] leading-relaxed resize-y"
      />

      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-[#0047FF] dark:text-blue-400 font-black uppercase tracking-wider">
          <Bell size={12} className="shrink-0" />
          <span>Reaches all class parents via Real-Time Notifications</span>
        </div>
        <button
          onClick={handlePublish}
          disabled={publishing || !activeClassId}
          className="px-5 py-2.5 bg-[#0047FF] hover:bg-blue-700 disabled:bg-[#0047FF]/50 text-white font-extrabold rounded-none text-[11px] uppercase tracking-wider transition-colors shrink-0 shadow-md hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
        >
          {publishing ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <span>Publish Broadcast</span>
              <Send size={12} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default BroadcastComposer;
