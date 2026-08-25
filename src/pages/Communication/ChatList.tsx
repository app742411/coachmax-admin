import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  setRooms,
  setSearchTerm,
  setActiveRoomId,
  setLoadingRooms,
} from "../../store/slices/chatSlice";
import { chatApi, isCoachOrAdmin } from "../../services/chatApi";
import { ChatSidebar } from "../../components/chat/ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { toast } from "react-hot-toast";

export const ChatList: React.FC = () => {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector((state) => state.chat.rooms);
  const activeRoomId = useAppSelector((state) => state.chat.activeRoomId);
  const searchTerm = useAppSelector((state) => state.chat.searchTerm);

  const [contacts, setContacts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [manualUserId, setManualUserId] = useState("");

  // Load Rooms list
  const loadRooms = async () => {
    dispatch(setLoadingRooms(true));
    try {
      const res = await chatApi.getRooms();
      if (res.success && res.data) {
        dispatch(setRooms(res.data));
        // Auto select first room if none active
        if (res.data.length > 0 && !activeRoomId) {
          dispatch(setActiveRoomId(res.data[0]._id));
        }
      }
    } catch (err: any) {
      console.error("Load rooms error:", err);
      toast.error("Failed to load conversations.");
    } finally {
      dispatch(setLoadingRooms(false));
    }
  };

  // Load Quick Contacts based on role
  const loadQuickContacts = async () => {
    try {
      if (!isCoachOrAdmin()) {
        // Parent: Fetch classes and extract coaches
        const res = await chatApi.getClasses();
        if (res.success && Array.isArray(res.data)) {
          const coachesMap = new Map();
          res.data.forEach((c: any) => {
            if (c.coach && c.coach._id) {
              coachesMap.set(c.coach._id.toString(), {
                _id: c.coach._id,
                fullName: c.coach.fullName || "Coach",
                role: "COACH",
                model: "Admin",
              });
            }
          });
          setContacts(Array.from(coachesMap.values()));
        }
      } else {
        // Coach / Admin: Fetch classes first
        const classesRes = await chatApi.getClasses();
        if (classesRes.success && Array.isArray(classesRes.data) && classesRes.data.length > 0) {
          const classId = classesRes.data[0]._id || classesRes.data[0].classId;
          if (classId) {
            const parentsRes = await chatApi.getClassParents(classId);
            if (parentsRes.success && Array.isArray(parentsRes.data)) {
              const mapped = parentsRes.data.map((p: any) => ({
                _id: p._id,
                fullName: p.fullName || "Parent",
                role: "PARENT",
                model: "Parent",
              }));
              setContacts(mapped);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error loading quick contacts:", err);
    }
  };

  useEffect(() => {
    loadRooms();
    loadQuickContacts();
  }, [dispatch]);

  const handleStartChat = async (targetId: string, model: string) => {
    if (!targetId) return;
    try {
      const res = await chatApi.createRoom(targetId, model);
      if (res.success && res.data) {
        toast.success("Chat room initialized.");
        await loadRooms();
        dispatch(setActiveRoomId(res.data._id));
        setIsModalOpen(false);
        setSelectedContactId("");
        setManualUserId("");
      } else {
        toast.error(res.message || "Failed to initialize room.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error starting conversation.");
    }
  };

  const handleManualSubmit = () => {
    const target = manualUserId.trim() || selectedContactId;
    if (!target) {
      toast.error("Please select a contact or enter a User ID.");
      return;
    }
    const model = isCoachOrAdmin() ? "Parent" : "Admin";
    handleStartChat(target, model);
  };

  return (
    <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden h-full shadow-lg relative">
      {/* Sidebar */}
      <div className={`h-full ${activeRoomId ? "hidden md:flex" : "flex w-full md:w-[340px]"}`}>
        <ChatSidebar
          rooms={rooms}
          activeRoomId={activeRoomId}
          onSelectRoom={(id) => dispatch(setActiveRoomId(id))}
          searchTerm={searchTerm}
          onSearchChange={(val) => dispatch(setSearchTerm(val))}
          contacts={contacts}
          onStartChat={handleStartChat}
          onRefreshContacts={loadQuickContacts}
          onStartChatModalOpen={() => setIsModalOpen(true)}
        />
      </div>

      {/* Active Conversation log */}
      {activeRoomId ? (
        <div className="flex-1 flex flex-col h-full min-w-0">
          <ChatWindow roomId={activeRoomId} />
        </div>
      ) : (
        <div className="hidden md:flex flex-1 bg-slate-950/60 flex-col items-center justify-center text-slate-500 gap-2">
          <div className="text-4xl">💬</div>
          <h4 className="font-bold text-slate-350">No Conversation Selected</h4>
          <p className="text-xs">Pick a room on the left sidebar to start messaging.</p>
        </div>
      )}

      {/* Start Chat Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none w-full max-w-md p-6 shadow-2xl flex flex-col gap-5 text-slate-800 dark:text-slate-100 animate-scale-up">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Start Direct Chat</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white text-base font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select Contact:</label>
                <select
                  value={selectedContactId}
                  onChange={(e) => setSelectedContactId(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 text-slate-750 dark:text-slate-200 rounded-none px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Contact --</option>
                  {contacts.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.fullName} ({c.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center text-slate-400 dark:text-slate-500 text-xs font-bold py-1">— OR —</div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enter User ID Manually:</label>
                <input
                  type="text"
                  value={manualUserId}
                  onChange={(e) => setManualUserId(e.target.value)}
                  placeholder="Enter User ObjectId..."
                  className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 text-slate-800 dark:text-slate-100 rounded-none px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-250 hover:bg-gray-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-none transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleManualSubmit}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-none transition-colors"
              >
                Start Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatList;
