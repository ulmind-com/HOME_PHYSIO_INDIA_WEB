import { api, type Envelope } from "@/lib/api/client";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  is_email_verified: boolean;
  avatar?: { url: string };
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
};

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/login", { email, password });
  },

  register: async (payload: { name: string; email: string; password: string; phone: string }): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/register", payload);
  },

  verifyEmail: async (email: string, otp: string): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/verify-email", { email, otp });
  },

  resendOtp: async (email: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/resend-otp", { email });
  },

  googleLogin: async (id_token: string, phone?: string): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/google-login", { id_token, phone });
  },

  logout: async (refresh_token: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/logout", { refresh_token });
  },

  refresh: async (refresh_token: string): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/refresh", { refresh_token });
  },

  me: async (): Promise<User> => {
    return api.get<User>("/auth/me");
  },
};
