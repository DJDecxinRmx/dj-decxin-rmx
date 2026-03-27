import { useMemo } from "react";
import { Link2, ExternalLink } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const LinksSection = () => {
  const { data } = useSite();
  const links = useMemo(() => data.links, [data.links]);

  if (links.length === 0) return null;

  return (
    <section id="links" className="px-4 py-12 max-w-lg mx-auto">
      <h2 className="font-display text-xl tracking-widest neon-text-magenta text-center mb-8 animate-fade-in">
        MIS LINKS
      </h2>

      <div className="flex flex-col gap-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_hsl(174_100%_50%/0.4)] border border-border hover:border-primary/50 group relative neon-border-animated neon-border-animated-subtle active:scale-[0.97] animate-fade-in"
          >
            <div className="relative flex items-center gap-4 p-4">
              {link.image ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0 group-hover:border-primary/50 transition-all duration-300">
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
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default LinksSection;
