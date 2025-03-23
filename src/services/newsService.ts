import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  size?: 'small' | 'medium' | 'large';
}

// Initial news data
const initialNews: NewsItem[] = [
  {
    id: 1,
    title: "Banks o' Dee crowned Highland League Cup Champions",
    excerpt: "The team celebrates with fans after a hard-fought victory in the final, adding another prestigious trophy to the club's growing collection.",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    date: "April 18, 2023",
    category: "Cup Success",
    size: "large"
  },
  {
    id: 2,
    title: "Thrilling victory in crucial league fixture",
    excerpt: "Banks o' Dee forward displays exceptional skill in our latest match, helping the team secure an important three points in our title chase.",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
    date: "March 25, 2023",
    category: "Match Report",
    size: "small"
  },
  {
    id: 3,
    title: "Spain Park facilities showcase - The pride of Banks o' Dee",
    excerpt: "Stunning aerial view of our recently upgraded stadium and facilities, situated in a picturesque location alongside the River Dee.",
    image: "/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png",
    date: "February 28, 2023",
    category: "Spain Park",
    size: "small"
  },
  {
    id: 4,
    title: "Youth Academy expansion announced",
    excerpt: "Club reveals plans to expand youth development program with new coaching staff and improved training facilities for young talents.",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    date: "February 15, 2023",
    category: "Youth News",
    size: "small"
  },
  {
    id: 5,
    title: "Community outreach program receives award",
    excerpt: "Banks o' Dee FC recognized for outstanding community service through various outreach initiatives throughout Aberdeen.",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
    date: "January 30, 2023",
    category: "Community",
    size: "small"
  },
  {
    id: 6,
    title: "Striker wins Player of the Month award",
    excerpt: "Our forward's excellent form has been recognized with the Highland League Player of the Month award.",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
    date: "January 15, 2023",
    category: "Club News",
    size: "small"
  },
  {
    id: 7,
    title: "Community outreach program launches at local schools",
    excerpt: "Banks o' Dee players visited local primary schools as part of our community engagement initiative.",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    date: "December 10, 2022",
    category: "Community",
    size: "large"
  },
  {
    id: 8,
    title: "Spain Park renovation update",
    excerpt: "Progress continues on our stadium enhancements, with new facilities set to be unveiled next month.",
    image: "/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png",
    date: "November 28, 2022",
    category: "Spain Park",
    size: "medium"
  }
];

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

// Helper function to format date for display
export const formatDate = (dateString: string): string => {
  // Check if the date is already in a display format (e.g., "April 18, 2023")
  if (/[A-Za-z]/.test(dateString)) {
    return dateString;
  }
  
  // Otherwise, assume it's a date string that needs formatting
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to get formatted date for database
export const getDbDateFormat = (displayDate: string): string => {
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
    return displayDate;
  }
  
  // Try to parse the display date
  const date = new Date(displayDate);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};
