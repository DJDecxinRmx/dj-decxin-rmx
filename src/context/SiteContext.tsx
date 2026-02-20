import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import profileImg from "@/assets/dj-profile.jpg";
import heroImg from "@/assets/hero-dj.jpg";

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  description?: string;
  link?: string;
}

export interface TextPost {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
}

export interface ProfileData {
  name: string;
  tagline: string;
  profileImage: string;
  bannerImage: string;
}

interface SiteData {
  profile: ProfileData;
  links: LinkItem[];
  gallery: GalleryImage[];
  posts: TextPost[];
}

interface SiteContextType {
  data: SiteData;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (profile: ProfileData) => Promise<void>;
  addLink: (link: Omit<LinkItem, "id">) => Promise<void>;
  removeLink: (id: string) => Promise<void>;
  addGalleryImage: (src: string, alt: string, description?: string, link?: string) => Promise<void>;
  removeGalleryImage: (id: string) => Promise<void>;
  addPost: (content: string, image?: string) => Promise<void>;
  removePost: (id: string) => Promise<void>;
}

const defaultProfile: ProfileData = {
  name: "DJ DECXIN RMX",
  tagline: "Beats que mueven tu alma 🎧",
  profileImage: profileImg,
  bannerImage: heroImg,
};

const defaultLinks: LinkItem[] = [
  { id: "1", title: "🎵 Mi Último Mix", url: "#", description: "Escucha mi sesión más reciente" },
  { id: "2", title: "📺 YouTube", url: "#", description: "Videos y sets en vivo" },
  { id: "3", title: "📸 Instagram", url: "#", description: "@djdecxinrmx" },
  { id: "4", title: "🎧 SoundCloud", url: "#", description: "Todos mis tracks y remixes" },
  { id: "5", title: "💬 WhatsApp", url: "#", description: "Contrataciones y contacto" },
];

const defaultGallery: GalleryImage[] = [
  { id: "g1", src: gallery1, alt: "DJ Decxin en vivo" },
  { id: "g2", src: gallery2, alt: "DJ Decxin - Setup" },
  { id: "g3", src: gallery3, alt: "DJ Decxin - Festival" },
];

const SiteContext = createContext<SiteContextType | null>(null);

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be inside SiteProvider");
  return ctx;
};

export const SiteProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SiteData>({
    profile: defaultProfile,
    links: defaultLinks,
    gallery: defaultGallery,
    posts: [],
  });

  // Realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("site-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery" }, () => loadGallery())
      .on("postgres_changes", { event: "*", schema: "public", table: "links" }, () => loadLinks())
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => loadPosts())
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => loadProfile())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", currentUser.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(!!roleData);
      } else {
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load all data from DB
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadProfile(), loadLinks(), loadGallery(), loadPosts()]);
    setLoading(false);
  };

  const loadProfile = async () => {
    const { data: rows } = await supabase.from("site_settings").select("*").eq("key", "profile").maybeSingle();
    if (rows?.value) {
      setData((d) => ({ ...d, profile: rows.value as unknown as ProfileData }));
    }
  };

  const loadLinks = async () => {
    const { data: rows } = await supabase.from("links").select("*").order("sort_order");
    if (rows && rows.length > 0) {
      setData((d) => ({
        ...d,
        links: rows.map((r) => ({ id: r.id, title: r.title, url: r.url, description: r.description || "" })),
      }));
    }
  };

  const loadGallery = async () => {
    const { data: rows } = await supabase.from("gallery").select("*").order("sort_order");
    if (rows && rows.length > 0) {
      setData((d) => ({
        ...d,
        gallery: rows.map((r) => ({ id: r.id, src: r.image_url, alt: r.alt || "", description: r.description || undefined, link: r.link || undefined })),
      }));
    }
  };

  const loadPosts = async () => {
    const { data: rows } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (rows && rows.length > 0) {
      setData((d) => ({
        ...d,
        posts: rows.map((r) => ({ id: r.id, content: r.content, image: r.image_url || undefined, createdAt: r.created_at })),
      }));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUser(null);
  };

  const updateProfile = async (profile: ProfileData) => {
    const profileValue = profile as unknown as import("@/integrations/supabase/types").Json;
    const { error } = await supabase.from("site_settings").upsert(
      { key: "profile", value: profileValue, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    if (!error) setData((d) => ({ ...d, profile }));
  };

  const addLink = async (link: Omit<LinkItem, "id">) => {
    const { data: row, error } = await supabase.from("links").insert({ title: link.title, url: link.url, description: link.description, sort_order: data.links.length }).select().single();
    if (!error && row) {
      setData((d) => ({
        ...d,
        links: [...d.links, { id: row.id, title: row.title, url: row.url, description: row.description || "" }],
      }));
    }
  };

  const removeLink = async (id: string) => {
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (!error) setData((d) => ({ ...d, links: d.links.filter((l) => l.id !== id) }));
  };

  const addGalleryImage = async (src: string, alt: string, description?: string, link?: string) => {
    const { data: row, error } = await supabase.from("gallery").insert({ image_url: src, alt, description, link, sort_order: data.gallery.length }).select().single();
    if (!error && row) {
      setData((d) => ({
        ...d,
        gallery: [...d.gallery, { id: row.id, src: row.image_url, alt: row.alt || "", description: row.description || undefined, link: row.link || undefined }],
      }));
    }
  };

  const removeGalleryImage = async (id: string) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (!error) setData((d) => ({ ...d, gallery: d.gallery.filter((g) => g.id !== id) }));
  };

  const addPost = async (content: string, image?: string) => {
    const { data: row, error } = await supabase.from("posts").insert({ content, image_url: image || null }).select().single();
    if (!error && row) {
      setData((d) => ({
        ...d,
        posts: [{ id: row.id, content: row.content, image: row.image_url || undefined, createdAt: row.created_at }, ...d.posts],
      }));
    }
  };

  const removePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) setData((d) => ({ ...d, posts: d.posts.filter((p) => p.id !== id) }));
  };

  return (
    <SiteContext.Provider value={{
      data, isAdmin, user, loading,
      signOut, updateProfile, addLink, removeLink,
      addGalleryImage, removeGalleryImage, addPost, removePost,
    }}>
      {children}
    </SiteContext.Provider>
  );
};
