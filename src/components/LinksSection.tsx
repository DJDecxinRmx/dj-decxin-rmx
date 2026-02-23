import { motion } from "framer-motion";
import { Link2, ExternalLink } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const LinksSection = () => {
  const { data } = useSite();

  if (data.links.length === 0) return null;

  return (
    <section id="links" className="px-4 py-12 max-w-lg mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-xl tracking-widest neon-text-magenta text-center mb-8"
      >
        MIS LINKS
      </motion.h2>

      <div className="flex flex-col gap-4">
        {data.links.map((link, index) => (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 120 }}
            whileHover={{ 
              scale: 1.04, 
              boxShadow: "0 0 30px hsl(174 100% 50% / 0.4), 0 0 60px hsl(320 100% 60% / 0.15)",
            }}
            whileTap={{ scale: 0.97 }}
            className="glass rounded-xl overflow-hidden transition-all duration-300 hover:neon-border-cyan border border-border group relative"
          >
            {/* Animated gradient background on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
            {/* Scan line effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(174_100%_50%/0.03)_2px,hsl(174_100%_50%/0.03)_4px)]" />
            </div>

            <div className="relative flex items-center gap-4 p-4">
              {/* Optional image thumbnail */}
              {link.image ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0 group-hover:neon-border-cyan transition-all duration-300">
                  <img src={link.image} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <span className="text-primary group-hover:neon-text-cyan transition-all shrink-0">
                  <Link2 className="w-5 h-5" />
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm tracking-wide text-foreground group-hover:neon-text-cyan transition-all duration-300">
                  {link.title}
                </p>
                {link.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-foreground/60 transition-colors">
                    {link.description}
                  </p>
                )}
              </div>
              <motion.span 
                className="text-muted-foreground text-xs group-hover:text-primary transition-colors"
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default LinksSection;
