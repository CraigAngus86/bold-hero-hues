
// Reexport all news-related services for convenient imports
import {
  fetchNewsArticles,
  getNewsCategories,
  toggleArticleFeatured,
  deleteNewsArticle
} from './db/listing';

import {
  createNewsArticle,
  updateNewsArticle,
  getNewsArticleById,
  getNewsArticleBySlug
} from './db/article';

export {
  // From listing
  fetchNewsArticles,
  getNewsCategories,
  toggleArticleFeatured,
  deleteNewsArticle,
  
  // From article
  createNewsArticle,
  updateNewsArticle,
  getNewsArticleById,
  getNewsArticleBySlug
};

// Legacy alias for backward compatibility
export const getArticles = fetchNewsArticles;
export const getNewsArticles = fetchNewsArticles;
