import apiClient from "./apiClient";
import { PlayersResponse } from "../types/player";

export const getPlayers = async (page = 1, limit = 10): Promise<PlayersResponse> => {
  const response = await apiClient.get<PlayersResponse>("/players", {
    params: { page, limit },
  });
  return response.data;
};

export const deletePlayer = async (id: string): Promise<void> => {
  await apiClient.delete(`/players/${id}`);
};
