
import { useState, useEffect } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNewsStore, formatDate } from '@/services/news';
import { NewsItem } from '@/services/news/types';

// Define the allowed categories
const ALLOWED_CATEGORIES = ['Club News', 'Match Reports', 'Spain Park', 'Community'];

const News = () => {
  const { news } = useNewsStore();
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get unique categories that are in the allowed list
  const categories = ['all', ...Array.from(new Set(
    news
      .map(item => item.category)
      .filter(category => ALLOWED_CATEGORIES.includes(category))
  ))];
  
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredNews([...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
      setFilteredNews(
        [...news]
          .filter(item => item.category === selectedCategory)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
    }
  }, [selectedCategory, news]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-team-blue transition-colors flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">News</span>
          </div>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">News & Updates</h1>
            <p className="text-gray-600 max-w-2xl">
              Stay up to date with the latest happenings at Banks o' Dee Football Club, from match reports to club announcements and community activities.
            </p>
          </div>
          
          {/* Filter */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 font-medium">Filter by:</span>
            </div>
            
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* News Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNews.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                excerpt={item.excerpt}
                image={item.image}
                date={formatDate(item.date)}
                category={item.category}
                className="h-full"
              />
            ))}
          </div>
          
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No news found</h3>
              <p className="text-gray-500 mb-6">There are no news articles in this category at the moment.</p>
              <Button onClick={() => setSelectedCategory('all')}>View All News</Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
