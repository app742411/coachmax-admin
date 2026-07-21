import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePlayer, getPlayers, exportUsersCSV, getPlayerProfile } from "../api/players";
import { getAllClassesForAssign, assignClass, getClassFiltersWithTimeSlots, getClassFullTable, markSingleAttendance, markBulkAttendance, getClassPlayers, assignClassesToPlayer } from "../api/adminApi";
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
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success(data?.message || "Player deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to delete player");
    }
  });
};



export const useExportUsersCSV = () => {
  return useMutation({
    mutationFn: (status?: string) => exportUsersCSV(status),
    onSuccess: (data: any) => {
      toast.success(data?.message || "Export successful");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Export failed");
    }
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
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success(data?.message || "Class assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to assign class");
    }
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
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["classFullTable", classId] });
      toast.success(data?.message || "Attendance marked");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to mark attendance");
    }
  });
};

export const useMarkBulkAttendance = (classId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionDate: string; records: { player: string; status: string }[] }) => markBulkAttendance(classId, data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["classFullTable", classId] });
      toast.success(data?.message || "Bulk attendance marked");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to mark bulk attendance");
    }
  });
};


export const useClassPlayers = (classId: string) => {
  return useQuery({
    queryKey: ["classPlayers", classId],
    queryFn: () => getClassPlayers(classId),
    enabled: !!classId,
  });
};

export const usePlayerProfile = (playerId: string | undefined) => {
  return useQuery({
    queryKey: ["playerProfile", playerId],
    queryFn: () => getPlayerProfile(playerId!),
    enabled: !!playerId,
  });
};


export const useAssignClassesToPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      playerId,
      classIds,
      paymentStatus,
      registrationRequestId,
    }: {
      playerId: string;
      classIds: string[];
      paymentStatus: string;
      registrationRequestId?: string;
    }) => assignClassesToPlayer(playerId, classIds, paymentStatus, registrationRequestId),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["unallocatedPlayers"] });
      queryClient.invalidateQueries({ queryKey: ["allocatedPlayers"] });
      queryClient.invalidateQueries({ queryKey: ["classFullTable"] });
      toast.success(data?.message || "Player allocated to classes and enrolled successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to assign classes to player");
    }
  });
};
