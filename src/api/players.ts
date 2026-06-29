import apiClient from "./apiClient";
import { PlayersResponse } from "../types/player";

export const getPlayers = async (page = 1, limit = 10): Promise<PlayersResponse> => {
  const response = await apiClient.get<PlayersResponse>("/api/admin/getUsers", {
    params: { page, limit },
  });
  return response.data;
};

export const deletePlayer = async (id: string): Promise<void> => {
  await apiClient.delete(`/players/${id}`);
};

export const updatePlayerStatus = async (
  id: string,
  data: { status: "APPROVED" | "REJECTED"; rejectresaon?: string }
): Promise<void> => {
  await apiClient.put(`/api/admin/updateStatus/${id}`, data);
};
