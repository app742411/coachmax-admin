import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePlayer, getPlayers, updatePlayerStatus } from "../api/players";
import { PlayersResponse } from "../types/player";

export const usePlayers = (page = 1, limit = 10) => {
  return useQuery<PlayersResponse, Error>({
    queryKey: ["players", page, limit],
    queryFn: () => getPlayers(page, limit),
  });
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlayer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
};

export const useUpdatePlayerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: "APPROVED" | "REJECTED"; rejectresaon?: string } }) =>
      updatePlayerStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
};
