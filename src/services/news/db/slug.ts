
import { supabase } from '@/integrations/supabase/client';

/**
 * Convert a string to a URL-friendly slug
 */
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/&/g, '-and-')   // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
};

/**
 * Check if a slug already exists in the database
 */
const isSlugUnique = async (slug: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('news_articles')
    .select('slug')
    .eq('slug', slug)
    .limit(1);
  
  if (error) {
    console.error('Error checking slug uniqueness:', error);
    return false;
  }
  
  return data.length === 0;
};

/**
 * Generate a unique slug based on the title
 */
export const generateSlug = async (title: string): Promise<string> => {
  let slug = slugify(title);
  let isUnique = await isSlugUnique(slug);
  let counter = 1;
  
  // If the slug already exists, append a number and check again
  while (!isUnique) {
    const newSlug = `${slug}-${counter}`;
    isUnique = await isSlugUnique(newSlug);
    
    if (isUnique) {
      slug = newSlug;
    } else {
      counter++;
      
      // Safety exit if we somehow get into a loop
      if (counter > 100) {
        throw new Error('Unable to generate a unique slug after 100 attempts');
      }
    }
  }
  
  return slug;
};
