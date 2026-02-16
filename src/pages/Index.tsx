import HeroSection from "@/components/HeroSection";
import LinksSection from "@/components/LinksSection";
import GallerySection from "@/components/GallerySection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <LinksSection />
      <GallerySection />
      <footer className="text-center py-8 text-muted-foreground text-xs font-display tracking-widest">
        © 2026 DJ DECXIN RMX
      </footer>
    </div>
  );
};

export default Index;
