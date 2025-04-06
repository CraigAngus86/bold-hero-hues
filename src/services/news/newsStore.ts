
import { create } from 'zustand';
import { NewsItem } from '@/types/news';

interface NewsStore {
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
  setNews: (news: NewsItem[]) => void;
  addNews: (newsItem: NewsItem) => void;
  updateNews: (newsItem: NewsItem) => void;
  removeNews: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNewsStore = create<NewsStore>((set) => ({
  news: [],
  isLoading: false,
  error: null,
  
  // Fixed the typing for setNews to properly handle NewsItem[]
  setNews: (news) => set(() => ({ news })),
  
  // Make sure we're using string IDs consistently
  addNews: (newsItem) => set((state) => ({ 
    news: [newsItem, ...state.news] 
  })),
  
  updateNews: (newsItem) => set((state) => ({
    news: state.news.map((item) => 
      item.id === newsItem.id ? newsItem : item
    )
  })),
  
  removeNews: (id) => set((state) => ({
    news: state.news.filter((item) => item.id !== id)
  })),
  
  setLoading: (isLoading) => set(() => ({ isLoading })),
  setError: (error) => set(() => ({ error })),
}));
