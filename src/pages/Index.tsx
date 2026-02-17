import HeroSection from "@/components/HeroSection";
import LinksSection from "@/components/LinksSection";
import GallerySection from "@/components/GallerySection";
import PostsSection from "@/components/PostsSection";
import AdminPanel from "@/components/AdminPanel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { SiteProvider } from "@/context/SiteContext";

const Index = () => {
  return (
    <SiteProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <LinksSection />
        <PostsSection />
        <GallerySection />
        <Footer />
        <AdminPanel />
        <ScrollToTop />
      </div>
    </SiteProvider>
  );
};

export default Index;
