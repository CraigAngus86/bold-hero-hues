
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import SponsorsCarousel from '@/components/SponsorsCarousel';
import FixturesSection from '@/components/FixturesSection';
import SocialMediaFeed from '@/components/SocialMediaFeed';
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
  },
  {
    id: 6,
    title: "New signing joins from Premier League academy",
    excerpt: "Exciting young talent makes the move to Spain Park after impressing in youth setup at top-flight club.",
    image: "/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png",
    date: "January 15, 2023",
    category: "Transfer News",
    size: "small"
  },
  {
    id: 7,
    title: "Club announces new partnership with local business",
    excerpt: "Strategic partnership set to benefit both organizations and strengthen community ties in Aberdeen.",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    date: "January 10, 2023",
    category: "Club News",
    size: "small"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Latest News - with modified card layout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-team-blue mb-2">Latest News</h2>
            </div>
            <a 
              href="/news" 
              className="mt-4 md:mt-0 inline-flex items-center bg-team-lightBlue hover:bg-team-blue hover:text-white text-team-blue px-4 py-2 rounded-md transition-colors"
            >
              View All News <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Main featured news card - now taking 75% of the width (3 of 4 columns) */}
            <div className="md:col-span-3">
              <NewsCard
                key={mockNews[0].id}
                title={mockNews[0].title}
                excerpt={mockNews[0].excerpt}
                image={mockNews[0].image}
                date={mockNews[0].date}
                category={mockNews[0].category}
                size="large"
                featured={true}
              />
            </div>
            
            {/* Right side column with 2 small cards stacked */}
            <div className="md:col-span-1 flex flex-col gap-6">
              <NewsCard
                key={mockNews[1].id}
                title={mockNews[1].title}
                excerpt={mockNews[1].excerpt}
                image={mockNews[1].image}
                date={mockNews[1].date}
                category={mockNews[1].category}
                size="small"
              />
              <NewsCard
                key={mockNews[2].id}
                title={mockNews[2].title}
                excerpt={mockNews[2].excerpt}
                image={mockNews[2].image}
                date={mockNews[2].date}
                category={mockNews[2].category}
                size="small"
              />
            </div>
            
            {/* Lower row with 4 small cards */}
            <div className="col-span-1 md:col-span-2">
              <NewsCard
                key={mockNews[3].id}
                title={mockNews[3].title}
                excerpt={mockNews[3].excerpt}
                image={mockNews[3].image}
                date={mockNews[3].date}
                category={mockNews[3].category}
                size="small"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <NewsCard
                key={mockNews[4].id}
                title={mockNews[4].title}
                excerpt={mockNews[4].excerpt}
                image={mockNews[4].image}
                date={mockNews[4].date}
                category={mockNews[4].category}
                size="small"
              />
            </div>
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
