import { queryOptions } from "@tanstack/react-query";
import { api, type Paginated } from "./client";
import type {
  Blog,
  Career,
  Equipment,
  Faq,
  ReviewSummary,
  Service,
  Settings,
  SocialLinks,
  Testimonial,
  Video,
} from "./types";

const FIVE_MIN = 5 * 60 * 1000;

export const servicesQ = (params: { limit?: number; featured?: boolean } = {}) =>
  queryOptions({
    queryKey: ["services", params],
    queryFn: ({ signal }) =>
      api.get<Paginated<Service>>("/services", { page_size: params.limit ?? 24, is_featured: params.featured }, signal),
    staleTime: FIVE_MIN,
  });

export const serviceBySlugQ = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: ({ signal }) => api.get<Service>(`/services/slug/${slug}`, undefined, signal),
    staleTime: FIVE_MIN,
  });

export const equipmentQ = (params: { limit?: number } = {}) =>
  queryOptions({
    queryKey: ["equipment", params],
    queryFn: ({ signal }) =>
      api.get<Paginated<Equipment>>("/equipment", { page_size: params.limit ?? 24 }, signal),
    staleTime: FIVE_MIN,
  });

export const equipmentBySlugQ = (slug: string) =>
  queryOptions({
    queryKey: ["equipment-item", slug],
    queryFn: ({ signal }) => api.get<Equipment>(`/equipment/slug/${slug}`, undefined, signal),
    staleTime: FIVE_MIN,
  });

export const blogsQ = (params: { limit?: number } = {}) =>
  queryOptions({
    queryKey: ["blogs", params],
    queryFn: ({ signal }) =>
      api.get<Paginated<Blog>>("/blogs", { page_size: params.limit ?? 24 }, signal),
    staleTime: FIVE_MIN,
  });

export const blogBySlugQ = (slug: string) =>
  queryOptions({
    queryKey: ["blog", slug],
    queryFn: ({ signal }) => api.get<Blog>(`/blogs/slug/${slug}`, undefined, signal),
    staleTime: FIVE_MIN,
  });

export const videosQ = (params: { limit?: number } = {}) =>
  queryOptions({
    queryKey: ["videos", params],
    queryFn: ({ signal }) =>
      api.get<Paginated<Video>>("/videos", { page_size: params.limit ?? 24 }, signal),
    staleTime: FIVE_MIN,
  });

export const testimonialsQ = (params: { limit?: number } = {}) =>
  queryOptions({
    queryKey: ["testimonials", params],
    queryFn: ({ signal }) =>
      api.get<Paginated<Testimonial>>("/testimonials", { page_size: params.limit ?? 24 }, signal),
    staleTime: FIVE_MIN,
  });

export const faqsQ = (params: { limit?: number } = {}) =>
  queryOptions({
    queryKey: ["faqs", params],
    queryFn: ({ signal }) =>
      api.get<Paginated<Faq>>("/faqs", { page_size: params.limit ?? 100 }, signal),
    staleTime: FIVE_MIN,
  });

export const careersQ = (params: { limit?: number } = {}) =>
  queryOptions({
    queryKey: ["careers", params],
    queryFn: ({ signal }) =>
      api.get<Paginated<Career>>("/careers", { page_size: params.limit ?? 24 }, signal),
    staleTime: FIVE_MIN,
  });

export const careerBySlugQ = (slug: string) =>
  queryOptions({
    queryKey: ["career", slug],
    queryFn: ({ signal }) => api.get<Career>(`/careers/slug/${slug}`, undefined, signal),
    staleTime: FIVE_MIN,
  });

export const settingsQ = () =>
  queryOptions({
    queryKey: ["settings"],
    queryFn: ({ signal }) => api.get<Settings>("/settings", undefined, signal),
    staleTime: FIVE_MIN,
  });

export const socialQ = () =>
  queryOptions({
    queryKey: ["social"],
    queryFn: ({ signal }) => api.get<SocialLinks>("/settings/social", undefined, signal),
    staleTime: FIVE_MIN,
  });

export const reviewSummaryQ = () =>
  queryOptions({
    queryKey: ["review-summary"],
    queryFn: ({ signal }) => api.get<ReviewSummary>("/reviews/summary", undefined, signal),
    staleTime: FIVE_MIN,
  });
