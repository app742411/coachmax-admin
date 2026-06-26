export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  parent: any;
  players: any[];
  profileImage?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignInCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password?: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  profileImage?: string;
}


