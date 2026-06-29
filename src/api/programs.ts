import apiClient from "./apiClient";
import {
  ProgramsResponse,
  ProgramResponse,
  CreateProgramRequest,
  UpdateProgramRequest,
} from "../types/program";

export const getPrograms = async (page = 1, limit = 10): Promise<ProgramsResponse> => {
  const response = await apiClient.get<ProgramsResponse>("/programs", {
    params: { page, limit },
  });
  return response.data;
};

export const getProgramsByCategory = async (categoryId: string): Promise<ProgramsResponse> => {
  const response = await apiClient.get<ProgramsResponse>("/programs", {
    params: { categoryId },
  });
  return response.data;
};

export const createProgram = async (data: CreateProgramRequest): Promise<ProgramResponse> => {
  const response = await apiClient.post<ProgramResponse>("/programs", data);
  return response.data;
};

export const updateProgram = async (
  id: string,
  data: UpdateProgramRequest
): Promise<ProgramResponse> => {
  const response = await apiClient.patch<ProgramResponse>(`/programs/${id}`, data);
  return response.data;
};

export const deleteProgram = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/programs/${id}`);
  return response.data;
};
