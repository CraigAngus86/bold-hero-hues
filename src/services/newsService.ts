
// Compatibility layer for existing code that may be importing from this file
import { 
  fetchNewsArticles,
  getNewsCategories,
  toggleArticleFeatured,
  deleteNewsArticle,
  createNewsArticle,
  updateNewsArticle,
  getNewsArticleById,
  getNewsArticleBySlug
} from './news';

export {
  fetchNewsArticles,
  getNewsCategories,
  toggleArticleFeatured,
  deleteNewsArticle,
  createNewsArticle,
  updateNewsArticle,
  getNewsArticleById,
  getNewsArticleBySlug
};

// Legacy alias for backward compatibility
export const getNewsArticles = fetchNewsArticles;
