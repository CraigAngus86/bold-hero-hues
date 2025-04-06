
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsArticleCard } from "@/components/news/NewsArticleCard";
import { useNews } from "@/hooks/useNews";
import { ChevronRight } from "lucide-react";
import { NewsArticle } from '@/types/news';

const NewsSection = () => {
  const navigate = useNavigate();
  const { isLoading, error, news } = useNews({ 
    category: 'all', 
    page: 1, 
    pageSize: 3, 
    featured: false 
  });

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-team-blue">Latest News</h2>
        <Button variant="ghost" onClick={() => navigate('/news')} className="flex items-center space-x-1">
          <span>View All</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="w-full aspect-video" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          Failed to load news. Please try again later.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(news?.data || []).length === 0 ? (
            <p className="col-span-3 text-center py-8 text-gray-500">No news articles found.</p>
          ) : (
            (news?.data || []).map((article: NewsArticle) => (
              <NewsArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default NewsSection;
