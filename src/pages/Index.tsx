
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import SponsorsCarousel from '@/components/SponsorsCarousel';
import FixturesSection from '@/components/FixturesSection';
import SocialMediaFeed from '@/components/SocialMediaFeed';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import { useNewsStore, formatDate } from '@/services/news';

const Index = () => {
  const { news } = useNewsStore();
  
  // Sort all news by date
  const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Skip the first 3 items (shown in hero) and get the next 6 news items for the Latest News section
  const latestNews = sortedNews.slice(3, 9);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Latest News - with fixed grid layout */}
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
          
          <div className="grid grid-cols-12 gap-6">
            {latestNews.map((newsItem, index) => {
              // First item is large (spans 6x3)
              if (index === 0) {
                return (
                  <div key={newsItem.id} className="col-span-12 md:col-span-6">
                    <NewsCard
                      title={newsItem.title}
                      excerpt={newsItem.excerpt}
                      image={newsItem.image}
                      date={formatDate(newsItem.date)}
                      category={newsItem.category}
                      featured={true}
                      className="h-full"
                    />
                  </div>
                );
              }
              
              // All other items are small (3x3)
              return (
                <div key={newsItem.id} className="col-span-12 sm:col-span-6 md:col-span-3">
                  <NewsCard
                    title={newsItem.title}
                    excerpt={newsItem.excerpt}
                    image={newsItem.image}
                    date={formatDate(newsItem.date)}
                    category={newsItem.category}
                    className="h-full"
                  />
                </div>
              );
            })}
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
