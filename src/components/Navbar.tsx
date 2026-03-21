import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "hero", label: "INICIO" },
  { id: "links", label: "LINKS" },
  { id: "posts", label: "NOVEDADES" },
  { id: "gallery", label: "FOTOS" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <button onClick={() => scrollTo("hero")} className="font-display text-sm tracking-widest neon-text-cyan">
          DECXIN
        </button>

        <div className="hidden md:flex items-center gap-6">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="font-display text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {s.label}
            </button>
          ))}
          <EqualizerBars />
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-primary">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <div className="flex flex-col items-center gap-4 py-4">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="font-display text-sm tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const EqualizerBars = () => (
  <div className="flex items-end gap-[3px] h-4">
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="w-[3px] bg-primary rounded-full animate-equalizer"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

export default Navbar;
