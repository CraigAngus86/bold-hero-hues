
/**
 * Represents a news article in the system
 */
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  publish_date: string;
  category: string;
  author?: string;
  is_featured: boolean;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Data required to create a new article
 */
export interface CreateNewsArticleData {
  title: string;
  content: string;
  image_url?: string;
  publish_date?: string;
  category: string;
  author?: string;
  is_featured?: boolean;
  slug: string;
}

/**
 * Data for updating an existing article
 */
export interface UpdateNewsArticleData {
  title?: string;
  content?: string;
  image_url?: string;
  publish_date?: string;
  category?: string;
  author?: string;
  is_featured?: boolean;
  slug?: string;
}

/**
 * Options for querying news articles
 */
export interface NewsQueryOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  orderBy?: 'publish_date' | 'title' | 'created_at';
  orderDirection?: 'asc' | 'desc';
}
