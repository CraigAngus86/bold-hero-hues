
// News related types
export interface NewsArticle {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  author?: string;
  date: string;
  imageUrl?: string;
  slug?: string;
  tags?: string[];
  featured?: boolean;
}
