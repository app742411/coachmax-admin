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
