
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NewsPreviewProps {
  news: any[] | null;  // Using any[] for now since the exact type might vary
  isLoading: boolean;
}

const NewsPreview: React.FC<NewsPreviewProps> = ({ news, isLoading }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : news && news.length > 0 ? (
          <div className="space-y-4">
            {news.slice(0, 3).map((article, index) => (
              <div key={index} className="border-b pb-2 last:border-0">
                <Link to={`/news/${article.slug}`} className="block group">
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="mt-1 text-sm text-gray-600 flex justify-between">
                    <span>{article.category}</span>
                    <span>{format(new Date(article.publish_date || article.created_at), 'dd MMM yyyy')}</span>
                  </div>
                  <p className="mt-1 text-sm line-clamp-2 text-gray-700">
                    {article.excerpt || article.content?.substring(0, 100)}...
                  </p>
                </Link>
              </div>
            ))}
            <div className="pt-2">
              <Link to="/news">
                <Button variant="outline" size="sm" className="w-full">
                  View All News
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No news articles to display
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsPreview;
