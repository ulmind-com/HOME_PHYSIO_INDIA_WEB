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
  video_file?: { url?: string | null } | null;
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

export type HeroSlide = {
  title?: string | null;
  subtitle?: string | null;
  button_text?: string | null;
  button_link?: string | null;
  background_image?: ImageAsset | null;
  order?: number;
};

export type ServicesHero = {
  title?: string | null;
  subtitle?: string | null;
  background_image?: ImageAsset | null;
  stats?: HeroStat[];
  slides?: HeroSlide[];
};

export type HomeHeroStat = {
  value: number;
  suffix: string;
  label: string;
};

export type HomeHero = {
  trust_badge_text?: string | null;
  trust_badge_quote?: string | null;
  trust_badge_avatars?: ImageAsset[];
  slider_images?: ImageAsset[];
  stats?: HomeHeroStat[];
};

export type Settings = {
  website_name?: string | null;
  tagline?: string | null;
  logo?: string | null;
  favicon?: string | null;
  theme_primary?: string | null;
  theme_accent?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  google_map_embed?: string | null;
  google_reviews_link?: string | null;
  working_hours?: { day: string; hours: string }[];
  services_hero?: ServicesHero | null;
  home_hero?: HomeHero | null;

  // Hero section
  hero_headline?: string | null;
  hero_subtitle?: string | null;
  hero_description?: string | null;
  hero_image?: string | ImageAsset | null;
  hero_stats?: { value: string; label: string }[];

  // About page
  about_hero_badge?: string | null;
  about_hero_title?: string | null;
  about_hero_description?: string | null;
  about_hero_image?: string | ImageAsset | null;
  about_story_title?: string | null;
  about_story_text?: string | null;
  about_stats?: { value: string; label: string }[];
  about_values?: { title: string; body: string }[];
  about_commitments?: string[];

  // How It Works
  how_it_works_steps?: { title: string; body: string }[];

  // Professionals / Team
  team_tiles?: { image: string; count: string; title: string; desc: string }[];

  // CareTeam Slider (Home Page)
  care_team_slides?: {
    image: string;
    eyebrow: string;
    title: string;
    description: string;
    button_text: string;
    button_link: string;
    stats: { count: string; label: string }[];
  }[];

  // Trust bar items
  trust_bar_items?: string[];

  // Footer
  footer_tagline?: string | null;
  footer_description?: string | null;
  footer_image?: string | null;

  // Contact CTA
  cta_title?: string | null;
  cta_description?: string | null;

  // About Welcome Section
  about_welcome_title?: string | null;
  about_welcome_description?: string | null;
  about_welcome_image?: string | ImageAsset | null;
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
