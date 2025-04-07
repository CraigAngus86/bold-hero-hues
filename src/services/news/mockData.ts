
import { NewsItem } from '@/types/news';

export const initialNews: NewsItem[] = [
  {
    id: '1',
    title: 'Highland League Cup Final Preview',
    excerpt: 'Banks o\' Dee prepare for the biggest match of the season against our local rivals.',
    category: 'Match Preview',
    publish_date: '2024-05-10',
    image_url: '/images/cup-final-preview.jpg',
    author: 'John Smith',
    is_featured: true
  },
  {
    id: '2',
    title: 'New Signing Announcement',
    excerpt: 'Banks o\' Dee are delighted to announce the signing of promising young striker James Wilson.',
    category: 'Club News',
    publish_date: '2024-04-28',
    image_url: '/images/new-signing.jpg',
    author: 'Sarah Johnson',
    is_featured: false
  },
  {
    id: '3',
    title: 'Match Report: Banks o\' Dee 3-1 Huntly',
    excerpt: 'A comprehensive victory keeps our title hopes alive as we enter the final stretch of the season.',
    category: 'Match Report',
    publish_date: '2024-04-21',
    image_url: '/images/match-report.jpg',
    author: 'Michael Thompson',
    is_featured: false
  }
];
