import apiClient from "./apiClient";
import { PlayersResponse } from "../types/player";

export const getPlayers = async (page = 1, limit = 10, search?: string, program?: string, status?: string): Promise<PlayersResponse> => {
  const params: any = { page, limit };
  if (search) params.search = search;
  if (program && program !== "All") params.program = program;
  if (status && status !== "All") params.status = status;

  const response = await apiClient.get<PlayersResponse>("/api/admin/getUsers", { params });
  return response.data;
};

export const deletePlayer = async (id: string): Promise<void> => {
  await apiClient.delete(`/players/${id}`);
};


export const exportUsersCSV = async (status: string = "APPROVED"): Promise<void> => {
  const response = await apiClient.post(
    "/api/admin/exportUsers",
    { format: "csv", status },
    { responseType: "blob" }
  );
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `players_${status.toLowerCase()}_export.csv`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

export const getPlayerProfile = async (playerId: string): Promise<any> => {
  const response = await apiClient.get(`/api/user/player/profile/${playerId}`);
  return response.data;
};

export const getAdminPlayerDetails = async (playerId: string): Promise<any> => {
  const response = await apiClient.get(`/api/admin/player/${playerId}`);
  return response.data;
};

export const updatePlayerStatistics = async (playerId: string, data: any): Promise<any> => {
  const response = await apiClient.put(`/api/admin/player-statistics/${playerId}`, data);
  return response.data;
};

export const updatePlayerRating = async (id: string, rating: number): Promise<void> => {
  await apiClient.put(`/api/admin/updateRating/${id}`, { rating });
};

