// src/api/eventApi.ts
import apiClient from "./apiClient";
import ENDPOINTS from "./endpoints";

export const createEvent = async (formData: FormData): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.CREATE_EVENT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getAllEvents = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_EVENTS);
  return res.data;
};

export const updateEventStatus = async (id: string, status: string): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.UPDATE_EVENT_STATUS}/${id}`, { status });
  return res.data;
};

export const updateEvent = async (id: string, formData: FormData): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.UPDATE_EVENT}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
 
export const getEventDetails = async (id: string): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_EVENT_DETAILS}/${id}`);
  return res.data;
};
 
export const getEventParticipants = async (id: string, page: number = 1, limit: number = 10): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_EVENT_PARTICIPANTS}/${id}?page=${page}&limit=${limit}`);
  return res.data;
};
 
export const exportEventParticipants = async (id: string, format: string): Promise<any> => {
  const res = await apiClient.post(`${ENDPOINTS.EXPORT_EVENT_PARTICIPANTS}/${id}`, { format }, {
    responseType: "blob",
  });
  return res.data;
};
