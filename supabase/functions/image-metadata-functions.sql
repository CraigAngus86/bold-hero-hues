
-- Create a function to store image metadata
CREATE OR REPLACE FUNCTION public.store_image_metadata(
  bucket_id TEXT,
  storage_path TEXT,
  file_name TEXT,
  alt_text TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  tags TEXT[] DEFAULT NULL,
  dimensions JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.image_metadata (bucket_id, storage_path, file_name, alt_text, description, tags, dimensions)
  VALUES (bucket_id, storage_path, file_name, alt_text, description, tags, dimensions)
  ON CONFLICT (bucket_id, storage_path) 
  DO UPDATE SET
    alt_text = EXCLUDED.alt_text,
    description = EXCLUDED.description,
    tags = EXCLUDED.tags,
    dimensions = EXCLUDED.dimensions,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get image metadata
CREATE OR REPLACE FUNCTION public.get_image_metadata(
  p_bucket_id TEXT,
  p_storage_path TEXT
) RETURNS SETOF public.image_metadata AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.image_metadata
  WHERE bucket_id = p_bucket_id AND storage_path = p_storage_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to update image metadata
CREATE OR REPLACE FUNCTION public.update_image_metadata(
  p_bucket_id TEXT,
  p_storage_path TEXT,
  p_alt_text TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  UPDATE public.image_metadata
  SET 
    alt_text = COALESCE(p_alt_text, alt_text),
    description = COALESCE(p_description, description),
    tags = COALESCE(p_tags, tags),
    updated_at = now()
  WHERE bucket_id = p_bucket_id AND storage_path = p_storage_path;
  
  success := FOUND;
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to delete image metadata
CREATE OR REPLACE FUNCTION public.delete_image_metadata(
  p_bucket_id TEXT,
  p_storage_path TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  DELETE FROM public.image_metadata
  WHERE bucket_id = p_bucket_id AND storage_path = p_storage_path;
  
  success := FOUND;
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to move image metadata
CREATE OR REPLACE FUNCTION public.move_image_metadata(
  p_source_bucket_id TEXT,
  p_source_path TEXT,
  p_dest_bucket_id TEXT,
  p_dest_path TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  UPDATE public.image_metadata
  SET 
    bucket_id = p_dest_bucket_id,
    storage_path = p_dest_path,
    updated_at = now()
  WHERE bucket_id = p_source_bucket_id AND storage_path = p_source_path;
  
  success := FOUND;
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
