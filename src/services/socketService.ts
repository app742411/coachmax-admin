import { io, Socket } from "socket.io-client";
import { store } from "../store";
import { setConnected, setReconnecting, setSocketError } from "../store/slices/socketSlice";
import {
  appendMessage,
  updateRoomMessagesStatus,
  setPartnerTyping,
  updatePartnerOnlineStatus,
} from "../store/slices/chatSlice";
import { addAnnouncement } from "../store/slices/broadcastSlice";
import { toast } from "react-hot-toast";

let socket: Socket | null = null;

export const socketService = {
  connect: (token: string) => {
    if (socket) {
      if (socket.connected) return;
      socket.disconnect();
    }

    const socketUrl = (import.meta.env.VITE_API_BASE_URL as string) || window.location.origin;
    socket = io(socketUrl, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      store.dispatch(setConnected(true));

      const activeRoomId = store.getState().chat.activeRoomId;
      if (activeRoomId) {
        socket?.emit("join_room", { roomId: activeRoomId });
        socket?.emit("mark_read", { roomId: activeRoomId });
      }
    });

    socket.on("disconnect", () => {
      store.dispatch(setConnected(false));
    });

    socket.on("connect_error", (error) => {
      store.dispatch(setSocketError(error.message));
    });

    socket.on("reconnect_attempt", () => {
      store.dispatch(setReconnecting(true));
    });

    // Event listeners
    socket.on("new_message", (data: { roomId: string; message: any }) => {
      store.dispatch(appendMessage(data.message));

      const activeRoomId = store.getState().chat.activeRoomId;
      if (data.roomId === activeRoomId) {
        socket?.emit("mark_read", { roomId: activeRoomId });
      }
    });

    socket.on("messages_read", (data: { roomId: string }) => {
      store.dispatch(
        updateRoomMessagesStatus({ roomId: data.roomId, tickStatus: "READ" })
      );
    });

    socket.on("message_delivered", (data: { roomId: string }) => {
      store.dispatch(
        updateRoomMessagesStatus({ roomId: data.roomId, tickStatus: "DELIVERED" })
      );
    });

    socket.on("user_typing", (data: { roomId: string; userName: string; isTyping: boolean }) => {
      store.dispatch(
        setPartnerTyping({
          roomId: data.roomId,
          userName: data.userName,
          isTyping: data.isTyping,
        })
      );
    });

    socket.on("user_status_change", (data: { userId: string; isOnline: boolean }) => {
      store.dispatch(
        updatePartnerOnlineStatus({
          userId: data.userId,
          isOnline: data.isOnline,
        })
      );
    });

    socket.on("new_broadcast_alert", (data: { classId: string; className: string; text: string; sender: any }) => {
      toast(`Announcement in ${data.className}:\n${data.text}`, {
        duration: 5000,
      });

      store.dispatch(
        addAnnouncement({
          _id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
          classId: data.classId,
          className: data.className,
          text: data.text,
          sender: data.sender || { fullName: "Coach" },
          createdAt: new Date().toISOString(),
        })
      );
    });
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  joinRoom: (roomId: string) => {
    if (socket) {
      socket.emit("join_room", { roomId });
    }
  },

  markRead: (roomId: string) => {
    if (socket) {
      socket.emit("mark_read", { roomId });
    }
  },

  sendTyping: (roomId: string, isTyping: boolean) => {
    if (socket) {
      socket.emit("typing", { roomId, isTyping });
    }
  },

  sendMessage: (roomId: string, text: string, callback?: (res: any) => void) => {
    if (socket && socket.connected) {
      socket.emit("send_message", { roomId, text }, (res: any) => {
        if (callback) callback(res);
      });
    } else {
      if (callback) callback({ success: false, message: "Socket is not connected." });
    }
  },

  isConnected: () => {
    return socket ? socket.connected : false;
  },
};
