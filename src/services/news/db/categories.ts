
import { supabase } from '@/services/supabase/supabaseClient';
import { showErrorToUser, createAppError, ErrorType } from '@/utils/errorHandling';

/**
 * Fetch all news categories
 */
export async function getCategories(): Promise<string[]> {
  try {
    // Query the dedicated categories table
    const { data: categoryData, error: categoryError } = await supabase
      .from('news_categories')
      .select('name')
      .order('name');
        
    if (!categoryError && categoryData) {
      return categoryData.map(cat => cat.name);
    }
    
    // Fallback to distinct values from news_articles if needed
    const { data, error } = await supabase
      .from('news_articles')
      .select('category')
      .order('category');

    if (error) throw error;
    
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching news categories:', error);
    showErrorToUser(error, 'Failed to load news categories');
    return [];
  }
}

/**
 * Create a new category
 */
export async function createCategory(name: string): Promise<{ success: boolean; id?: string; error?: Error }> {
  try {
    const { data, error } = await supabase
      .from('news_categories')
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('Error creating category:', error);
    showErrorToUser(error, 'Failed to create category');
    return { success: false, error: error as Error };
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(id: string, name: string): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase
      .from('news_categories')
      .update({ name })
      .eq('id', id);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating category:', error);
    showErrorToUser(error, 'Failed to update category');
    return { success: false, error: error as Error };
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase
      .from('news_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    showErrorToUser(error, 'Failed to delete category');
    return { success: false, error: error as Error };
  }
}
