import { useState, useMemo } from "react";
import { ExternalLink } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { isValidHttpUrl } from "@/lib/url-validation";

const GallerySection = () => {
  const { data } = useSite();
  const [selected, setSelected] = useState<number | null>(null);
  const gallery = useMemo(() => data.gallery, [data.gallery]);

  const renderText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
      urlRegex.test(part) && isValidHttpUrl(part) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:neon-text-cyan transition-all break-all">
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  if (gallery.length === 0) return null;

  return (
    <section id="gallery" className="px-4 py-12 max-w-2xl mx-auto">
      <h2 className="font-display text-xl tracking-widest neon-text-magenta text-center mb-8 animate-fade-in">
        FOTOS
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {gallery.map((img, index) => (
          <div
            key={img.id}
            className="rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:shadow-[0_0_25px_hsl(174_100%_50%/0.4)] transition-all duration-300 group relative neon-border-animated neon-border-animated-subtle animate-fade-in"
          >
            <button
              onClick={() => setSelected(index)}
              className="w-full aspect-square"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300" loading="lazy" />
            </button>
            {(img.description || img.link) && (
              <div className="p-2 bg-muted/50">
                {img.description && (
                  <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                    {renderText(img.description)}
                  </p>
                )}
                {img.link && isValidHttpUrl(img.link) && (
                  <a href={img.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:neon-text-cyan mt-1 transition-all">
                    <ExternalLink className="w-3 h-3" /> Ver enlace
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {selected !== null && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 cursor-pointer animate-fade-in"
        >
          <div onClick={(e) => e.stopPropagation()} className="max-w-full max-h-[85vh] flex flex-col items-center gap-3">
            <img
              src={gallery[selected].src}
              alt={gallery[selected].alt}
              className="max-w-full max-h-[70vh] rounded-lg neon-border-cyan border-2 border-primary"
            />
            {(gallery[selected].description || gallery[selected].link) && (
              <div className="glass rounded-lg p-3 max-w-md text-center">
                {gallery[selected].description && (
                  <p className="text-sm text-foreground whitespace-pre-wrap">{renderText(gallery[selected].description!)}</p>
                )}
                {gallery[selected].link && isValidHttpUrl(gallery[selected].link!) && (
                  <a href={gallery[selected].link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:neon-text-cyan mt-2 transition-all">
                    <ExternalLink className="w-4 h-4" /> Abrir enlace
                  </a>
                )}
              </div>
            )}
            <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground font-display tracking-wide">CERRAR</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
