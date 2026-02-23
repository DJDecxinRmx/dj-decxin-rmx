-- Add optional image_url to links table
ALTER TABLE public.links ADD COLUMN image_url TEXT DEFAULT NULL;