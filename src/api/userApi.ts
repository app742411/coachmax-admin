// src/api/userApi.ts
import apiClient from "./apiClient";
import ENDPOINTS from "./endpoints";


// GET PROFILE
export const getMyProfile = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_MY_PROFILE);
  return res.data;
};

// UPDATE PROFILE
export const updateProfile = async (formData: FormData): Promise<any> => {
  const res = await apiClient.put(ENDPOINTS.UPDATE_PROFILE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// GET PENDING USERS
export const getPendingUsers = async (search: string = ""): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_PEND_USERS}?search=${search}`);
  return res.data;
};


export const processPlayerRequest = async (id: string, status: "APPROVED" | "REJECTED", reason: string = ""): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.APPROVE_REJECT_PLAYER}/${id}`, {
    status,
    reason
  });
  return res.data;
};

// GET ALL USERS (Filtered by status)
export const getUsers = async (
  status: string = "APPROVED",
  page: number = 1,
  limit: number = 10,
  search: string = "",
  programType: string = ""
): Promise<any> => {
  let url = `${ENDPOINTS.GET_USERS}?status=${status}&page=${page}&limit=${limit}&search=${search}`;
  if (programType) url += `&programType=${programType}`;
  const res = await apiClient.get(url);
  return res.data;
};

// GET TRAINING SCHEDULE
export const getTrainingSchedule = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_TRAINING_SCHEDULE);
  return res.data;
};

// EXPORT USERS (GET with body)
export const exportUsers = async (data: {
  userIds?: string[];
  format: "excel" | "csv";
  status?: string;
  programType?: string;
  search?: string;
}): Promise<any> => {
  const res = await apiClient.request({
    method: "post",
    url: ENDPOINTS.EXPORT_USERS,
    data,
    responseType: "blob",
  });
  return res.data;
};
