import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePlayer, getPlayers } from "../api/players";
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
