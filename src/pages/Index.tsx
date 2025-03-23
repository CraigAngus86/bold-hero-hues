
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import SponsorsCarousel from '@/components/SponsorsCarousel';
import FixturesSection from '@/components/FixturesSection';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

const mockNews = [
  {
    id: 1,
    title: "Banks o' Dee crowned Highland League Cup Champions",
    excerpt: "The team celebrates with fans after a hard-fought victory in the final, adding another prestigious trophy to the club's growing collection.",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    date: "April 18, 2023",
    category: "Cup Success",
    size: "large"
  },
  {
    id: 2,
    title: "Thrilling victory in crucial league fixture",
    excerpt: "Banks o' Dee forward displays exceptional skill in our latest match, helping the team secure an important three points in our title chase.",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
    date: "March 25, 2023",
    category: "Match Report",
    size: "small"
  },
  {
    id: 3,
    title: "Spain Park facilities showcase - The pride of Banks o' Dee",
    excerpt: "Stunning aerial view of our recently upgraded stadium and facilities, situated in a picturesque location alongside the River Dee.",
    image: "/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png",
    date: "February 28, 2023",
    category: "Stadium News",
    size: "small"
  },
  {
    id: 4,
    title: "Youth Academy expansion announced",
    excerpt: "Club reveals plans to expand youth development program with new coaching staff and improved training facilities for young talents.",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    date: "February 15, 2023",
    category: "Youth News",
    size: "small"
  },
  {
    id: 5,
    title: "Community outreach program receives award",
    excerpt: "Banks o' Dee FC recognized for outstanding community service through various outreach initiatives throughout Aberdeen.",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
    date: "January 30, 2023",
    category: "Community",
    size: "small"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Fixtures, Results & Table Section */}
      <FixturesSection />
      
      {/* Latest News - with mixed card sizes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-team-blue mb-2">Latest News</h2>
              <p className="text-gray-600 max-w-2xl">Stay updated with the latest happenings from Banks o' Dee FC.</p>
            </div>
            <a 
              href="/news" 
              className="mt-4 md:mt-0 inline-flex items-center bg-team-lightBlue hover:bg-team-blue hover:text-white text-team-blue px-4 py-2 rounded-md transition-colors"
            >
              View All News <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockNews.map((news, index) => (
              <NewsCard
                key={news.id}
                title={news.title}
                excerpt={news.excerpt}
                image={news.image}
                date={news.date}
                category={news.category}
                size={news.size as 'small' | 'medium' | 'large'}
                className={index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Sponsors Carousel */}
      <SponsorsCarousel />
      
      <Footer />
    </div>
  );
};

export default Index;
