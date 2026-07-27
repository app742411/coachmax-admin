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
  GET_REGISTRATION_REQUESTS: "/api/admin/registration-requests?status=PENDING",
  GET_ALL_TERMS: "/api/admin/getAllTerms",
  CREATE_TERM: "/api/admin/createTerm",
  UPDATE_TERM: "/api/admin/updateTerm",
  DELETE_TERM: "/api/admin/deleteTerm",
  CREATE_NEWS: "/api/admin/news",
  ASSIGN_CLASSES_TO_PLAYER: "/api/admin/player/:playerId/assign-classes",
  TEAMS: "/api/admin/getAllTeams",
  FIXTURES: "/api/admin/fixtures",
  GET_ALL_LEAGUES: "/api/admin/leagues",
  LEAGUES: "/api/admin/leagues",
  GET_NOTIFICATIONS: "/api/admin/notifications",
  READ_ALL_NOTIFICATIONS: "/api/admin/notifications/read-all",
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

export const getClassPlayers = async (classId: string): Promise<any> => {
  const res = await apiClient.get(`/api/admin/getClassPlayers/${classId}`);
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

export const getAvailablePlayers = async (): Promise<any> => {
  const res = await apiClient.get('/api/admin/available-players');
  return res.data;
};

export const assignPlayerToTeam = async (teamId: string, playerId: string): Promise<any> => {
  const res = await apiClient.post(`/api/admin/teams/${teamId}/assign`, { playerId });
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

export const getRegistrationRequests = async (page = 1, limit = 10, isMedicalCondition?: string): Promise<any> => {
  const params: any = { page, limit };
  if (isMedicalCondition && isMedicalCondition !== "All") {
    params.isMedicalCondition = isMedicalCondition;
  }
  const response = await apiClient.get(ENDPOINTS.GET_REGISTRATION_REQUESTS, {
    params,
  });
  return response.data;
};

export const getUnallocatedPlayers = async (
  category?: string,
  program?: string,
  search?: string
): Promise<any> => {
  const params: any = { allocationStatus: "UNALLOCATED" };
  if (category) params.category = category;
  if (program) params.program = program;
  if (search) params.search = search;
  const response = await apiClient.get("/api/admin/players/search", { params });
  return response.data;
};

export const assignClassesToPlayer = async (
  playerId: string,
  classIds: string[],
  paymentStatus: string,
  registrationRequestId?: string
): Promise<any> => {
  const url = ENDPOINTS.ASSIGN_CLASSES_TO_PLAYER.replace(":playerId", playerId);
  const payload: any = { classIds, paymentStatus };
  if (registrationRequestId) {
    payload.registrationRequestId = registrationRequestId;
  }
  const response = await apiClient.patch(url, payload);
  return response.data;
};

export const removeClassFromPlayer = async (
  userId: string,
  classId: string
): Promise<any> => {
  const response = await apiClient.post(`api/admin/removeClass/${userId}`, {
    classId,
  });
  return response.data;
};

export const getAllocatedPlayers = async (
  category?: string,
  program?: string,
  search?: string
): Promise<any> => {
  const params: any = { allocationStatus: "ALLOCATED" };
  if (category) params.category = category;
  if (program) params.program = program;
  if (search) params.search = search;
  const response = await apiClient.get("/api/admin/players/search", { params });
  return response.data;
};

// ================= NOTIFICATIONS =================

export const getNotifications = async (): Promise<any> => {
  const response = await apiClient.get(ENDPOINTS.GET_NOTIFICATIONS);
  return response.data;
};

export const markAllNotificationsRead = async (): Promise<any> => {
  const response = await apiClient.patch(ENDPOINTS.READ_ALL_NOTIFICATIONS);
  return response.data;
};
