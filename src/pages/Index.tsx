import HeroSection from "@/components/HeroSection";
import LinksSection from "@/components/LinksSection";
import GallerySection from "@/components/GallerySection";
import PostsSection from "@/components/PostsSection";
import AdminPanel from "@/components/AdminPanel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ParticlesBackground from "@/components/ParticlesBackground";
import LiveClock from "@/components/LiveClock";
import { SiteProvider } from "@/context/SiteContext";

const SectionDivider = () => <div className="section-divider max-w-xs mx-auto my-2" />;

const Index = () => {
  return (
    <SiteProvider>
      <div className="min-h-screen bg-background relative">
        <ParticlesBackground />
        <Navbar />
        <HeroSection />
        <LiveClock />
        <SectionDivider />
        <LinksSection />
        <SectionDivider />
        <PostsSection />
        <SectionDivider />
        <GallerySection />
        <Footer />
        <AdminPanel />
        <ScrollToTop />
      </div>
    </SiteProvider>
  );
};

export default Index;
