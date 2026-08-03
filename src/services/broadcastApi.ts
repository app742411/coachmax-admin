import { chatApi } from "./chatApi";

export const broadcastApi = {
  getBroadcastRooms: async () => {
    // Rooms of type 'BROADCAST' are returned in the rooms list
    const data = await chatApi.getRooms();
    if (data.success && Array.isArray(data.data)) {
      return {
        success: true,
        data: data.data.filter((r: any) => r.type === "BROADCAST"),
      };
    }
    return data;
  },

  getBroadcastMessages: async (roomId: string) => {
    return await chatApi.getRoomMessages(roomId);
  },

  publishAnnouncement: async (roomId: string, text: string) => {
    return await chatApi.sendMessage(roomId, text);
  },
};
