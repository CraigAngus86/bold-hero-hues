
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
  clearAllNews: () => void;
  restoreDefaultNews: () => void;
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
          news: [...state.news, { ...newsItem, id: newId }]
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
      
      getNewsById: (id) => get().news.find(item => item.id === id),
      
      clearAllNews: () => set({ news: [] }),
      
      restoreDefaultNews: () => set({ news: initialNews })
    }),
    {
      name: 'banks-o-dee-news-storage',
      onRehydrateStorage: () => {
        console.log('News store has been rehydrated');
        return (state) => {
          if (!state || !state.news || !Array.isArray(state.news)) {
            console.error('Failed to rehydrate news store or invalid data structure');
            // Return the initialNews if the rehydrated state is invalid
            if (state) {
              state.news = initialNews;
            }
          }
        };
      }
    }
  )
);
