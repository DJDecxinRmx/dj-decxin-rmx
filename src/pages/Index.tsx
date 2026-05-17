import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>DJ Decxin Remix | Sets, Remixes y Música Electrónica</title>
        <meta name="description" content="Sitio oficial de DJ Decxin Rmx. Escucha sets en vivo, remixes y sesiones de música electrónica. Contrátalo para tus eventos." />
        <link rel="canonical" href="https://dj-decxin-rmx.lovable.app/" />
        <meta property="og:title" content="DJ Decxin Remix | Sitio Oficial" />
        <meta property="og:description" content="Beats que mueven tu alma 🎧 — Remixes, sets en vivo y música electrónica." />
        <meta property="og:url" content="https://dj-decxin-rmx.lovable.app/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-background relative">
        <ParticlesBackground />
        <Navbar />
        <main id="main">
          <HeroSection />
          <LiveClock />
          <SectionDivider />
          <LinksSection />
          <SectionDivider />
          <PostsSection />
          <SectionDivider />
          <GallerySection />
        </main>
        <Footer />
        <AdminPanel />
        <ScrollToTop />
      </div>
    </SiteProvider>
  );
};

export default Index;
