
import { useQuery } from '@tanstack/react-query';

export const useFeaturedArticles = () => {
  try {
    return useQuery({
      queryKey: ['featuredArticles'],
      queryFn: async () => {
        // Mock data for featured articles
        return [
          {
            id: '1',
            title: 'Banks o\' Dee secures decisive victory',
            slug: 'banks-o-dee-secures-victory',
            excerpt: 'A fantastic performance from the home team leads to an important win.',
            image_url: '/lovable-uploads/banks-o-dee-logo.png',
            publish_date: new Date().toISOString(),
            category: 'Match Reports'
          },
          {
            id: '2',
            title: 'Youth Academy expansion announced',
            slug: 'youth-academy-expansion',
            excerpt: 'The club announces significant investment in youth development.',
            image_url: '/lovable-uploads/banks-o-dee-logo.png',
            publish_date: new Date().toISOString(),
            category: 'Club News'
          },
          {
            id: '3',
            title: 'New sponsorship deal secured',
            slug: 'new-sponsorship-deal',
            excerpt: 'Banks o\' Dee FC is proud to announce a major new partnership.',
            image_url: '/lovable-uploads/banks-o-dee-logo.png',
            publish_date: new Date().toISOString(),
            category: 'Announcements'
          }
        ];
      },
      retry: false,
      gcTime: 5 * 60 * 1000,
      staleTime: 30 * 1000,
    });
  } catch (error) {
    // Fallback for when React Query is not available
    console.error('React Query error:', error);
    return {
      data: [],
      isLoading: false,
      error: null,
      isError: false,
    };
  }
};
