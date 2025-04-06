
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  category: string;
  publish_date: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  is_featured: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

export interface NewsQueryOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  category?: string;
  featured?: boolean;
  searchTerm?: string;
}

export interface CreateNewsArticleData {
  title: string;
  content: string;
  category: string;
  author?: string;
  image_url?: string;
  is_featured?: boolean;
  publish_date?: string;
  slug?: string;
}

export interface UpdateNewsArticleData {
  title?: string;
  content?: string;
  category?: string;
  author?: string;
  image_url?: string;
  is_featured?: boolean;
  publish_date?: string;
  slug?: string;
}
