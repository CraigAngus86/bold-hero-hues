
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author?: string;
  publish_date: string;
  image_url?: string;
  is_featured: boolean;
  slug: string;
}

export interface NewsItem extends NewsArticle {}

export interface FeaturedArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  publish_date: string;
  image_url?: string;
  author?: string;
}

export interface NewsQueryOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  orderBy?: 'newest' | 'oldest';
}

export interface CreateNewsArticleData {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  author?: string;
  publish_date?: string;
  image_url?: string;
  is_featured?: boolean;
  slug: string;
}

export interface UpdateNewsArticleData {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  publish_date?: string;
  image_url?: string;
  is_featured?: boolean;
  slug?: string;
}
