import { motion } from "framer-motion";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const GallerySection = () => {
  const { data } = useSite();
  const [selected, setSelected] = useState<number | null>(null);

  if (data.gallery.length === 0) return null;

  const renderText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:neon-text-cyan transition-all break-all">
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <section id="gallery" className="px-4 py-12 max-w-2xl mx-auto">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-display text-xl tracking-widest neon-text-magenta text-center mb-8"
      >
        FOTOS
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.gallery.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -3 : 3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, type: "spring", stiffness: 100 }}
            whileHover={{ 
              scale: 1.05, 
              rotate: 0,
              boxShadow: "0 0 25px hsl(174 100% 50% / 0.4), 0 0 50px hsl(320 100% 60% / 0.2)",
            }}
            className="rounded-lg overflow-hidden border border-border hover:neon-border-cyan transition-all duration-300 group relative"
          >
            {/* Glow overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
            <button
              onClick={() => setSelected(index)}
              className="w-full aspect-square"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500" loading="lazy" />
            </button>
            {(img.description || img.link) && (
              <div className="p-2 bg-muted/50">
                {img.description && (
                  <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                    {renderText(img.description)}
                  </p>
                )}
                {img.link && (
                  <a href={img.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:neon-text-cyan mt-1 transition-all">
                    <ExternalLink className="w-3 h-3" /> Ver enlace
                  </a>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 cursor-pointer"
        >
          <div onClick={(e) => e.stopPropagation()} className="max-w-full max-h-[85vh] flex flex-col items-center gap-3">
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={data.gallery[selected].src}
              alt={data.gallery[selected].alt}
              className="max-w-full max-h-[70vh] rounded-lg neon-border-cyan border-2 border-primary"
            />
            {(data.gallery[selected].description || data.gallery[selected].link) && (
              <div className="glass rounded-lg p-3 max-w-md text-center">
                {data.gallery[selected].description && (
                  <p className="text-sm text-foreground whitespace-pre-wrap">{renderText(data.gallery[selected].description!)}</p>
                )}
                {data.gallery[selected].link && (
                  <a href={data.gallery[selected].link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:neon-text-cyan mt-2 transition-all">
                    <ExternalLink className="w-4 h-4" /> Abrir enlace
                  </a>
                )}
              </div>
            )}
            <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground font-display tracking-wide">CERRAR</button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default GallerySection;
