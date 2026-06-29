import apiClient from "./apiClient";

export interface Coach {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  // add other fields as necessary
}

export interface CoachesResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  coaches: Coach[];
}

export const getAllCoaches = async (page = 1, limit = 100): Promise<CoachesResponse> => {
  const response = await apiClient.get<CoachesResponse>("/admin/coaches", {
    params: { page, limit },
  });
  return response.data;
};

export const createCoach = async (data: any): Promise<any> => {
  const response = await apiClient.post("/admin/coaches", data);
  return response.data;
};

export const updateCoach = async (id: string, data: any): Promise<any> => {
  const response = await apiClient.put(`/admin/coaches/${id}`, data);
  return response.data;
};

export const deleteCoach = async (id: string): Promise<any> => {
  const response = await apiClient.delete(`/admin/coaches/${id}`);
  return response.data;
};
