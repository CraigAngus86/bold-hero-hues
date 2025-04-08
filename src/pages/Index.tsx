
import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import NewsCard from '../components/NewsCard';
import MediaGallery from '../components/home/MediaGallery';

// Mock data - completely static, detached from any backend services
const featuredArticle = {
  id: '1',
  title: 'Banks o\' Dee secure crucial victory against Fraserburgh',
  content: 'Banks o\' Dee FC secured an important 2-1 victory against Fraserburgh at Spain Park on Saturday. Goals from John Smith and Mark Jones sealed the win.',
  excerpt: 'Banks o\' Dee FC secured an important 2-1 victory against Fraserburgh at Spain Park on Saturday.',
  category: 'Match Report',
  image_url: '/public/banks-o-dee-dark-logo.png',
  image: '/public/banks-o-dee-dark-logo.png',
  publish_date: '2023-04-02',
  date: '2023-04-02',
  slug: 'banks-o-dee-secure-victory'
};

// Mock news data with updated image paths
const recentNews = [
  {
    id: '2',
    title: 'Youth academy expansion announced',
    excerpt: 'The club is proud to announce a significant expansion of our youth development program.',
    category: 'Club News',
    image_url: '/public/Spain_Park_Slider_1920x1080.jpg',
    image: '/public/Spain_Park_Slider_1920x1080.jpg',
    publish_date: '2023-03-28',
    date: '2023-03-28',
    slug: 'youth-academy-expansion'
  },
  {
    id: '3',
    title: 'New sponsorship deal with local business',
    excerpt: 'Banks o\' Dee FC is delighted to announce a new partnership with Aberdeen-based company.',
    category: 'Sponsorship',
    image_url: '/public/Keith_Slider_1920x1080.jpg',
    image: '/public/Keith_Slider_1920x1080.jpg',
    publish_date: '2023-03-25',
    date: '2023-03-25',
    slug: 'new-sponsorship-deal'
  },
  {
    id: '4',
    title: 'Ticket information for upcoming cup fixture',
    excerpt: 'Important information regarding tickets for our upcoming Scottish Cup fixture.',
    category: 'Tickets',
    image_url: '/public/HLC_Slider_1920x1080.jpg',
    image: '/public/HLC_Slider_1920x1080.jpg',
    publish_date: '2023-03-22',
    date: '2023-03-22',
    slug: 'ticket-information-cup-fixture'
  }
];

const Index: React.FC = () => {
  return (
    <div>
      {/* Enhanced hero section with overlapping cards */}
      <Hero />
      
      <div className="container mx-auto py-12 px-4 mt-36 md:mt-44">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-team-blue">Latest News</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NewsCard 
              title={featuredArticle.title}
              excerpt={featuredArticle.excerpt}
              image={featuredArticle.image_url}
              date={featuredArticle.publish_date}
              category={featuredArticle.category}
              slug={featuredArticle.slug}
              size="large"
            />
          </div>
          
          {recentNews.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              excerpt={item.excerpt}
              image={item.image_url}
              date={item.publish_date}
              category={item.category}
              slug={item.slug}
              size={recentNews.indexOf(item) === 0 ? "medium" : "small"}
            />
          ))}
        </div>
      </div>

      {/* Media Gallery Section */}
      <MediaGallery />
    </div>
  );
};

export default Index;
