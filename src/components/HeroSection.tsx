import { motion } from "framer-motion";
import { useSite } from "@/context/SiteContext";
import { useMemo } from "react";

const HeroSection = () => {
  const { data } = useSite();
  const { profile } = data;

  const bars = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      i,
      isCyan: i % 2 === 0,
      delay: i * 0.08,
    })), []
  );

  return (
    <section id="hero" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <img
          src={profile.bannerImage}
          alt="DJ Decxin Rmx performing"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
        <div
          className="absolute inset-0 opacity-20 animate-pulse-glow"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, hsl(174 100% 50% / 0.15), transparent 60%)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(174 100% 50% / 0.02) 2px, hsl(174 100% 50% / 0.02) 4px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-16">
        <div className="relative">
          <div
            className="absolute -inset-2 rounded-full border-2 border-primary opacity-40 animate-spin-slow"
            style={{ borderStyle: "dashed" }}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-36 h-36 rounded-full overflow-hidden border-2 border-primary neon-border-cyan relative"
          >
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-6xl font-display font-bold tracking-wider neon-text-cyan text-center"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-muted-foreground text-lg max-w-md text-center font-light"
        >
          {profile.tagline}
        </motion.p>

        <div className="flex items-end gap-1 h-6 mt-2">
          {bars.map(({ i, isCyan, delay }) => (
            <div
              key={i}
              className="w-1 rounded-full animate-equalizer"
              style={{
                background: isCyan
                  ? "hsl(var(--neon-cyan))"
                  : "hsl(var(--neon-magenta))",
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
