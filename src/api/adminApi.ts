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
  ASSIGN_CLASS: "/api/admin/assignClass",
  GET_CLASS_FILTERS_WITH_TIME_SLOTS: "/api/admin/getClassFiltersWithTimeSlots",
  GET_CLASS_FULL_TABLE: "/api/admin/getClassFullTable",
  MARK_SINGLE_ATTENDANCE: "/api/admin/markSingleAttendance",
  MARK_ATTENDANCE: "/api/admin/markAttendance",
  GET_ALL_CATEGORIES: "/api/user/getCategories", // From earlier user snippet
  CREATE_CATEGORY: "/api/admin/createCategory",
  UPDATE_CATEGORY: "/api/admin/updateCategory",
  DELETE_CATEGORY: "/api/admin/deleteCategory",
  GET_ALL_TERMS: "/api/admin/getAllTerms",
  CREATE_TERM: "/api/admin/createTerm",
  UPDATE_TERM: "/api/admin/updateTerm",
  DELETE_TERM: "/api/admin/deleteTerm",
  CREATE_NEWS: "/api/admin/news",
  TEAMS: "/api/admin/getAllTeams",
  FIXTURES: "/api/admin/fixtures",
  GET_ALL_LEAGUES: "/api/admin/leagues",
  LEAGUES: "/api/admin/leagues",
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

// ================= CLASSES =================

export const getAllClassesForAssign = async (categoryId: string, programId: string): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_ALL_CLASSES_FOR_ASSIGN}?category=${categoryId}&program=${programId}`);
  return res.data;
};

export const assignClass = async (playerId: string, data: any): Promise<any> => {
  const res = await apiClient.post(`${ENDPOINTS.ASSIGN_CLASS}/${playerId}`, data);
  return res.data;
};

export const getClassFiltersWithTimeSlots = async (categoryId: string, programId: string, day: string): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_CLASS_FILTERS_WITH_TIME_SLOTS}?categoryId=${categoryId}&programId=${programId}&day=${day}`);
  return res.data;
};

export const getClassFullTable = async (classId: string): Promise<any> => {
  const res = await apiClient.get(`${ENDPOINTS.GET_CLASS_FULL_TABLE}?classId=${classId}`);
  return res.data;
};

export const markSingleAttendance = async (classId: string, data: { sessionDate: string; playerId: string; status: string }): Promise<any> => {
  const res = await apiClient.post(`${ENDPOINTS.MARK_SINGLE_ATTENDANCE}/${classId}`, data);
  return res.data;
};

export const markBulkAttendance = async (classId: string, data: { sessionDate: string; records: { player: string; status: string }[] }): Promise<any> => {
  const res = await apiClient.post(`${ENDPOINTS.MARK_ATTENDANCE}/${classId}`, data);
  return res.data;
};

// ================= NEWS =================

export const getAllNews = async (): Promise<any> => {
  const res = await apiClient.get('/api/user/news');
  return res.data;
};

export const createNews = async (data: any): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.CREATE_NEWS, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};
export const updateNews = async (id: string, data: any): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.CREATE_NEWS}/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const deleteNews = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`${ENDPOINTS.CREATE_NEWS}/${id}`);
  return res.data;
};

// ================= TEAMS =================

export const getAllTeams = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.TEAMS);
  return res.data;
};

export const createTeam = async (data: any): Promise<any> => {
  const res = await apiClient.post("/api/admin/teams", data, {
    headers: {
      'Content-Type': 'multipart/form-data' // Assuming we send FormData for logo
    }
  });
  return res.data;
};

export const updateTeam = async (id: string, data: any): Promise<any> => {
  const res = await apiClient.put(`/api/admin/teams/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const deleteTeam = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`/api/admin/teams/${id}`);
  return res.data;
};

// ================= FIXTURES =================

export const getAllFixtures = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.FIXTURES);
  return res.data;
};

export const getFixturesByLeague = async (leagueId: string): Promise<any> => {
  const res = await apiClient.get(`/api/user/leagues/${leagueId}/fixtures`);
  return res.data;
};

export const createFixture = async (data: any): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.FIXTURES, data);
  return res.data;
};

export const updateFixture = async (id: string, data: any): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.FIXTURES}/${id}`, data);
  return res.data;
};

export const deleteFixture = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`${ENDPOINTS.FIXTURES}/${id}`);
  return res.data;
};

// ================= LEAGUES =================

export const getAllLeagues = async (): Promise<any> => {
  const res = await apiClient.get(ENDPOINTS.GET_ALL_LEAGUES);
  return res.data;
};

export const createLeague = async (data: any): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.LEAGUES, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const updateLeague = async (id: string, data: any): Promise<any> => {
  const res = await apiClient.put(`${ENDPOINTS.LEAGUES}/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const deleteLeague = async (id: string): Promise<any> => {
  const res = await apiClient.delete(`${ENDPOINTS.LEAGUES}/${id}`);
  return res.data;
};
