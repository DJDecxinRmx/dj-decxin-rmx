
-- Comments table
CREATE TABLE public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL DEFAULT 'Anónimo',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON public.post_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can delete comments" ON public.post_comments FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Ratings table
CREATE TABLE public.post_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  visitor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, visitor_id)
);

ALTER TABLE public.post_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ratings" ON public.post_ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ratings" ON public.post_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update own rating" ON public.post_ratings FOR UPDATE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_ratings;
