export type SeoMeta = {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  canonical_url?: string | null;
  og_image?: string | null;
  schema_markup?: unknown;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  icon?: string | null;
  featured_image?: string | null;
  gallery?: string[];
  price?: number | null;
  price_unit?: string | null;
  features?: string[];
  seo?: SeoMeta;
  is_featured?: boolean;
  order?: number;
  status?: string;
};

export type Equipment = {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  featured_image?: string | null;
  gallery?: string[];
  rental_price?: number | null;
  price_unit?: string | null;
  daily_rate?: number | null;
  features?: string[];
  specs?: Record<string, string> | null;
  is_available?: boolean;
  is_featured?: boolean;
  status?: string;
};

export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | ImageAsset | null;
  author?: string | null;
  author_name?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  tags?: string[];
  read_time?: number | null;
  published_at?: string | null;
  created_at?: string;
  is_featured?: boolean;
  status?: string;
};

export type Video = {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  video_url?: string | null;
  youtube_url?: string | null;
  duration?: string | null;
  category?: string | null;
  is_featured?: boolean;
  created_at?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role?: string | null;
  designation?: string | null;
  content?: string | null;
  message?: string | null;
  rating?: number | null;
  image?: string | null;
  avatar?: string | null;
  service?: string | null;
  is_featured?: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  order?: number;
};

export type Career = {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  location?: string | null;
  employment_type?: string | null;
  experience?: string | null;
  salary_range?: string | null;
  is_active?: boolean;
  created_at?: string;
};

export type ImageAsset = {
  url: string;
  public_id?: string | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  alt?: string | null;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type ServicesHero = {
  title?: string | null;
  subtitle?: string | null;
  background_image?: ImageAsset | null;
  stats?: HeroStat[];
};

export type Settings = {
  website_name?: string | null;
  tagline?: string | null;
  logo?: string | null;
  favicon?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  google_map_embed?: string | null;
  google_reviews_link?: string | null;
  working_hours?: { day: string; hours: string }[];
  services_hero?: ServicesHero | null;
};

export type SocialLinks = {
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  twitter?: string | null;
  whatsapp?: string | null;
};

export type ReviewSummary = {
  total_reviews: number;
  average_rating: number;
  distribution: Record<string, number>;
  google_reviews_link?: string | null;
};
