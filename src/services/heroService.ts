
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface HeroSlide {
  id: string;
  image_url: string;
  video_url?: string;
  title: string;
  subtitle?: string;
  link_text?: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
}

/**
 * Get all active hero slides ordered by display_order
 */
export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    
    return data as HeroSlide[];
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
}

/**
 * Create a new hero slide
 */
export async function createHeroSlide(slide: Omit<HeroSlide, 'id'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('hero_slides')
      .insert([slide]);
    
    if (error) throw error;
    
    toast.success('Hero slide created successfully');
    return true;
  } catch (error) {
    console.error('Error creating hero slide:', error);
    toast.error('Failed to create hero slide');
    return false;
  }
}

/**
 * Update an existing hero slide
 */
export async function updateHeroSlide(id: string, slide: Partial<HeroSlide>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('hero_slides')
      .update(slide)
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Hero slide updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating hero slide:', error);
    toast.error('Failed to update hero slide');
    return false;
  }
}

/**
 * Delete a hero slide
 */
export async function deleteHeroSlide(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Hero slide deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    toast.error('Failed to delete hero slide');
    return false;
  }
}
