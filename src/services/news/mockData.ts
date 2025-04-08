
import { NewsArticle } from '@/types/news';

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Banks o\' Dee secure crucial victory against Fraserburgh',
    slug: 'banks-o-dee-secure-crucial-victory',
    content: '<p>Banks o\' Dee FC secured an important 2-1 victory against Fraserburgh at Spain Park on Saturday. Goals from John Smith and Mark Jones sealed the win.</p><p>The team showed great resilience after going behind early in the match, with Smith equalizing before halftime and Jones scoring the winner in the 78th minute.</p><p>This victory moves Banks o\' Dee up to 3rd in the Highland League table.</p>',
    excerpt: 'Banks o\' Dee FC secured an important 2-1 victory against Fraserburgh at Spain Park on Saturday.',
    category: 'Match Report',
    author: 'John Robertson',
    tags: ['match', 'victory', 'Highland League'],
    publish_date: '2023-04-02',
    image_url: '/public/banks-o-dee-dark-logo.png',
    status: 'published',
    featured: true
  },
  {
    id: '2',
    title: 'Youth academy expansion announced',
    slug: 'youth-academy-expansion',
    content: '<p>The club is proud to announce a significant expansion of our youth development program. Starting next season, we will be adding three new age groups and bringing in specialized coaching staff.</p><p>This investment in our youth system demonstrates our commitment to developing local talent and building a sustainable future for the club.</p>',
    excerpt: 'The club is proud to announce a significant expansion of our youth development program.',
    category: 'Club News',
    author: 'Sarah Mitchell',
    tags: ['youth', 'academy', 'development'],
    publish_date: '2023-03-28',
    image_url: '/public/Spain_Park_Slider_1920x1080.jpg',
    status: 'published',
    featured: false
  },
  {
    id: '3',
    title: 'New sponsorship deal with local business',
    slug: 'new-sponsorship-deal',
    content: '<p>Banks o\' Dee FC is delighted to announce a new partnership with Aberdeen-based company TechNorth Solutions. The multi-year sponsorship deal will see the TechNorth logo featured on our away kits for the next two seasons.</p><p>This partnership marks a significant step forward for the club\'s commercial activities and will help fund various community initiatives.</p>',
    excerpt: 'Banks o\' Dee FC is delighted to announce a new partnership with Aberdeen-based company.',
    category: 'Sponsorship',
    author: 'David Wilson',
    tags: ['sponsorship', 'partnership', 'commercial'],
    publish_date: '2023-03-25',
    image_url: '/public/Keith_Slider_1920x1080.jpg',
    status: 'published',
    featured: false
  },
  {
    id: '4',
    title: 'Ticket information for upcoming cup fixture',
    slug: 'ticket-information-cup-fixture',
    content: '<p>Important information regarding tickets for our upcoming Scottish Cup fixture against Inverness Caledonian Thistle. Tickets will go on sale to season ticket holders on Monday, with general sale starting Wednesday.</p><p>We anticipate high demand for this prestigious cup tie, so we encourage fans to book early to avoid disappointment. Prices start at £12 for adults and £5 for concessions.</p>',
    excerpt: 'Important information regarding tickets for our upcoming Scottish Cup fixture.',
    category: 'Tickets',
    author: 'Emma Brown',
    tags: ['tickets', 'cup', 'fixture'],
    publish_date: '2023-03-22',
    image_url: '/public/HLC_Slider_1920x1080.jpg',
    status: 'published',
    featured: false
  }
];

export const newsCategories = [
  { id: '1', name: 'Match Report', slug: 'match-report' },
  { id: '2', name: 'Club News', slug: 'club-news' },
  { id: '3', name: 'Sponsorship', slug: 'sponsorship' },
  { id: '4', name: 'Tickets', slug: 'tickets' },
  { id: '5', name: 'Community', slug: 'community' },
  { id: '6', name: 'Player News', slug: 'player-news' }
];
