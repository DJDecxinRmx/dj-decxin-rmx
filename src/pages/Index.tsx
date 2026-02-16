import HeroSection from "@/components/HeroSection";
import LinksSection from "@/components/LinksSection";
import GallerySection from "@/components/GallerySection";
import PostsSection from "@/components/PostsSection";
import AdminPanel from "@/components/AdminPanel";
import { SiteProvider } from "@/context/SiteContext";

const Index = () => {
  return (
    <SiteProvider>
      <div className="min-h-screen bg-background">
        <HeroSection />
        <LinksSection />
        <PostsSection />
        <GallerySection />
        <footer className="text-center py-8 text-muted-foreground text-xs font-display tracking-widest">
          © 2026 DJ DECXIN RMX
        </footer>
        <AdminPanel />
      </div>
    </SiteProvider>
  );
};

export default Index;
