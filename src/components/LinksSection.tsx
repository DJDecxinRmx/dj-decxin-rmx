import { motion } from "framer-motion";
import { Music, Headphones, Instagram, Youtube, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";

interface LinkItem {
  title: string;
  url: string;
  icon: ReactNode;
  description?: string;
}

const links: LinkItem[] = [
  {
    title: "🎵 Mi Último Mix",
    url: "#",
    icon: <Music className="w-5 h-5" />,
    description: "Escucha mi sesión más reciente",
  },
  {
    title: "📺 YouTube",
    url: "#",
    icon: <Youtube className="w-5 h-5" />,
    description: "Videos y sets en vivo",
  },
  {
    title: "📸 Instagram",
    url: "#",
    icon: <Instagram className="w-5 h-5" />,
    description: "@djdecxinrmx",
  },
  {
    title: "🎧 SoundCloud",
    url: "#",
    icon: <Headphones className="w-5 h-5" />,
    description: "Todos mis tracks y remixes",
  },
  {
    title: "💬 WhatsApp",
    url: "#",
    icon: <MessageCircle className="w-5 h-5" />,
    description: "Contrataciones y contacto",
  },
];

const LinksSection = () => {
  return (
    <section className="px-4 py-8 max-w-lg mx-auto">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-display text-xl tracking-widest neon-text-magenta text-center mb-8"
      >
        MIS LINKS
      </motion.h2>

      <div className="flex flex-col gap-4">
        {links.map((link, index) => (
          <motion.a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="glass rounded-lg p-4 flex items-center gap-4 transition-all duration-300 hover:neon-border-cyan border border-border group"
          >
            <span className="text-primary group-hover:neon-text-cyan transition-all">
              {link.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm tracking-wide text-foreground">
                {link.title}
              </p>
              {link.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {link.description}
                </p>
              )}
            </div>
            <span className="text-muted-foreground text-xs">→</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default LinksSection;
