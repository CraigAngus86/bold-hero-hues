
import { supabase } from '@/lib/supabase';
import { 
  NewsArticle, 
  NewsQueryOptions,
  CreateNewsArticleData,
  UpdateNewsArticleData 
} from '@/types/news';

// Generate a URL-friendly slug from a string
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const getNewsArticles = async (options?: NewsQueryOptions) => {
  try {
    let query = supabase
      .from('news_articles')
      .select('*');

    // Apply filters if provided
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    
    if (options?.featured !== undefined) {
      query = query.eq('is_featured', options.featured);
    }
    
    if (options?.searchTerm) {
      query = query.or(`title.ilike.%${options.searchTerm}%,content.ilike.%${options.searchTerm}%`);
    }

    // Apply sorting
    const orderBy = options?.orderBy || 'publish_date';
    const orderDirection = options?.orderDirection || 'desc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });

    // Apply pagination
    if (options?.page !== undefined && options?.limit !== undefined) {
      const from = (options.page - 1) * options.limit;
      const to = from + options.limit - 1;
      query = query.range(from, to);
    }

    // Get count for pagination
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return { 
      success: true, 
      data: data as NewsArticle[],
      count
    };
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return { 
      success: false, 
      error: 'Failed to fetch news articles' 
    };
  }
};

export const getNewsArticleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { 
      success: true, 
      data: data as NewsArticle 
    };
  } catch (error) {
    console.error(`Error fetching news article with id ${id}:`, error);
    return { 
      success: false, 
      error: 'Failed to fetch news article' 
    };
  }
};

export const getNewsArticleBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      throw error;
    }

    return { 
      success: true, 
      data: data as NewsArticle 
    };
  } catch (error) {
    console.error(`Error fetching news article with slug ${slug}:`, error);
    return { 
      success: false, 
      error: 'Failed to fetch news article' 
    };
  }
};

export const createNewsArticle = async (articleData: CreateNewsArticleData) => {
  try {
    // Generate slug if not provided
    const slug = articleData.slug || generateSlug(articleData.title);
    
    const { data, error } = await supabase
      .from('news_articles')
      .insert([{ ...articleData, slug }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { 
      success: true, 
      data: data as NewsArticle,
      message: 'News article created successfully'
    };
  } catch (error) {
    console.error('Error creating news article:', error);
    return { 
      success: false, 
      error: 'Failed to create news article' 
    };
  }
};

export const updateNewsArticle = async (id: string, articleData: UpdateNewsArticleData) => {
  try {
    // Update slug if title changed and slug not explicitly set
    if (articleData.title && !articleData.slug) {
      articleData.slug = generateSlug(articleData.title);
    }
    
    const { data, error } = await supabase
      .from('news_articles')
      .update(articleData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { 
      success: true, 
      data: data as NewsArticle,
      message: 'News article updated successfully'
    };
  } catch (error) {
    console.error(`Error updating news article with id ${id}:`, error);
    return { 
      success: false, 
      error: 'Failed to update news article' 
    };
  }
};

export const deleteNewsArticle = async (id: string) => {
  try {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { 
      success: true,
      message: 'News article deleted successfully'
    };
  } catch (error) {
    console.error(`Error deleting news article with id ${id}:`, error);
    return { 
      success: false, 
      error: 'Failed to delete news article' 
    };
  }
};

export const getNewsCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('category')
      .order('category');

    if (error) {
      throw error;
    }

    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching news categories:', error);
    return [];
  }
};
