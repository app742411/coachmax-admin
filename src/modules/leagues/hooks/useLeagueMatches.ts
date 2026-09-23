import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeagueMatches,
  createLeagueMatch,
  updateLeagueMatch,
  deleteLeagueMatch,
} from "../api/leagueApi";
import { Match } from "../types/league";
import { toast } from "react-hot-toast";

export const useLeagueMatches = (leagueId: string) => {
  return useQuery<Match[]>({
    queryKey: ["leagueMatches", leagueId],
    queryFn: () => getLeagueMatches(leagueId),
    enabled: !!leagueId,
  });
};

export const useCreateMatch = (leagueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchData: Partial<Match>) => createLeagueMatch(leagueId, matchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagueMatches", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["leagueLadder", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["leagueStats", leagueId] });
      toast.success("Match created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create match");
    },
  });
};

export const useUpdateMatch = (leagueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, data }: { matchId: string; data: Partial<Match> }) =>
      updateLeagueMatch(leagueId, matchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagueMatches", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["leagueLadder", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["leagueStats", leagueId] });
      toast.success("Match updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update match");
    },
  });
};

export const useDeleteMatch = (leagueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: string) => deleteLeagueMatch(leagueId, matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagueMatches", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["leagueLadder", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["leagueStats", leagueId] });
      toast.success("Match deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete match");
    },
  });
};
