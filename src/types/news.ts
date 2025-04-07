
export interface FeaturedArticle {
  id: string;
  title: string;
  image_url: string;
  category: string;
  publish_date: string;
  excerpt: string;
}

export interface NewsArticle extends FeaturedArticle {
  content: string;
  author?: string;
  slug: string;
  updated_at: string;
  created_at: string;
  is_featured: boolean;
}

export interface NewsCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
