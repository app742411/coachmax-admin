import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePlayer, getPlayers, exportUsersCSV, getPlayerProfile, getAdminPlayerDetails, updatePlayerStatistics } from "../api/players";
import { getAllClassesForAssign, assignClass, transferClass, getClassFiltersWithTimeSlots, getClassFullTable, markSingleAttendance, markBulkAttendance, getClassPlayers, assignClassesToPlayer, removeClassFromPlayer, getTeamFullTable, markSingleTeamAttendance, markTeamAttendance, updateTeamPlayerStatistics } from "../api/adminApi";
import { markCoachSingleAttendance, markCoachBulkAttendance, getCoachClassPlayers, getCoachPlayerProfile, getCoachUniquePlayers, addCoachNote, getCoachNotes, updateCoachNote, getCoachAllNotes } from "../api/coaches";
import { PlayersResponse } from "../types/player";

export const usePlayers = (page = 1, limit = 10, search?: string, program?: string, status?: string) => {
  return useQuery<PlayersResponse, Error>({
    queryKey: ["players", page, limit, search, program, status],
    queryFn: () => {
      const userStr = localStorage.getItem("user");
      let isCoach = false;
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed?.role === "COACH") {
            isCoach = true;
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (isCoach) {
        return getCoachUniquePlayers(page, limit, search, program, status);
      }
      return getPlayers(page, limit, search, program, status);
    },
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

export const useClassFiltersWithTimeSlots = (categoryId: string, programId: string, day: string, termId?: string) => {
  return useQuery({
    queryKey: ["classFiltersWithTimeSlots", categoryId, programId, day, termId],
    queryFn: () => getClassFiltersWithTimeSlots(categoryId, programId, day, termId),
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

export const useTeamFullTable = (teamId: string) => {
  return useQuery({
    queryKey: ["teamFullTable", teamId],
    queryFn: () => getTeamFullTable(teamId),
    enabled: !!teamId,
  });
};

export const useMarkSingleTeamAttendance = (teamId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionDate: string; playerId: string; status: string }) => markSingleTeamAttendance(teamId, data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["teamFullTable", teamId] });
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      const statusSuffix = data?.data?.status ? `: ${data.data.status}` : "";
      toast.success((data?.message || "Team attendance marked") + statusSuffix);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to mark team attendance");
    }
  });
};

export const useMarkTeamAttendance = (teamId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionDate: string; records: { player: string; status: string }[] }) => markTeamAttendance(teamId, data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["teamFullTable", teamId] });
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      toast.success(data?.message || "Bulk team attendance marked!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to mark bulk team attendance");
    }
  });
};

export const useMarkSingleAttendance = (classId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionDate: string; playerId: string; status: string }) => {
      const userStr = localStorage.getItem("user");
      let isCoach = false;
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed?.role === "COACH") {
            isCoach = true;
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (isCoach) {
        return markCoachSingleAttendance(classId, data);
      }
      return markSingleAttendance(classId, data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["classFullTable", classId] });
      const statusSuffix = data?.data?.status ? `: ${data.data.status}` : "";
      toast.success((data?.message || "Attendance marked") + statusSuffix);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to mark attendance");
    }
  });
};

export const useMarkBulkAttendance = (classId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionDate: string; records: { player: string; status: string }[] }) => {
      const userStr = localStorage.getItem("user");
      let isCoach = false;
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed?.role === "COACH") {
            isCoach = true;
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (isCoach) {
        return markCoachBulkAttendance(classId, data);
      }
      return markBulkAttendance(classId, data);
    },
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
    queryFn: () => {
      const userStr = localStorage.getItem("user");
      let isCoach = false;
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed?.role === "COACH") {
            isCoach = true;
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (isCoach) {
        return getCoachClassPlayers(classId);
      }
      return getClassPlayers(classId);
    },
    enabled: !!classId,
  });
};

export const usePlayerProfile = (playerId: string | undefined) => {
  return useQuery({
    queryKey: ["playerProfile", playerId],
    queryFn: () => {
      const userStr = localStorage.getItem("user");
      let isCoach = false;
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed?.role === "COACH") {
            isCoach = true;
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (isCoach) {
        return getCoachPlayerProfile(playerId!);
      }
      return getPlayerProfile(playerId!);
    },
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

export const useRemoveClassFromPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, classId }: { userId: string; classId: string }) =>
      removeClassFromPlayer(userId, classId),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["classFullTable"] });
      toast.success(data?.message || "Player removed from class successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to remove player from class");
    }
  });
};

export const useTransferClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, fromClassId, toClassId }: { userId: string; fromClassId: string; toClassId: string }) =>
      transferClass(userId, { fromClassId, toClassId }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["classFullTable"] });
      toast.success(data?.message || "Player transferred successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to transfer player");
    }
  });
};

export const useAddCoachNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { playerId: string; classId?: string; noteType: string; description: string }) =>
      addCoachNote(data),
    onSuccess: (data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ["coachNotes", variables.playerId] });
      toast.success(data?.message || "Coach note saved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to add coach note");
    }
  });
};

export const useCoachNotes = (playerId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["coachNotes", playerId, page, limit],
    queryFn: () => getCoachNotes(playerId, page, limit),
    enabled: !!playerId,
  });
};

export const useUpdateCoachNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: { noteType: string; description: string } }) =>
      updateCoachNote(noteId, data),
    onSuccess: (data: any, _variables: any) => {
      // Invalidate the cache to reload
      queryClient.invalidateQueries({ queryKey: ["coachNotes"] });
      toast.success(data?.message || "Coach note updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to update coach note");
    }
  });
};

export const useCoachAllNotes = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["coachAllNotes", page, limit],
    queryFn: () => getCoachAllNotes(page, limit),
  });
};

export const useAdminPlayerDetails = (playerId: string | undefined) => {
  return useQuery({
    queryKey: ["adminPlayerDetails", playerId],
    queryFn: () => getAdminPlayerDetails(playerId!),
    enabled: !!playerId,
  });
};

export const useUpdatePlayerStatistics = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playerId, data }: { playerId: string; data: any }) => 
      updatePlayerStatistics(playerId, data),
    onSuccess: (data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ["adminPlayerDetails", variables.playerId] });
      queryClient.invalidateQueries({ queryKey: ["playerProfile", variables.playerId] });
      toast.success(data?.message || "Player statistics updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to update statistics");
    }
  });
};

export const useUpdateTeamPlayerStatistics = (teamId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playerId, data }: { playerId: string; data: any }) =>
      updateTeamPlayerStatistics(teamId, playerId, data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["teamFullTable", teamId] });
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success(data?.message || "Team player statistics updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to update statistics");
    },
  });
};
