
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NewsItem } from './types';
import { initialNews } from './mockData';

interface NewsStore {
  news: NewsItem[];
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (id: number) => void;
  getNewsById: (id: number) => NewsItem | undefined;
}

// Create a store with persistence
export const useNewsStore = create<NewsStore>()(
  persist(
    (set, get) => ({
      news: initialNews,
      
      addNews: (newsItem) => set((state) => {
        const newId = state.news.length > 0 
          ? Math.max(...state.news.map(item => item.id)) + 1 
          : 1;
        
        return {
          news: [...state.news, { ...newsItem, id: newId, size: newsItem.size || 'medium' }]
        };
      }),
      
      updateNews: (newsItem) => set((state) => ({
        news: state.news.map(item => 
          item.id === newsItem.id ? { ...newsItem } : item
        )
      })),
      
      deleteNews: (id) => set((state) => ({
        news: state.news.filter(item => item.id !== id)
      })),
      
      getNewsById: (id) => get().news.find(item => item.id === id)
    }),
    {
      name: 'banks-o-dee-news-storage',
    }
  )
);
