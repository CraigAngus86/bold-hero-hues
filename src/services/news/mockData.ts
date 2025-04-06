
import { NewsItem } from '@/types/news';

// Initial mock news data for the NewsStore
export const initialNews: NewsItem[] = [
  {
    id: 1,
    title: "Banks O'Dee FC Signs New Striker",
    excerpt: "The club has announced the signing of talented striker John Smith from rival team Aberdeen FC.",
    image: "/lovable-uploads/news-1.jpg",
    date: "2023-06-15",
    category: "Transfers"
  },
  {
    id: 2,
    title: "Victory Against Formartine United",
    excerpt: "Banks O'Dee secured a vital 2-1 victory against Formartine United in yesterday's Highland League match.",
    image: "/lovable-uploads/news-2.jpg",
    date: "2023-06-10",
    category: "Match Reports"
  },
  {
    id: 3,
    title: "Youth Academy Expansion",
    excerpt: "The club announces plans to expand its youth academy program with new facilities and coaching staff.",
    image: "/lovable-uploads/news-3.jpg",
    date: "2023-06-05",
    category: "Club News"
  }
];
