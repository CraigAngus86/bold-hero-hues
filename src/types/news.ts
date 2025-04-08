
/**
 * News types for the application
 */

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  image_url?: string;
  image?: string;
  date?: string;
  publish_date?: string;
  author?: string;
  slug?: string;
  tags?: string[];
  is_featured?: boolean;
}

export interface FeaturedArticle extends NewsItem {
  content: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author?: string;
  tags?: string[];
  publish_date: string;
  image_url?: string;
  status: 'published' | 'draft' | 'archived';
  featured?: boolean;
}

export interface NewsQueryOptions {
  category?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface CreateNewsArticleData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  category: string;
  author?: string;
  tags?: string[];
  image_url?: string;
  status: 'published' | 'draft';
  featured?: boolean;
}

export interface UpdateNewsArticleData {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  tags?: string[];
  image_url?: string;
  status?: 'published' | 'draft' | 'archived';
  featured?: boolean;
  publish_date?: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
}
