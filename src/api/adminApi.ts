import apiClient from "./apiClient";

export const ENDPOINTS = {
  CREATE_PROGRAM: "/api/admin/createProgram",
  GET_ALL_PROGRAMS: "/api/admin/getAllPrograms",
  UPDATE_PROGRAM: "/api/admin/updateProgram",
  DELETE_PROGRAM: "/api/admin/deleteProgram",
  GET_PROGRAMS_BY_CATEGORY: "/api/user/getProgramsByCategory",
  GET_ALL_COACHES: "/api/admin/getAllCoaches",
  CREATE_COACH: "/api/admin/createCoach",
  UPDATE_COACH: "/api/admin/updateCoach",
  DELETE_COACH: "/api/admin/deleteCoach",
  GET_COACH_BY_ID: "/api/admin/getCoachById",
  UPDATE_ADMIN_NOTE: "/api/admin/updateAdminNote",
  EXPORT_CLASS_CSV: "/api/admin/exportClassCSV",
  GET_ALL_CLASSES_FOR_ASSIGN: "/api/admin/getAllClassesForAssign",
  GET_ALL_CATEGORIES: "/api/user/getCategories", // From earlier user snippet
  CREATE_CATEGORY: "/api/admin/createCategory",
  UPDATE_CATEGORY: "/api/admin/updateCategory",
  DELETE_CATEGORY: "/api/admin/deleteCategory",
  GET_ALL_TERMS: "/api/admin/getAllTerms",
  CREATE_TERM: "/api/admin/createTerm",
  UPDATE_TERM: "/api/admin/updateTerm",
  DELETE_TERM: "/api/admin/deleteTerm",
};

// ================= PROGRAMS =================

export const getAllPrograms = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_PROGRAMS);
  return res.data;
};

export const getProgramsByCategory = async (categoryId: string): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_PROGRAMS_BY_CATEGORY}/${categoryId}`);
  return res.data;
};

export const createProgram = async (data: any): Promise<any> => {
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

// ================= COACHES =================

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

// ================= CATEGORIES =================

export const getAllCategories = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_CATEGORIES);
  return res.data;
};

export const createCategory = async (data: any): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.CREATE_CATEGORY, data);
  return res.data;
};

export const updateCategory = async (id: string, data: any): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.UPDATE_CATEGORY}/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`${ENDPOINTS.DELETE_CATEGORY}/${id}`);
  return res.data;
};

// ================= TERMS =================

export const getAllTerms = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_TERMS);
  return res.data;
};

export const createTerm = async (data: any): Promise<any> => {
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
