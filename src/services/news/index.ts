
// This is a simplified mock service to replace the real news service
import { create } from 'zustand';
import { NewsItem } from '@/types/news';

// Format date properly
export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return dateString;
  }
};

// Mock news data
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Banks o\' Dee Secure Victory in Highland League Opener',
    content: 'The team kicked off the new Highland League season with an impressive 3-1 victory against Keith FC at Spain Park. Goals from Johnson, Smith, and Williams sealed the win for the home side.',
    excerpt: 'The team kicked off the new Highland League season with an impressive 3-1 victory against Keith FC.',
    image_url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
    category: 'Match Report',
    publish_date: '2025-04-05',
    author: 'John Smith',
    is_featured: true
  },
  {
    id: '2',
    title: 'New Signing Announcement: Star Midfielder Joins the Club',
    content: 'Banks o\' Dee FC is delighted to announce the signing of Scottish midfielder Alex Ferguson from Aberdeen FC. The 24-year-old has signed a two-year deal and will wear the number 8 shirt.',
    excerpt: 'Banks o\' Dee FC is delighted to announce the signing of Scottish midfielder Alex Ferguson from Aberdeen FC.',
    image_url: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
    category: 'Transfer News',
    publish_date: '2025-04-03',
    author: 'Sarah Johnson',
    is_featured: true
  },
  {
    id: '3',
    title: 'Youth Academy Players Join First Team Training',
    content: 'Three promising players from our youth academy have been invited to train with the first team this week. Coach Williams praised their development and potential future with the club.',
    excerpt: 'Three promising players from our youth academy have been invited to train with the first team this week.',
    image_url: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
    category: 'Youth Development',
    publish_date: '2025-04-01',
    author: 'David Brown',
    is_featured: false
  },
  {
    id: '4',
    title: 'Spain Park Facilities Upgraded for New Season',
    content: 'Significant improvements have been made to Spain Park ahead of the new season, including renovated changing rooms, improved pitch drainage, and enhanced spectator facilities.',
    excerpt: 'Significant improvements have been made to Spain Park ahead of the new season.',
    image_url: '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
    category: 'Club News',
    publish_date: '2025-03-28',
    author: 'Emma Wilson',
    is_featured: false
  },
  {
    id: '5',
    title: 'Ticket Information for Upcoming Highland League Fixtures',
    content: 'Ticket details for our first five Highland League matches have been announced. Season ticket holders will have priority access before general sale begins next week.',
    excerpt: 'Ticket details for our first five Highland League matches have been announced.',
    image_url: '/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png',
    category: 'Tickets',
    publish_date: '2025-03-25',
    author: 'Robert Taylor',
    is_featured: false
  }
];

// Create a Zustand store for news data
interface NewsStore {
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
  fetchNews: () => Promise<void>;
  getNewsById: (id: string) => NewsItem | undefined;
  getFeaturedNews: () => NewsItem[];
}

export const useNewsStore = create<NewsStore>((set, get) => ({
  news: mockNewsData,
  isLoading: false,
  error: null,
  
  fetchNews: async () => {
    // This would normally fetch from an API, but we're using mock data
    set({ isLoading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set({ 
      news: mockNewsData,
      isLoading: false 
    });
  },
  
  getNewsById: (id) => {
    return get().news.find(item => item.id === id);
  },
  
  getFeaturedNews: () => {
    return get().news.filter(item => item.is_featured);
  }
}));

// Export for convenience
export const { fetchNews, getNewsById, getFeaturedNews } = useNewsStore.getState();
