import React from "react";
import { ChatRoom } from "../../store/slices/chatSlice";
import { UnreadBadge } from "./UnreadBadge";

interface Contact {
  _id: string;
  fullName: string;
  role?: string;
  model: string;
}

interface ChatSidebarProps {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  contacts: Contact[];
  onStartChat: (targetId: string, model: string) => void;
  onRefreshContacts?: () => void;
  onStartChatModalOpen?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  rooms,
  activeRoomId,
  onSelectRoom,
  searchTerm,
  onSearchChange,
  contacts: _contacts,
  onStartChat: _onStartChat,
  onRefreshContacts: _onRefreshContacts,
  onStartChatModalOpen: _onStartChatModalOpen,
}) => {
  const getRoomName = (room: ChatRoom) => {
    if (room.type === "BROADCAST") return room.name || "Class Broadcast";
    
    // Find the current user's ID
    const userStr = localStorage.getItem("user");
    let currentUserId = "";
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        currentUserId = parsed?._id || parsed?.id || "";
      } catch (e) {
        console.error(e);
      }
    }

    // Check if the current user is a member of this room
    const isCurrentUserMember = room.members?.some((m) => {
      const memberUserId = m.user?._id || (m.user as any)?.id || m.user;
      return memberUserId && memberUserId.toString() === currentUserId.toString();
    });

    // If current user is not a member (e.g. Super Admin monitoring), show both names
    if (!isCurrentUserMember && room.type === "DIRECT") {
      const names = room.members
        ?.map((m) => m.user?.fullName || m.user?.name)
        .filter(Boolean);
      if (names && names.length > 0) {
        return names.join(" & ");
      }
    }

    // Find the member who is not the current user
    const partner = room.members?.find((m) => {
      const memberUserId = m.user?._id || (m.user as any)?.id || m.user;
      return memberUserId && memberUserId.toString() !== currentUserId.toString();
    });

    const displayMember = partner || room.members?.find((m) => m.user);
    return displayMember?.user?.fullName || displayMember?.user?.name || "Direct Chat";
  };

  return (
    <div
      className="w-[340px] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shrink-0"
      style={{
        backgroundImage: "url('/images/chat/chatsidebg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-wide">Conversations</h3>
          {/* <button
            onClick={onStartChatModalOpen}
            className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-none transition-colors"
          >
            + Start Chat
          </button> */}
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter conversations..."
          className="w-full text-xs py-2 px-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 text-slate-800 dark:text-slate-200 rounded-none focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>



      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-200/60 dark:divide-slate-800/40">
        {rooms.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 leading-relaxed">
            No active conversations.<br />Select a contact above or search to start!
          </div>
        ) : (
          rooms.map((room) => {
            const isBroadcast = room.type === "BROADCAST";
            const name = getRoomName(room);
            const initials = name.charAt(0).toUpperCase();
            const isActive = room._id === activeRoomId;

            const lastMsgText =
              room.lastMessage?.text ||
              (room.lastMessage?.attachments?.length ? "📎 Attachment" : "No messages yet");
            const timeStr = room.lastMessage?.createdAt
              ? new Date(room.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <div
                key={room._id}
                onClick={() => onSelectRoom(room._id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all duration-150 relative ${
                  isActive
                    ? "bg-blue-500/10 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent"
                }`}
              >
                <div className="relative shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                      isBroadcast
                        ? "bg-gradient-to-tr from-amber-500 to-red-500 shadow-md"
                        : "bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-md"
                    }`}
                  >
                    {initials}
                  </div>
                  {room.isPartnerOnline && !isBroadcast && (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 absolute bottom-0 right-0 animate-pulse"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-1.5 mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate leading-none">
                      {name}
                    </span>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{timeStr}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-none flex-1">
                      {lastMsgText}
                    </p>
                    {room.unreadCount > 0 && <UnreadBadge count={room.unreadCount} />}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default ChatSidebar;
