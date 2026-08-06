import apiClient from "../api/apiClient";

export const isCoachOrAdmin = (): boolean => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return false;
  try {
    const user = JSON.parse(userStr);
    return ["COACH", "SUPER_ADMIN", "ADMIN"].includes(user.role);
  } catch (e) {
    return false;
  }
};

export const chatApi = {
  getRooms: async () => {
    const url = isCoachOrAdmin() ? "/api/coach/chat/rooms" : "/api/user/chat/rooms";
    const response = await apiClient.get(url);
    return response.data;
  },

  getRoomMessages: async (roomId: string) => {
    const url = isCoachOrAdmin()
      ? `/api/coach/chat/room/${roomId}/messages`
      : `/api/user/chat/room/${roomId}/messages`;
    const response = await apiClient.get(url);
    return response.data;
  },

  createRoom: async (targetUserId: string, targetModel = "Admin") => {
    if (isCoachOrAdmin()) {
      // Coach starts direct chat with parent
      const response = await apiClient.post("/api/coach/chat/direct", { parentId: targetUserId });
      return response.data;
    } else {
      // Parent starts chat with Coach/Admin
      const response = await apiClient.post("/api/user/chat/room", {
        targetUserId,
        targetModel, // "Admin" or "Coach" etc.
      });
      return response.data;
    }
  },

  sendMessage: async (
    roomId: string,
    text: string,
    file?: File | null,
    fileType?: "IMAGE" | "VIDEO" | "AUDIO" | "FILE" | null
  ) => {
    const formData = new FormData();
    formData.append("roomId", roomId);
    formData.append("text", text);
    if (file) {
      formData.append("file", file);
    }
    if (fileType) {
      formData.append("fileType", fileType);
    }

    const headers = {
      "Content-Type": "multipart/form-data",
    };

    if (isCoachOrAdmin()) {
      const response = await apiClient.post("/api/coach/chat/message", formData, { headers });
      return response.data;
    } else {
      const response = await apiClient.post("/api/user/chat/message/send", formData, { headers });
      return response.data;
    }
  },

  getClasses: async () => {
    const url = isCoachOrAdmin() ? "/api/coach/classes" : "/api/user/classes";
    const response = await apiClient.get(url);
    return response.data;
  },

  getClassParents: async (classId: string) => {
    if (!isCoachOrAdmin()) {
      throw new Error("Only coaches or admins can fetch class parents.");
    }
    const response = await apiClient.get(`/api/coach/chat/class/${classId}/parents`);
    return response.data;
  },

  broadcastToClass: async (classId: string, text: string) => {
    const response = await apiClient.post(`/api/coach/chat/broadcast/${classId}`, { text });
    return response.data;
  },
};
