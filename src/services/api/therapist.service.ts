import { apiFetch } from "@/lib/api/client";
import type { PaginatedResponse } from "@/lib/api/client";

export interface TherapistProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: { url: string; public_id?: string };
  specialization?: string;
  experience_years?: number;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const therapistService = {
  list: async (params?: { page?: number; page_size?: number; search?: string; specialization?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.page_size) searchParams.append("page_size", params.page_size.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.specialization) searchParams.append("specialization", params.specialization);

    const query = searchParams.toString();
    const url = `/therapists${query ? `?${query}` : ""}`;
    
    return apiFetch<PaginatedResponse<TherapistProfile>>(url);
  },
};
