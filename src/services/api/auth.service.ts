import { api, apiFetch, type Envelope } from "@/lib/api/client";

export type TherapistDocument = {
  id: string;
  title: string;
  file: {
    url: string;
    public_id?: string;
    resource_type?: string;
    format?: string;
    bytes?: number;
    original_filename?: string;
  };
  is_verified: boolean;
  uploaded_at: string;
  verified_at?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  user_type?: string;
  phone?: string;
  address?: string;
  age?: number | null;
  gender?: string | null;
  pincode?: string | null;
  medical_condition?: string | null;
  specialization?: string | null;
  experience_years?: number | null;
  qualification?: string | null;
  therapist_tier?: string | null;
  verification_status?: "pending" | "approved" | "rejected";
  is_email_verified: boolean;
  avatar?: { url: string; public_id?: string; [key: string]: any };
  documents?: TherapistDocument[];
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

  registerTherapist: async (payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
    user_type: "physiotherapist" | "yoga_therapist" | "massage_therapist";
    qualification?: string;
    specialization?: string;
    experience_years?: number;
  }): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/register-therapist", payload);
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

  updateProfile: async (payload: {
    name?: string;
    phone?: string;
    address?: string;
    age?: number;
    gender?: string;
    pincode?: string;
    medical_condition?: string;
  }): Promise<User> => {
    return api.put<User>("/auth/me", payload);
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const fd = new FormData();
    fd.append("file", file);
    return apiFetch<User>("/auth/me/avatar", {
      method: "POST",
      formData: fd,
    });
  },

  getBookings: async (): Promise<any[]> => {
    return api.get<any[]>("/auth/me/bookings");
  },

  addDocument: async (title: string, file: File): Promise<{ message: string; data: TherapistDocument }> => {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("file", file);
    return apiFetch<{ message: string; data: TherapistDocument }>("/users/me/documents", {
      method: "POST",
      formData: fd,
    });
  },

  deleteDocument: async (doc_id: string): Promise<{ message: string }> => {
    return api.delete(`/users/me/documents/${doc_id}`);
  },
};
