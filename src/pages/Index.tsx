
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import SponsorsCarousel from '@/components/SponsorsCarousel';
import FixturesSection from '@/components/FixturesSection';
import SocialMediaFeed from '@/components/SocialMediaFeed';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import { useNewsStore, formatDate } from '@/services/newsService';

const Index = () => {
  const { news } = useNewsStore();
  
  // Sort all news by date
  const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get the top 3 for hero
  const heroNews = sortedNews.slice(0, 3);
  
  // Get news items for the Latest News section, excluding those in the hero
  const heroNewsIds = heroNews.map(item => item.id);
  const latestNews = sortedNews
    .filter(item => !heroNewsIds.includes(item.id))
    .slice(0, 5);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Latest News - with mixed card sizes - moved above fixtures section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-team-blue">Latest News</h2>
            
            <a 
              href="/news" 
              className="inline-flex items-center bg-team-lightBlue hover:bg-team-blue hover:text-white text-team-blue px-4 py-2 rounded-md transition-colors"
            >
              View All News <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestNews.map((news, index) => (
              <NewsCard
                key={news.id}
                title={news.title}
                excerpt={news.excerpt}
                image={news.image}
                date={formatDate(news.date)}
                category={news.category}
                size={news.size as 'small' | 'medium' | 'large'}
                className={index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Fixtures, Results & Table Section */}
      <FixturesSection />
      
      {/* Social Media Feed Section - moved below fixtures */}
      <SocialMediaFeed />
      
      {/* Sponsors Carousel */}
      <SponsorsCarousel />
      
      <Footer />
    </div>
  );
};

export default Index;
