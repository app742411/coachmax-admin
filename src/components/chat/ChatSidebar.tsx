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
  const [activeTab, setActiveTab] = React.useState<"All" | "Parent" | "Coach" | "Team" | "Broadcast">("All");

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

  const getRoomLabel = (room: ChatRoom, currentId: string) => {
    if (room.type === "BROADCAST") return "BROADCAST";
    if (room.type === "GROUP") return "TEAM";

    const partnerMember = room.members?.find((m) => {
      const memberUserId = m.user?._id || (m.user as any)?.id || m.user;
      return memberUserId && memberUserId.toString() !== currentId.toString();
    });

    if (partnerMember) {
      if (partnerMember.refModel === "Parent") return "PARENT";
      if (partnerMember.refModel === "Admin") return "COACH";
    }

    return null;
  };

  const getRoomName = (room: ChatRoom) => {
    if (room.type === "BROADCAST") return room.name || "Class Broadcast";

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

  // Rooms filtering logic based on selected Tab filter
  const filteredRooms = rooms.filter((room) => {
    const label = getRoomLabel(room, currentUserId);
    if (activeTab === "Parent" && label !== "PARENT") return false;
    if (activeTab === "Coach" && label !== "COACH") return false;
    if (activeTab === "Team" && label !== "TEAM") return false;
    if (activeTab === "Broadcast" && label !== "BROADCAST") return false;
    return true;
  });

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
          <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M4 9h16M7 14h10M10 19h4" />
            </svg>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search parent, coach, class..."
            className="w-full text-xs py-2 pl-3 pr-8 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 text-slate-800 dark:text-slate-200 rounded-none focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar bg-white/40 dark:bg-slate-900/10">
        {([
          { id: "All", label: "All", count: rooms.length },
          { id: "Parent", label: "Parent", count: rooms.filter(r => getRoomLabel(r, currentUserId) === "PARENT").length },
          { id: "Coach", label: "Coach", count: rooms.filter(r => getRoomLabel(r, currentUserId) === "COACH").length },
          { id: "Team", label: "Team", count: rooms.filter(r => getRoomLabel(r, currentUserId) === "TEAM").length },
          { id: "Broadcast", label: "Broadcast", count: rooms.filter(r => getRoomLabel(r, currentUserId) === "BROADCAST").length },
        ] as const).map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all flex items-center gap-1 shrink-0 ${activeTab === id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
              }`}
          >
            <span>{label}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto chat-scrollbar min-h-0 divide-y divide-gray-200/60 dark:divide-slate-800/40">
        {filteredRooms.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 leading-relaxed">
            No active conversations in this filter.
          </div>
        ) : (
          filteredRooms.map((room) => {
            const isBroadcast = room.type === "BROADCAST";
            const name = getRoomName(room);
            const initials = name.charAt(0).toUpperCase();
            const isActive = room._id === activeRoomId;
            const label = getRoomLabel(room, currentUserId);

            const lastMsgText =
              room.lastMessage?.text ||
              (room.lastMessage?.attachments?.length ? "📎 Attachment" : "No messages yet");
            const timeStr = room.lastMessage?.createdAt
              ? new Date(room.lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : "";

            // Render category Badge
            let badgeEl = null;
            if (label === "PARENT") {
              badgeEl = (
                <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-xs bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                  Parent
                </span>
              );
            } else if (label === "COACH") {
              badgeEl = (
                <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-xs bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20">
                  Coach
                </span>
              );
            } else if (label === "TEAM") {
              badgeEl = (
                <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-xs bg-green-50 text-green-600 border border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
                  Team
                </span>
              );
            } else if (label === "BROADCAST") {
              badgeEl = (
                <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-xs bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                  Broadcast
                </span>
              );
            }

            return (
              <div
                key={room._id}
                onClick={() => onSelectRoom(room._id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all duration-150 relative ${isActive
                    ? "bg-blue-500/10 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent"
                  }`}
              >
                <div className="relative shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${isBroadcast
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
                  <div className="mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate block">
                      {name}
                    </span>
                  </div>
                  <div className="mb-1">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                      {lastMsgText}
                    </p>
                  </div>
                  {!isBroadcast && (
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${room.isPartnerOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-300 dark:bg-slate-700"}`} />
                      <span className="text-[9px] text-slate-400 font-medium">
                        {room.isPartnerOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-1.5">
                  {badgeEl}
                  {timeStr && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                      {timeStr}
                    </span>
                  )}
                  {room.unreadCount > 0 ? (
                    <UnreadBadge count={room.unreadCount} />
                  ) : (
                    <div className="h-4 w-4" />
                  )}
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
