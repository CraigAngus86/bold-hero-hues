
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
