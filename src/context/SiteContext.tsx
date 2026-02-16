import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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
}

export interface TextPost {
  id: string;
  content: string;
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
  toggleAdmin: () => void;
  updateProfile: (profile: ProfileData) => void;
  addLink: (link: Omit<LinkItem, "id">) => void;
  removeLink: (id: string) => void;
  updateLink: (id: string, link: Partial<LinkItem>) => void;
  addGalleryImage: (src: string, alt: string) => void;
  removeGalleryImage: (id: string) => void;
  addPost: (content: string) => void;
  removePost: (id: string) => void;
}

const defaultData: SiteData = {
  profile: {
    name: "DJ DECXIN RMX",
    tagline: "Beats que mueven tu alma 🎧",
    profileImage: profileImg,
    bannerImage: heroImg,
  },
  links: [
    { id: "1", title: "🎵 Mi Último Mix", url: "#", description: "Escucha mi sesión más reciente" },
    { id: "2", title: "📺 YouTube", url: "#", description: "Videos y sets en vivo" },
    { id: "3", title: "📸 Instagram", url: "#", description: "@djdecxinrmx" },
    { id: "4", title: "🎧 SoundCloud", url: "#", description: "Todos mis tracks y remixes" },
    { id: "5", title: "💬 WhatsApp", url: "#", description: "Contrataciones y contacto" },
  ],
  gallery: [
    { id: "g1", src: gallery1, alt: "DJ Decxin en vivo" },
    { id: "g2", src: gallery2, alt: "DJ Decxin - Setup" },
    { id: "g3", src: gallery3, alt: "DJ Decxin - Festival" },
  ],
  posts: [],
};

const SiteContext = createContext<SiteContextType | null>(null);

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be inside SiteProvider");
  return ctx;
};

const STORAGE_KEY = "dj-decxin-site-data";

const loadData = (): SiteData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultData;
};

export const SiteProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SiteData>(loadData);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const toggleAdmin = () => setIsAdmin((v) => !v);

  const updateProfile = (profile: ProfileData) =>
    setData((d) => ({ ...d, profile }));

  const addLink = (link: Omit<LinkItem, "id">) =>
    setData((d) => ({ ...d, links: [...d.links, { ...link, id: crypto.randomUUID() }] }));

  const removeLink = (id: string) =>
    setData((d) => ({ ...d, links: d.links.filter((l) => l.id !== id) }));

  const updateLink = (id: string, updates: Partial<LinkItem>) =>
    setData((d) => ({
      ...d,
      links: d.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));

  const addGalleryImage = (src: string, alt: string) =>
    setData((d) => ({
      ...d,
      gallery: [...d.gallery, { id: crypto.randomUUID(), src, alt }],
    }));

  const removeGalleryImage = (id: string) =>
    setData((d) => ({ ...d, gallery: d.gallery.filter((g) => g.id !== id) }));

  const addPost = (content: string) =>
    setData((d) => ({
      ...d,
      posts: [{ id: crypto.randomUUID(), content, createdAt: new Date().toISOString() }, ...d.posts],
    }));

  const removePost = (id: string) =>
    setData((d) => ({ ...d, posts: d.posts.filter((p) => p.id !== id) }));

  return (
    <SiteContext.Provider
      value={{
        data, isAdmin, toggleAdmin,
        updateProfile, addLink, removeLink, updateLink,
        addGalleryImage, removeGalleryImage, addPost, removePost,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
