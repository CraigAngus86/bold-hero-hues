
import { NewsItem } from '@/types/news';

export const newsArticles: NewsItem[] = [
  {
    id: '1',
    title: 'Exciting Victory for Banks o\' Dee',
    excerpt: 'The team secured a decisive win in the latest match.',
    category: 'Match Report',
    publish_date: '2025-04-05',
    image_url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
    author: 'John Smith',
    is_featured: true,
    content: 'The team secured a decisive win in the latest match. It was an outstanding performance from all players.',
    slug: 'exciting-victory'
  },
  {
    id: '2',
    title: 'New Player Signing Announcement',
    excerpt: 'Banks o\' Dee FC is proud to announce our latest signing.',
    category: 'Club News',
    publish_date: '2025-04-03',
    image_url: '/lovable-uploads/banks-o-dee-dark-logo.png',
    author: 'Jane Doe',
    is_featured: false,
    content: 'Banks o\' Dee FC is proud to announce our latest signing. The new player brings extensive experience to the team.',
    slug: 'new-player-signing'
  },
  {
    id: '3',
    title: 'Upcoming Community Event at Spain Park',
    excerpt: 'Join us for a family-friendly community day at Spain Park.',
    category: 'Community',
    publish_date: '2025-03-28',
    image_url: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
    author: 'Community Team',
    is_featured: false,
    content: 'Join us for a family-friendly community day at Spain Park. There will be activities for all ages.',
    slug: 'community-event'
  }
];
