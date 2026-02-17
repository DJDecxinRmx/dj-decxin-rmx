import { motion } from "framer-motion";
import { useState } from "react";
import { useSite } from "@/context/SiteContext";

const GallerySection = () => {
  const { data } = useSite();
  const [selected, setSelected] = useState<number | null>(null);

  if (data.gallery.length === 0) return null;

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
          <motion.button
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelected(index)}
            className="aspect-square rounded-lg overflow-hidden border border-border hover:neon-border-cyan transition-all duration-300"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.button>
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
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={data.gallery[selected].src}
            alt={data.gallery[selected].alt}
            className="max-w-full max-h-[85vh] rounded-lg neon-border-cyan border-2 border-primary"
          />
        </motion.div>
      )}
    </section>
  );
};

export default GallerySection;
