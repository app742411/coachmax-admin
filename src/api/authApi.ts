// src/api/authApi.ts
import apiClient from "./apiClient";
import ENDPOINTS from "./endpoints";

export interface Admin {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  admin: Admin;
}

// Login API
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
  return res.data;
};

// Forgot Password API
export const sendForgotPasswordOTP = async (email: string): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, {
    email,
    role: "ADMIN",
  });
  return res.data;
};
 
// Resend OTP API
export const resendOTP = async (email: string): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.RESEND_OTP, {
    email,
    role: "ADMIN",
  });
  return res.data;
};
 
// Optional: Verify OTP API
export const verifyOTP = async (userId: string, email: string, otp: string): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.VALIDATE_OTP, {
    userId,
    email,
    otp,
    role: "ADMIN",
  });
  return res.data;
};

// Optional: Reset Password API
export const resetPassword = async (userId: string, newPassword: string): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.RESET_PASSWORD, {
    userId,
    newPassword,
    role: "ADMIN",
  });
  return res.data;
};

// Logout API
export const logoutUser = async (): Promise<any> => {
  const res = await apiClient.post(ENDPOINTS.LOGOUT);
  return res.data;
};
