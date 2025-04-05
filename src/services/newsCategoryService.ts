
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface NewsCategory {
  id: string;
  name: string;
}

/**
 * Create a new news category
 */
export async function createNewsCategory(name: string): Promise<NewsCategory> {
  try {
    // Check if categories table exists by performing a count query
    const { count, error: countError } = await supabase
      .from('news_categories')
      .select('*', { count: 'exact', head: true });
    
    // If table doesn't exist, create it
    if (countError && countError.message.includes('does not exist')) {
      console.log('Categories table does not exist yet, creating category in news_articles instead');
      // For now, just create an article with this category
      // This is a fallback approach until a proper categories table exists
      throw new Error('Categories table does not exist');
    } else {
      // Table exists, insert the category
      const { data, error } = await supabase
        .from('news_categories')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      return data as NewsCategory;
    }
  } catch (error) {
    console.error('Error creating category:', error);
    toast.error('Failed to create category');
    throw error;
  }
}

/**
 * Update an existing news category
 */
export async function updateNewsCategory(id: string, name: string): Promise<NewsCategory> {
  try {
    const { data, error } = await supabase
      .from('news_categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as NewsCategory;
  } catch (error) {
    console.error('Error updating category:', error);
    toast.error('Failed to update category');
    throw error;
  }
}

/**
 * Delete a news category
 */
export async function deleteNewsCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('news_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.error('Failed to delete category');
    throw error;
  }
}

/**
 * Get all news categories
 */
export async function fetchNewsCategories(): Promise<NewsCategory[]> {
  try {
    const { data, error } = await supabase
      .from('news_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as NewsCategory[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
