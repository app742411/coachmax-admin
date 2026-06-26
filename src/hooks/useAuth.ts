import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login,
  registerUser,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} from "../api/auth";
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

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthResponse, Error, SignInCredentials>({
    mutationFn: login,
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthResponse, Error, SignUpCredentials>({
    mutationFn: registerUser,
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<MessageResponse, Error, ForgotPasswordRequest>({
    mutationFn: forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation<MessageResponse, Error, ResetPasswordRequest>({
    mutationFn: resetPassword,
  });
};

export const useProfile = () => {
  return useQuery<UserProfileResponse, Error>({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!localStorage.getItem("token"),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfileResponse, Error, { data: UpdateProfileRequest; imageFile?: File }>({
    mutationFn: ({ data, imageFile }) => updateProfile(data, imageFile),
    onSuccess: (response) => {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
