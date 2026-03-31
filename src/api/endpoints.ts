// src/api/endpoints.ts

const ENDPOINTS = {
  // Auth & Admin
  LOGIN: "/api/admin/login",
  LOGOUT: "/api/admin/logout",
  FORGOT_PASSWORD: "/api/auth/forgotPassword",
  RESEND_OTP: "/api/auth/resendOTP",
  VALIDATE_OTP: "/api/auth/verifyOtp",
  RESET_PASSWORD: "/api/auth/resetPassword",
  GET_MY_PROFILE: "/api/auth/getMyProfile",
  UPDATE_PROFILE: "/api/auth/updateMyProfile",

  // Players
  GET_PEND_USERS: "/api/admin/getPendingUsers",
  GET_USERS: "/api/admin/getUsers",
  APPROVE_REJECT_PLAYER: "/api/admin/updateStatus",
  GET_TRAINING_SCHEDULE: "/api/admin/training-schedule",
  EXPORT_USERS: "/api/admin/exportUsers",

  // Sponsors
  CREATE_SPONSOR: "/api/admin/createBanner",
  UPDATE_SPONSOR: "/api/admin/updateBanner",
  GET_ALL_SPONSORS: "/api/admin/getAllBanners",
  DELETE_SPONSOR: "/api/admin/deleteBanner",
  TOGGLE_BANNER_STATUS: "/api/admin/toggleBannerStatus",
  CREATE_EVENT: "/api/admin/createEvent",
  GET_ALL_EVENTS: "/api/admin/getAllEvents",
  UPDATE_EVENT_STATUS: "/api/admin/updateEventStatus",
  UPDATE_EVENT: "/api/admin/updateEvent",
  GET_EVENT_DETAILS: "/api/admin/getEventDetails",
  GET_EVENT_PARTICIPANTS: "/api/admin/getEventParticipants",
  EXPORT_EVENT_PARTICIPANTS: "/api/admin/exportEventParticipants",

  // Categories & Terms
  CREATE_CATEGORY: "/api/admin/createCategory",
  GET_ALL_CATEGORIES: "/api/user/getCategories",
  UPDATE_CATEGORY: "/api/admin/updateCategory",
  DELETE_CATEGORY: "/api/admin/deleteCategory",
  CREATE_TERM: "/api/admin/createTerm",
  GET_ALL_TERMS: "/api/admin/getAllTerms",
  UPDATE_TERM: "/api/admin/updateTerm",
  DELETE_TERM: "/api/admin/deleteTerm",

  // Classes
  CREATE_CLASS: "/api/admin/createClass",
  GET_ALL_CLASSES: "/api/admin/getAllClasses",
  UPDATE_CLASS: "/api/admin/updateClass",
  GET_CLASS_BY_ID: "/api/admin/getClassById",
  DELETE_CLASS: "/api/admin/deleteClass",
  ASSIGN_CLASS: "/api/admin/assignClass",
  GET_CLASS_PLAYERS: "/api/admin/getClassPlayers",

  // Programs & Coaches (Needed for Class creation)
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
};

export default ENDPOINTS;
