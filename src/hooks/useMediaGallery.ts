
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ImageMetadata } from '@/types/media';

export interface MediaGalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  created_at: string;
  is_featured?: boolean;
  media_type: 'image' | 'video';
}

export interface MediaGalleryData {
  items: MediaGalleryItem[];
  isLoading: boolean;
  error: Error | null;
}

export const useMediaGallery = (limit = 10, featuredOnly = false): MediaGalleryData => {
  const [items, setItems] = useState<MediaGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // As a fallback, we'll use the image_metadata table and transform its data
        let query = supabase
          .from('image_metadata')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (featuredOnly) {
          // If we had a 'is_featured' field in the database, we would filter by it here
          // For now, we'll just take the most recent items
          query = query.limit(limit);
        } else {
          query = query.limit(limit);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        // Transform the data from image_metadata to our MediaGalleryItem format
        const transformedData: MediaGalleryItem[] = (data || []).map((item: any) => {
          // Determine media type from file extension or content type
          const isVideo = 
            (item.storage_path && /\.(mp4|webm|ogg)$/i.test(item.storage_path)) ||
            (item.content_type && item.content_type.startsWith('video/'));
            
          return {
            id: item.id,
            title: item.alt_text || item.file_name || 'Untitled',
            description: item.description || '',
            image_url: `https://bbbxhwaixjjxgboeiktq.supabase.co/storage/v1/object/public/${item.bucket_id}/${item.storage_path}`,
            thumbnail_url: `https://bbbxhwaixjjxgboeiktq.supabase.co/storage/v1/object/public/${item.bucket_id}/${item.storage_path}`,
            created_at: item.created_at,
            is_featured: false, // Default as we don't have this field yet
            media_type: isVideo ? 'video' : 'image'
          };
        });
        
        setItems(transformedData);
      } catch (err) {
        console.error('Error fetching media gallery items:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch media gallery items'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedia();
  }, [limit, featuredOnly]);
  
  return {
    items,
    isLoading,
    error
  };
};
