import apiClient from "./apiClient";

const ENDPOINTS = {
  CREATE_EVENT: "/api/admin/createEvent",
  GET_ALL_EVENTS: "/api/admin/getAllEvents",
  UPDATE_EVENT: "/api/admin/updateEvent",
  GET_EVENT_DETAILS: "/api/admin/getEventDetails",
  GET_EVENT_PARTICIPANTS: "/api/admin/getEventParticipants",
  EXPORT_EVENT_PARTICIPANTS: "/api/admin/exportEventParticipants",
  DELETE_EVENT: "/api/admin/updateEventStatus",
};

export const getAllEvents = async () => {
  const response = await apiClient.get(ENDPOINTS.GET_ALL_EVENTS);
  return response.data;
};

export const getEventDetails = async (id: string) => {
  const response = await apiClient.get(`${ENDPOINTS.GET_EVENT_DETAILS}/${id}`);
  return response.data;
};

export const createEvent = async (data: any) => {
  const response = await apiClient.post(ENDPOINTS.CREATE_EVENT, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateEvent = async (id: string, data: any) => {
  const response = await apiClient.put(`${ENDPOINTS.UPDATE_EVENT}/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await apiClient.delete(`${ENDPOINTS.DELETE_EVENT}/${id}`);
  return response.data;
};

export const getEventParticipants = async (id: string, page: number, limit: number) => {
  const response = await apiClient.get(`${ENDPOINTS.GET_EVENT_PARTICIPANTS}/${id}`, {
    params: { page, limit }
  });
  return response.data;
};

export const exportEventParticipants = async (id: string, format: "csv" | "excel") => {
  const response = await apiClient.get(`${ENDPOINTS.EXPORT_EVENT_PARTICIPANTS}/${id}`, {
    params: { format },
    responseType: 'blob'
  });
  return response.data;
};
