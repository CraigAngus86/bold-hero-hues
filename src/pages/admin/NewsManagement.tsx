
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedNewsArticleEditor from '@/components/admin/news/EnhancedNewsArticleEditor';
import { EnhancedNewsArticleList } from '@/components/admin/news/EnhancedNewsArticleList';
import { NewsArticleDrafts } from '@/components/admin/news/NewsArticleDrafts';
import { NewsArticleArchive } from '@/components/admin/news/NewsArticleArchive';
import { NewsArticle } from '@/types/news';

const NewsManagement = () => {
  const [view, setView] = useState('list');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  
  const handleCreateNew = () => {
    setSelectedArticle(null);
    setView('edit');
  };
  
  const handleEditArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setView('edit');
  };
  
  const handleBack = () => {
    setView('list');
    setSelectedArticle(null);
  };
  
  const handleSaved = () => {
    setView('list');
    setSelectedArticle(null);
  };
  
  return (
    <div className="space-y-4">
      {view === 'edit' ? (
        <EnhancedNewsArticleEditor 
          article={selectedArticle} 
          onBack={handleBack}
          onSaved={handleSaved}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="all" className="flex-1">All Articles</TabsTrigger>
                <TabsTrigger value="drafts" className="flex-1">Drafts</TabsTrigger>
                <TabsTrigger value="archive" className="flex-1">Archive</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="p-4">
                <EnhancedNewsArticleList 
                  onEdit={handleEditArticle}
                  onCreateNew={handleCreateNew}
                />
              </TabsContent>
              <TabsContent value="drafts" className="p-4">
                <NewsArticleDrafts />
              </TabsContent>
              <TabsContent value="archive" className="p-4">
                <NewsArticleArchive />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewsManagement;
