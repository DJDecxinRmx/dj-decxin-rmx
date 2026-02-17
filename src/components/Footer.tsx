import { motion } from "framer-motion";
import { useSite } from "@/context/SiteContext";
import { Music, Headphones, Radio } from "lucide-react";

const Footer = () => {
  const { data } = useSite();

  return (
    <footer className="relative border-t border-border">
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <Music className="w-5 h-5 text-primary" />
          <Headphones className="w-5 h-5 text-secondary" />
          <Radio className="w-5 h-5 text-primary" />
        </motion.div>

        <p className="font-display text-sm tracking-widest neon-text-cyan mb-2">
          {data.profile.name}
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          {data.profile.tagline}
        </p>

        <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mb-6" />

        <p className="text-muted-foreground text-[10px] font-display tracking-[0.3em]">
          © 2026 {data.profile.name}. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
