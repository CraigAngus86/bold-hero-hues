
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Star } from 'lucide-react';
import { useNewsStats } from '@/hooks/useNewsStats';

const NewsStats: React.FC = () => {
  const { data, isLoading } = useNewsStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">News Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { total, published, drafts } = data || { total: 0, published: 0, drafts: 0 };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">News Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{total}</span>
            <span className="ml-2 text-sm text-muted-foreground">Total Articles</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Featured</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-400 mr-1" />
                <span className="font-medium">{published}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Drafts</span>
              <div className="flex items-center">
                <span className="font-medium">{drafts}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsStats;
