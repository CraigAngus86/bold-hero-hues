import React, { useState } from 'react';
import { NewsItem } from '@/types/news';

interface NewsManagerProps {
  initialNews?: NewsItem[];
}

const NewsManager: React.FC<NewsManagerProps> = ({ initialNews = [] }) => {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const handleSelectNews = (id: string) => {
    const selected = news.find(item => item.id === id);
    if (selected) {
      setSelectedNews(selected);
    }
  };

  const handleCreateNews = (newsItem: NewsItem) => {
    setNews([...news, newsItem]);
  };

  const handleUpdateNews = (updatedNews: NewsItem) => {
    setNews(news.map(item => item.id === updatedNews.id ? updatedNews : item));
    setSelectedNews(null);
  };

  const handleDeleteNews = (id: string) => {
    setNews(news.filter(item => item.id !== id));
    if (selectedNews && selectedNews.id === id) {
      setSelectedNews(null);
    }
  };

  return (
    <div>
      <h2>News Manager</h2>
      {/* This is a placeholder component - implementation will be expanded later */}
      <div>
        <button onClick={() => setSelectedNews({
          id: `new-${Date.now()}`,
          title: '',
          content: '',
          excerpt: '',
          image_url: '',
          publish_date: new Date().toISOString(),
          category: '',
          is_featured: false,
          slug: ''
        })}>
          Create New Article
        </button>
      </div>
      <div>
        {news.length === 0 ? (
          <p>No news articles available.</p>
        ) : (
          <ul>
            {news.map(item => (
              <li key={item.id}>
                {item.title}
                <button onClick={() => handleSelectNews(item.id)}>Edit</button>
                <button onClick={() => handleDeleteNews(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NewsManager;
