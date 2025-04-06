
// Compatibility layer for existing code that may be importing from this file
import { 
  fetchNewsArticles,
  getNewsCategories,
  toggleArticleFeatured,
  deleteNewsArticle 
} from './news/db/listing';

export {
  fetchNewsArticles,
  getNewsCategories,
  toggleArticleFeatured,
  deleteNewsArticle
};

// Legacy alias for backward compatibility
export const getNewsArticles = fetchNewsArticles;
