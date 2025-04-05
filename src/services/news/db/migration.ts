
import { supabase } from '@/services/supabase/supabaseClient';

/**
 * Safely migrate existing news data to the database
 */
export async function migrateExistingNewsData(newsItems: any[]): Promise<{ success: boolean; message: string }> {
  try {
    // First check if there are any articles already in the database
    const { count } = await (supabase.from('news_articles').select('*', { count: 'exact', head: true }) as any);
    
    if (count && count > 0) {
      return { 
        success: false, 
        message: `Migration skipped. There are already ${count} articles in the database.`
      };
    }
    
    // Transform the data to match our schema
    const articlesData = newsItems.map(item => ({
      title: item.title,
      content: item.excerpt || 'No content provided',
      image_url: item.image,
      publish_date: item.date,
      category: item.category || 'General',
      is_featured: false,
      slug: item.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-'),
    }));
    
    // Insert data
    const { error } = await (supabase.from('news_articles').insert(articlesData as any) as any);
    
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      message: `Successfully migrated ${articlesData.length} news articles to the database.`
    };
  } catch (error) {
    console.error('Error migrating news data:', error);
    return { 
      success: false, 
      message: `Failed to migrate news data: ${(error as Error).message}`
    };
  }
}
