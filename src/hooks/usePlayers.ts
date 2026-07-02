import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePlayer, getPlayers, updatePlayerStatus, exportUsersCSV } from "../api/players";
import { getAllClassesForAssign, assignClass, getClassFiltersWithTimeSlots, getClassFullTable, markSingleAttendance, markBulkAttendance } from "../api/adminApi";
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

export const useExportUsersCSV = () => {
  return useMutation({
    mutationFn: (status?: string) => exportUsersCSV(status),
  });
};

export const useClassesForAssign = (categoryId: string, programId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["classesForAssign", categoryId, programId],
    queryFn: () => getAllClassesForAssign(categoryId, programId),
    enabled: enabled && !!categoryId && !!programId,
  });
};

export const useAssignClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playerId, classId }: { playerId: string; classId: string }) =>
      assignClass(playerId, { classId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
};

export const useClassFiltersWithTimeSlots = (categoryId: string, programId: string, day: string) => {
  return useQuery({
    queryKey: ["classFiltersWithTimeSlots", categoryId, programId, day],
    queryFn: () => getClassFiltersWithTimeSlots(categoryId, programId, day),
    enabled: !!categoryId && !!programId && !!day,
  });
};

export const useClassFullTable = (classId: string) => {
  return useQuery({
    queryKey: ["classFullTable", classId],
    queryFn: () => getClassFullTable(classId),
    enabled: !!classId,
  });
};

export const useMarkSingleAttendance = (classId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionDate: string; playerId: string; status: string }) => markSingleAttendance(classId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classFullTable", classId] });
    },
  });
};

export const useMarkBulkAttendance = (classId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionDate: string; records: { player: string; status: string }[] }) => markBulkAttendance(classId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classFullTable", classId] });
    },
  });
};


