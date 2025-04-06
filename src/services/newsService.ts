
// Compatibility layer for existing code that may be importing from this file
import { 
  fetchNewsArticles,
  getNewsCategories,
  toggleArticleFeatured 
} from './news/db/listing';

export {
  fetchNewsArticles,
  getNewsCategories,
  toggleArticleFeatured
};

// Legacy alias for backward compatibility
export const getNewsArticles = fetchNewsArticles;
