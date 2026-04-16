import apiClient from "./apiClient";
import ENDPOINTS from "./endpoints";

// CATEGORIES
export const getAllCategories = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_CATEGORIES);
  return res.data;
};

export const createCategory = async (data: { name: string }): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.CREATE_CATEGORY, data);
  return res.data;
};

export const updateCategory = async (id: string, data: { name: string }): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.UPDATE_CATEGORY}/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`${ENDPOINTS.DELETE_CATEGORY}/${id}`);
  return res.data;
};

// TERMS
export const getAllTerms = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_TERMS);
  return res.data;
};

export const createTerm = async (data: {
  name: string;
  year: number;
  startDate: string;
  endDate: string;
}): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.CREATE_TERM, data);
  return res.data;
};

export const updateTerm = async (id: string, data: any): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.UPDATE_TERM}/${id}`, data);
  return res.data;
};

export const deleteTerm = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`${ENDPOINTS.DELETE_TERM}/${id}`);
  return res.data;
};

// CLASSES
export interface GetAllClassesParams {
  category?: string;
  program?: string;
  day?: string;
  time?: string;
}

export const getAllClasses = async (params?: GetAllClassesParams): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_CLASSES, { params });
  return res.data;
};

export interface GetClassFiltersParams {
  categoryId: string;
  programId: string;
  day: string;
}

export const getClassFiltersWithTimeSlots = async (params: GetClassFiltersParams): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_CLASS_FILTERS_WITH_TIME_SLOTS, { params });
  return res.data;
};

export const getClassFullTable = async (classId: string): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_CLASS_FULL_TABLE, { params: { classId } });
  return res.data;
};

export const markAttendance = async (classId: string, data: any): Promise<any> => {
  const res = await apiClient.post(`${ENDPOINTS.MARK_ATTENDANCE}/${classId}`, data);
  return res.data;
};

export const markSingleAttendance = async (classId: string, data: any): Promise<any> => {
  const res = await apiClient.post(`${ENDPOINTS.MARK_SINGLE_ATTENDANCE}/${classId}`, data);
  return res.data;
};

export const getClassById = async (id: string): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_CLASS_BY_ID}/${id}`);
  return res.data;
};

export const createClass = async (data: any): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.CREATE_CLASS, data);
  return res.data;
};

export const updateClass = async (id: string, data: any): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.UPDATE_CLASS}/${id}`, data);
  return res.data;
};

export const getClassPlayers = async (classId: string): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_CLASS_PLAYERS}/${classId}`);
  return res.data;
};

export const deleteClass = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`${ENDPOINTS.DELETE_CLASS}/${id}`);
  return res.data;
};

export const assignClassToPlayer = async (playerId: string, classId: string): Promise<any> => {
  const res = await apiClient.post(`${ENDPOINTS.ASSIGN_CLASS}/${playerId}`, { classId });
  return res.data;
};

// DROPDOWNS
export const getAllPrograms = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_PROGRAMS);
  return res.data;
};

export const getProgramsByCategory = async (categoryId: string): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_PROGRAMS_BY_CATEGORY}/${categoryId}`);
  return res.data;
};

export const createProgram = async (data: { name: string, category: string }): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.CREATE_PROGRAM, data);
  return res.data;
};

export const updateProgram = async (id: string, data: any): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.UPDATE_PROGRAM}/${id}`, data);
  return res.data;
};

export const deleteProgram = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`${ENDPOINTS.DELETE_PROGRAM}/${id}`);
  return res.data;
};

export const getAllCoaches = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_COACHES);
  return res.data;
};

export const createCoach = async (data: any): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.CREATE_COACH, data);
  return res.data;
};

export const updateCoach = async (id: string, data: any): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.UPDATE_COACH}/${id}`, data);
  return res.data;
};

export const deleteCoach = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`${ENDPOINTS.DELETE_COACH}/${id}`);
  return res.data;
};

export const getCoachById = async (id: string): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_COACH_BY_ID}/${id}`);
  return res.data;
};

// ADMIN NOTES
export const updateAdminNote = async (playerId: string, adminNote: string): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.UPDATE_ADMIN_NOTE}/${playerId}`, { adminNote });
  return res.data;
};

export const exportClassCSV = async (classId: string): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.EXPORT_CLASS_CSV, { 
    params: { classId },
    responseType: 'blob' 
  });
  return res.data;
};

export const getAllClassesForAssign = async (params?: GetAllClassesParams): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_CLASSES_FOR_ASSIGN, { params });
  return res.data;
};
