import { motion } from "framer-motion";
import { useSite } from "@/context/SiteContext";
import { Music, Headphones, Radio } from "lucide-react";

const Footer = () => {
  const { data } = useSite();

  return (
    <footer className="relative border-t border-border overflow-hidden">
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px animated-gradient-border opacity-60" />
      
      <div className="max-w-lg mx-auto px-4 py-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
            <Music className="w-5 h-5 text-primary" />
          </motion.div>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Headphones className="w-5 h-5 text-secondary" />
          </motion.div>
          <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}>
            <Radio className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-sm tracking-widest neon-text-cyan mb-2"
        >
          {data.profile.name}
        </motion.p>
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
