
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import EnhancedNewsArticleList from '@/components/admin/news/EnhancedNewsArticleList';
import EnhancedNewsArticleEditor from '@/components/admin/news/EnhancedNewsArticleEditor';
import { NewsArticle } from '@/types';

const NewsManagement = () => {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | undefined>(undefined);
  
  const handleCreateNew = () => {
    setSelectedArticle(undefined);
    setMode('create');
  };
  
  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(article);
    setMode('edit');
  };
  
  const handleBack = () => {
    setMode('list');
    setSelectedArticle(undefined);
  };
  
  const handleSaved = () => {
    setMode('list');
  };

  const renderContent = () => {
    switch (mode) {
      case 'create':
      case 'edit':
        return (
          <EnhancedNewsArticleEditor 
            article={selectedArticle} 
            onBack={handleBack}
            onSaved={handleSaved}
          />
        );
      case 'list':
      default:
        return (
          <EnhancedNewsArticleList 
            onCreateNew={handleCreateNew} 
            onEdit={handleEdit}
          />
        );
    }
  };

  return (
    <AdminLayout>
      <AdminPageLayout
        title="News Management"
        description={mode === 'list' 
          ? 'Create, edit, and manage news articles for your website.' 
          : mode === 'create'
            ? 'Create a new news article'
            : 'Edit news article'
        }
      >
        {renderContent()}
      </AdminPageLayout>
    </AdminLayout>
  );
};

export default NewsManagement;
