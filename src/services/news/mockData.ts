
import { NewsItem } from '@/types/news';

export const initialNews: NewsItem[] = [
  {
    id: "1",
    title: 'Banks o\' Dee wins Highland League Cup',
    excerpt: 'Banks o\' Dee has won the Highland League Cup for the first time in club history with a 2-1 victory over Buckie Thistle.',
    image_url: '/images/news/trophy.jpg',
    publish_date: '2023-05-15T12:00:00Z',
    category: 'Match Report',
    author: 'John Smith',
    is_featured: true,
    slug: 'banks-o-dee-wins-highland-league-cup',
  },
  {
    id: "2",
    title: 'New signing joins Banks o\' Dee',
    excerpt: 'Banks o\' Dee is delighted to announce the signing of striker Mark Johnson from Fraserburgh FC.',
    image_url: '/images/news/signing.jpg',
    publish_date: '2023-05-10T14:30:00Z',
    category: 'Club News',
    author: 'Sarah Wilson',
    is_featured: false,
    slug: 'new-signing-joins-banks-o-dee',
  },
  {
    id: "3",
    title: 'Upcoming Fixture: Banks o\' Dee vs Formartine United',
    excerpt: 'This weekend, Banks o\' Dee will face Formartine United in a crucial Highland League match.',
    image_url: '/images/news/match-preview.jpg',
    publish_date: '2023-05-05T09:15:00Z',
    category: 'Fixture',
    author: 'Michael Brown',
    is_featured: false,
    slug: 'upcoming-fixture-banks-o-dee-vs-formartine-united',
  }
];
