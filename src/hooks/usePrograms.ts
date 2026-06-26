import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../api/programs";
import {
  CreateProgramRequest,
  UpdateProgramRequest,
  ProgramsResponse,
  ProgramResponse,
} from "../types/program";

export const usePrograms = (page = 1, limit = 10) => {
  return useQuery<ProgramsResponse, Error>({
    queryKey: ["programs", page, limit],
    queryFn: () => getPrograms(page, limit),
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation<ProgramResponse, Error, CreateProgramRequest>({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation<ProgramResponse, Error, { id: string; data: UpdateProgramRequest }>({
    mutationFn: ({ id, data }) => updateProgram(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};
