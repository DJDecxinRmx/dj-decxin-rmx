
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE

-- GALLERY
DROP POLICY IF EXISTS "Admin can delete gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin can insert gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin can update gallery" ON public.gallery;
DROP POLICY IF EXISTS "Anyone can read gallery" ON public.gallery;

CREATE POLICY "Anyone can read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admin can insert gallery" ON public.gallery FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update gallery" ON public.gallery FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete gallery" ON public.gallery FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- LINKS
DROP POLICY IF EXISTS "Admin can delete links" ON public.links;
DROP POLICY IF EXISTS "Admin can insert links" ON public.links;
DROP POLICY IF EXISTS "Admin can update links" ON public.links;
DROP POLICY IF EXISTS "Anyone can read links" ON public.links;

CREATE POLICY "Anyone can read links" ON public.links FOR SELECT USING (true);
CREATE POLICY "Admin can insert links" ON public.links FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update links" ON public.links FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete links" ON public.links FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- POSTS
DROP POLICY IF EXISTS "Admin can delete posts" ON public.posts;
DROP POLICY IF EXISTS "Admin can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Admin can update posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can read posts" ON public.posts;

CREATE POLICY "Anyone can read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Admin can insert posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update posts" ON public.posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete posts" ON public.posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- SITE_SETTINGS
DROP POLICY IF EXISTS "Admin can delete site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;

CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete site settings" ON public.site_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- USER_ROLES
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
