
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/news/NewsCard';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { getArticles, getNewsCategories } from '@/services/news/db/listing';
import { formatDate } from '@/services/news/utils';
import { Typography } from '@/components/ui';

const { H1, Body } = Typography;

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Fetch news categories
  const { data: categoriesData } = useQuery({
    queryKey: ['newsCategories'],
    queryFn: async () => {
      try {
        const response = await getNewsCategories();
        return response;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    }
  });
  
  // Fetch all news articles
  const { data: articlesData, isLoading, error } = useQuery({
    queryKey: ['newsArticles', selectedCategory],
    queryFn: async () => {
      try {
        const options = selectedCategory !== 'all' ? { category: selectedCategory } : {};
        const response = await getArticles({
          ...options,
          orderBy: 'publish_date',
          orderDirection: 'desc'
        });
        return response;
      } catch (error) {
        console.error('Error fetching news articles:', error);
        throw error;
      }
    }
  });

  // Process excerpt - strip HTML and limit length
  const processExcerpt = (content: string) => {
    return content
      .replace(/<[^>]*>?/gm, '')
      .substring(0, 120) + '...';
  };
  
  // Get a fallback image
  const getFallbackImage = (index: number) => {
    const images = [
      '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
      '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png',
      '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
      '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
      '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
      '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
      '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
      '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
      '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
      '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
      '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
      '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png'
    ];
    return images[index % images.length];
  };

  // Get list of categories from response
  const categories = categoriesData ? ['all', ...categoriesData] : ['all'];
  
  // Get news articles
  const articles = articlesData?.data || [];

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
            <H1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">News & Updates</H1>
            <Body className="text-gray-600 max-w-2xl">
              Stay up to date with the latest happenings at Banks o' Dee Football Club, from match reports to club announcements and community activities.
            </Body>
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
                <SelectItem value="all">All Categories</SelectItem>
                {categories
                  .filter(cat => cat !== 'all')
                  .map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading news articles...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="py-12 text-center">
              <p className="text-red-500 mb-4">Failed to load news articles</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          )}
          
          {/* News Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {articles.map((article, index) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  excerpt={processExcerpt(article.content)}
                  image={article.image_url || getFallbackImage(index)}
                  date={formatDate(article.publish_date)}
                  category={article.category}
                  slug={article.slug}
                  className="h-full"
                />
              ))}
            </div>
          )}
          
          {!isLoading && !error && articles.length === 0 && (
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
