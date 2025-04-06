
import { create } from 'zustand';

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

interface NewsStore {
  news: NewsItem[];
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (id: number) => void;
}

export const useNewsStore = create<NewsStore>((set) => ({
  news: [
    {
      id: 1,
      title: 'Banks O'Dee FC Signs New Striker',
      excerpt: 'The club has announced the signing of talented striker John Smith from rival team Aberdeen FC.',
      image: '/lovable-uploads/news-1.jpg',
      date: '2023-06-15',
      category: 'Transfers'
    },
    {
      id: 2,
      title: 'Victory Against Formartine United',
      excerpt: 'Banks O'Dee secured a vital 2-1 victory against Formartine United in yesterday's Highland League match.',
      image: '/lovable-uploads/news-2.jpg',
      date: '2023-06-10',
      category: 'Match Reports'
    },
    {
      id: 3,
      title: 'Youth Academy Expansion',
      excerpt: 'The club announces plans to expand its youth academy program with new facilities and coaching staff.',
      image: '/lovable-uploads/news-3.jpg',
      date: '2023-06-05',
      category: 'Club News'
    }
  ],
  addNews: (newsItem) => set((state) => ({
    news: [...state.news, { ...newsItem, id: Math.max(0, ...state.news.map(n => n.id)) + 1 }]
  })),
  updateNews: (updatedNews) => set((state) => ({
    news: state.news.map(item => item.id === updatedNews.id ? updatedNews : item)
  })),
  deleteNews: (id) => set((state) => ({
    news: state.news.filter(item => item.id !== id)
  }))
}));
