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

  // Add more as needed
};

export default ENDPOINTS;
