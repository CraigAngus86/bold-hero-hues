
import { NewsItem, NewsQueryOptions, CreateNewsArticleData, UpdateNewsArticleData } from '@/types/news';
import { newsArticles } from './mockData';

// Format date in a human-readable format
export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Fetch all news articles with optional filtering
export const getNewsArticles = async (options: NewsQueryOptions = {}): Promise<{
  data: NewsItem[];
  count: number;
}> => {
  // In a real app, this would call an API endpoint
  // For now, we'll use mock data and implement filtering/pagination here
  
  const { category, featured, search, orderBy, page = 1, pageSize = 10 } = options;
  
  // Filter the news articles based on the options
  let filtered = [...newsArticles];
  
  if (category) {
    filtered = filtered.filter(article => article.category === category);
  }
  
  if (featured !== undefined) {
    filtered = filtered.filter(article => article.is_featured === featured);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(searchLower) || 
      article.content.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort the articles
  if (orderBy === 'newest') {
    filtered.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
  } else if (orderBy === 'oldest') {
    filtered.sort((a, b) => new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime());
  }
  
  // Calculate the total count before pagination
  const count = filtered.length;
  
  // Apply pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filtered.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    count
  };
};

// Get a specific news article by ID
export const getNewsArticleById = async (id: string): Promise<NewsItem | null> => {
  // In a real app, this would call an API endpoint
  const article = newsArticles.find(item => item.id === id);
  return article || null;
};

// Get a specific news article by slug
export const getNewsArticleBySlug = async (slug: string): Promise<NewsItem | null> => {
  // In a real app, this would call an API endpoint
  const article = newsArticles.find(item => item.slug === slug);
  return article || null;
};

// Create a new news article
export const createNewsArticle = async (data: CreateNewsArticleData): Promise<NewsItem> => {
  // In a real app, this would call an API endpoint to create the article
  const newArticle: NewsItem = {
    id: Date.now().toString(),
    ...data,
    content: data.content,
    publish_date: data.publish_date || new Date().toISOString(),
    is_featured: data.is_featured || false
  };
  
  // This is just for the mock implementation
  // In a real app, this would be handled server-side
  // newsArticles.push(newArticle);
  
  return newArticle;
};

// Update an existing news article
export const updateNewsArticle = async (id: string, data: UpdateNewsArticleData): Promise<NewsItem | null> => {
  // In a real app, this would call an API endpoint
  const index = newsArticles.findIndex(article => article.id === id);
  if (index === -1) return null;
  
  const updatedArticle = {
    ...newsArticles[index],
    ...data
  };
  
  // This is just for the mock implementation
  // In a real app, this would be handled server-side
  // newsArticles[index] = updatedArticle;
  
  return updatedArticle;
};

// Delete a news article
export const deleteNewsArticle = async (id: string): Promise<boolean> => {
  // In a real app, this would call an API endpoint
  const index = newsArticles.findIndex(article => article.id === id);
  if (index === -1) return false;
  
  // This is just for the mock implementation
  // In a real app, this would be handled server-side
  // newsArticles.splice(index, 1);
  
  return true;
};

// Get news categories
export const getNewsCategories = async (): Promise<string[]> => {
  // In a real app, this would call an API endpoint
  // For now, extract unique categories from the mock data
  const categories = new Set(newsArticles.map(article => article.category));
  return Array.from(categories);
};

// Get featured news
export const getFeaturedNews = async (): Promise<NewsItem[]> => {
  // In a real app, this would call an API endpoint
  return newsArticles.filter(article => article.is_featured);
};
