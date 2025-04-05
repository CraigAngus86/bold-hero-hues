
import { supabase } from '@/services/supabase/supabaseClient';

/**
 * Check if a slug is already in use
 */
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from('news_articles')
      .select('id')
      .eq('slug', slug) as any;
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.length === 0;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return false;
  }
}

/**
 * Generate a unique slug based on a title
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  // Basic slug generation
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  if (!baseSlug) {
    baseSlug = 'article';
  }
  
  // Check if the slug is available
  let slug = baseSlug;
  let counter = 1;
  
  while (!(await isSlugAvailable(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}
