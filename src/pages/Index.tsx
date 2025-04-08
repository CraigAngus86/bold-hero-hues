
import React from 'react';
import Hero from '../components/Hero';
import NewsCard from '../components/NewsCard';
import { FeaturedArticle, NewsItem } from '../types/news';

// Updated with correct image paths from the uploaded images
const featuredArticle: FeaturedArticle = {
  id: '1',
  title: 'Banks o\' Dee secure crucial victory against Fraserburgh',
  content: 'Banks o\' Dee FC secured an important 2-1 victory against Fraserburgh at Spain Park on Saturday. Goals from John Smith and Mark Jones sealed the win.',
  excerpt: 'Banks o\' Dee FC secured an important 2-1 victory against Fraserburgh at Spain Park on Saturday.',
  category: 'Match Report',
  image_url: '/public/banks-o-dee-dark-logo.png',
  publish_date: '2023-04-02',
};

// Updated with correct image paths from the uploaded images
const recentNews: NewsItem[] = [
  {
    id: '2',
    title: 'Youth academy expansion announced',
    excerpt: 'The club is proud to announce a significant expansion of our youth development program.',
    category: 'Club News',
    image_url: '/public/Spain_Park_Slider_1920x1080.jpg',
    publish_date: '2023-03-28',
  },
  {
    id: '3',
    title: 'New sponsorship deal with local business',
    excerpt: 'Banks o\' Dee FC is delighted to announce a new partnership with Aberdeen-based company.',
    category: 'Sponsorship',
    image_url: '/public/Keith_Slider_1920x1080.jpg',
    publish_date: '2023-03-25',
  },
  {
    id: '4',
    title: 'Ticket information for upcoming cup fixture',
    excerpt: 'Important information regarding tickets for our upcoming Scottish Cup fixture.',
    category: 'Tickets',
    image_url: '/public/HLC_Slider_1920x1080.jpg',
    publish_date: '2023-03-22',
  }
];

const Index: React.FC = () => {
  return (
    <div>
      <Hero />
      
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8">Latest News</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NewsCard 
              title={featuredArticle.title}
              excerpt={featuredArticle.excerpt}
              image={featuredArticle.image_url}
              date={featuredArticle.publish_date}
              category={featuredArticle.category}
              featured={true}
              size="large"
            />
          </div>
          
          {recentNews.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              excerpt={item.excerpt}
              image={item.image_url || ''}
              date={item.publish_date || item.date || ''}
              category={item.category}
              size={recentNews.indexOf(item) === 0 ? "medium" : "small"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
