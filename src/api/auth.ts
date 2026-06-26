import apiClient from "./apiClient";
import {
  SignInCredentials,
  SignUpCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  MessageResponse,
  UserProfileResponse,
  UpdateProfileRequest,
} from "../types/auth";

export const login = async (credentials: SignInCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (credentials: SignUpCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/register", credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>("/auth/reset-password", data);
  return response.data;
};

export const getProfile = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get<UserProfileResponse>("/auth/profile");
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileRequest,
  imageFile?: File
): Promise<UserProfileResponse> => {
  if (imageFile) {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.email) formData.append("email", data.email);
    formData.append("profileImage", imageFile);
    const response = await apiClient.patch<UserProfileResponse>("/auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
  const response = await apiClient.patch<UserProfileResponse>("/auth/profile", data);
  return response.data;
};
