
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { EnhancedNewsArticleList } from '@/components/admin/news/EnhancedNewsArticleList';
import { EnhancedNewsArticleEditor } from '@/components/admin/news/EnhancedNewsArticleEditor';
import { EnhancedCategoryManagement } from '@/components/admin/news/EnhancedCategoryManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Newspaper, Tag, Edit } from 'lucide-react';
import { Typography } from '@/components/ui';
import { useNewsCategories } from '@/hooks/useNewsCategories';
import { NewsArticle } from '@/types';
import { Helmet } from 'react-helmet-async';

const { H2 } = Typography;

const NewsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const { categories, isLoading: categoriesLoading } = useNewsCategories();

  const handleCreateNew = () => {
    setEditingArticle(null);
    setActiveTab('editor');
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setActiveTab('editor');
  };

  const handleSaveComplete = () => {
    setEditingArticle(null);
    setActiveTab('list');
  };

  const categoryNames = categories ? categories.map(category => category.name) : [];

  return (
    <AdminLayout>
      <Helmet>
        <title>News Management - Banks o' Dee FC Admin</title>
      </Helmet>
      <div className="flex items-center justify-between mb-6">
        <H2>News Management</H2>
        {activeTab !== 'editor' && (
          <Button onClick={handleCreateNew} className="flex items-center gap-1">
            <PlusCircle size={18} /> New Article
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Newspaper size={16} />
            Articles
          </TabsTrigger>
          <TabsTrigger value="editor" disabled={activeTab !== 'editor'} className="flex items-center gap-2">
            <Edit size={16} />
            {editingArticle ? 'Edit Article' : 'New Article'}
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag size={16} />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <EnhancedNewsArticleList onEditArticle={handleEditArticle} />
        </TabsContent>

        <TabsContent value="editor">
          <EnhancedNewsArticleEditor
            article={editingArticle}
            categories={categoryNames}
            onSaveComplete={handleSaveComplete}
            isLoadingCategories={categoriesLoading}
          />
        </TabsContent>

        <TabsContent value="categories">
          <EnhancedCategoryManagement />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default NewsManagement;
