import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeagueMatches,
  getLeagueSchedule,
  createLeagueMatch,
  updateLeagueMatch,
  deleteLeagueMatch,
  generateRandomFixtures,
} from "../api/leagueApi";
import { Match, RoundSchedule } from "../types/league";
import { toast } from "react-hot-toast";

export const useLeagueMatches = (leagueId: string) => {
  return useQuery<Match[]>({
    queryKey: ["leagueMatches", leagueId],
    queryFn: () => getLeagueMatches(leagueId),
    enabled: !!leagueId,
  });
};

export const useLeagueSchedule = (leagueId: string, round?: number) => {
  return useQuery<RoundSchedule[]>({
    queryKey: ["leagueSchedule", leagueId, round],
    queryFn: () => getLeagueSchedule(leagueId, round),
    enabled: !!leagueId,
  });
};

export const useGenerateFixtures = (leagueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (forceRegenerate?: boolean) =>
      generateRandomFixtures(leagueId, forceRegenerate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagueMatches", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["leagueSchedule", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["league", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["leagueLadder", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["leagueStats", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["leagueGraphs", leagueId] });
    },
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
