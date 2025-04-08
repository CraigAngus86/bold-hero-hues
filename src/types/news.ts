
export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  excerpt: string;
  category: string;
  image?: string;
  image_url?: string;
  publish_date?: string;
  date?: string;
  author?: string;
  is_featured?: boolean;
}

export interface FeaturedArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image_url: string;
  publish_date: string;
}
