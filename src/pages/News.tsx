
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const allNews = [
  {
    id: 1,
    title: "Banks o' Dee crowned Highland League Cup Champions",
    excerpt: "The team celebrates with fans after a hard-fought victory in the final, adding another prestigious trophy to the club's growing collection.",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    date: "April 18, 2023",
    category: "Match Report",
    size: "large"
  },
  {
    id: 2,
    title: "Thrilling victory in crucial league fixture",
    excerpt: "Banks o' Dee forward displays exceptional skill in our latest match, helping the team secure an important three points in our title chase.",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
    date: "March 25, 2023",
    category: "Match Report",
    size: "medium"
  },
  {
    id: 3,
    title: "Spain Park facilities showcase - The pride of Banks o' Dee",
    excerpt: "Stunning aerial view of our recently upgraded stadium and facilities, situated in a picturesque location alongside the River Dee.",
    image: "/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png",
    date: "February 28, 2023",
    category: "Spain Park",
    size: "medium"
  },
  {
    id: 4,
    title: "Young talent shines in youth development program",
    excerpt: "Our academy continues to produce promising young players, with several making their first team debuts this season.",
    image: "/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png",
    date: "February 15, 2023",
    category: "Club News",
    size: "small"
  },
  {
    id: 5,
    title: "Club announces new partnership with local business",
    excerpt: "Banks o' Dee FC is delighted to announce a new sponsorship deal that will help support our continued growth.",
    image: "/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png",
    date: "January 30, 2023",
    category: "Club News",
    size: "small"
  },
  {
    id: 6,
    title: "Striker wins Player of the Month award",
    excerpt: "Our forward's excellent form has been recognized with the Highland League Player of the Month award.",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
    date: "January 15, 2023",
    category: "Club News",
    size: "small"
  },
  {
    id: 7,
    title: "Community outreach program launches at local schools",
    excerpt: "Banks o' Dee players visited local primary schools as part of our community engagement initiative.",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    date: "December 10, 2022",
    category: "Community",
    size: "large"
  },
  {
    id: 8,
    title: "Spain Park renovation update",
    excerpt: "Progress continues on our stadium enhancements, with new facilities set to be unveiled next month.",
    image: "/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png",
    date: "November 28, 2022",
    category: "Spain Park",
    size: "medium"
  }
];

const categories = ["All", "Match Report", "Spain Park", "Club News", "Community"];

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredNews = allNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || news.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-team-blue mb-4">Latest News</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay up to date with the latest happenings at Banks o' Dee FC.
            </p>
          </motion.div>
          
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search news..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      selectedCategory === category 
                        ? 'bg-team-blue text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.length > 0 ? (
              filteredNews.map((news) => (
                <NewsCard
                  key={news.id}
                  title={news.title}
                  excerpt={news.excerpt}
                  image={news.image}
                  date={news.date}
                  category={news.category}
                  size={news.size as 'small' | 'medium' | 'large'}
                  className={news.size === 'large' ? 'md:col-span-2' : ''}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No news articles found matching your search criteria.</p>
                <button 
                  className="mt-4 text-team-blue hover:underline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default News;
