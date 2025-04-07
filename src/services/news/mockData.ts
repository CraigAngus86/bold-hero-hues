
import { NewsItem } from '@/types/news';

// Initial mock news data for development
export const initialNews: NewsItem[] = [
  {
    id: '1',
    title: 'Banks o\' Dee Secure Victory in Highland League Opener',
    content: 'The team kicked off the new Highland League season with an impressive 3-1 victory against Keith FC at Spain Park. Goals from Johnson, Smith, and Williams sealed the win for the home side.',
    excerpt: 'Banks o\' Dee kicked off the new Highland League season with an impressive 3-1 victory against Keith FC.',
    category: 'Match Report',
    publish_date: '2025-04-05',
    image_url: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
    author: 'James Thompson',
    is_featured: true
  },
  {
    id: '2',
    title: 'New Home Kit Unveiled for the 2025/26 Season',
    content: 'We are excited to reveal our new home kit for the upcoming season, featuring a classic design with modern elements that pay tribute to the club\'s rich history.',
    excerpt: 'We are excited to reveal our new home kit for the upcoming season, featuring a classic design with modern elements.',
    category: 'Club News',
    publish_date: '2025-04-03',
    image_url: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
    author: 'Sarah Miller',
    is_featured: false
  },
  {
    id: '3',
    title: 'Youth Academy Expands with New Age Groups',
    content: 'Banks o\' Dee FC is proud to announce the expansion of our youth academy program to include two new age groups as part of our commitment to developing local talent.',
    excerpt: 'Banks o\' Dee FC is proud to announce the expansion of our youth academy program to include two new age groups.',
    category: 'Youth',
    publish_date: '2025-03-28',
    image_url: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
    author: 'David Clark',
    is_featured: false
  }
];
