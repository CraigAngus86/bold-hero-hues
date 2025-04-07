
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  image_url?: string;
  image?: string;
  category: string;
  author?: string;
  publish_date: string;
  date?: string;
  is_featured?: boolean;
  tags?: string[];
}

export interface NewsArticle extends NewsItem {
  // Additional properties for full article view
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;
  updated_at?: string;
  view_count?: number;
}

export interface FeaturedArticle extends NewsItem {
  summary?: string;
  highlight?: boolean;
}

export interface NewsQueryOptions {
  limit?: number;
  offset?: number;
  category?: string;
  featured?: boolean;
  published?: boolean;
  sort?: 'newest' | 'oldest' | 'popular';
  tag?: string;
}

export interface CreateNewsArticleData {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  image_url?: string;
  category: string;
  author?: string;
  tags?: string[];
  is_featured?: boolean;
  is_published?: boolean;
}

export interface UpdateNewsArticleData extends Partial<CreateNewsArticleData> {
  id: string;
}
