import { motion } from "framer-motion";
import { useSite } from "@/context/SiteContext";

const GlitchText = ({ text, className }: { text: string; className?: string }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="relative z-10">{text}</span>
    <motion.span
      className="absolute inset-0 neon-text-magenta opacity-0 z-0"
      aria-hidden
      animate={{ opacity: [0, 0.8, 0], x: [0, -3, 3, 0] }}
      transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
    >
      {text}
    </motion.span>
    <motion.span
      className="absolute inset-0 neon-text-cyan opacity-0 z-0"
      aria-hidden
      animate={{ opacity: [0, 0.8, 0], x: [0, 3, -3, 0] }}
      transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4, delay: 0.05 }}
    >
      {text}
    </motion.span>
  </span>
);

const HeroSection = () => {
  const { data } = useSite();
  const { profile } = data;

  return (
    <section id="hero" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0">
        <img
          src={profile.bannerImage}
          alt="DJ Decxin Rmx performing"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, hsl(174 100% 50% / 0.15), transparent 60%)",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(174 100% 50% / 0.02) 2px, hsl(174 100% 50% / 0.02) 4px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-16">
        {/* Animated ring around profile */}
        <div className="relative">
          <motion.div
            className="absolute -inset-2 rounded-full border-2 border-primary opacity-40"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
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
          <GlitchText text={profile.name} />
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-muted-foreground text-lg max-w-md text-center font-light"
        >
          {profile.tagline}
        </motion.p>

        {/* Animated bars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-end gap-1 h-6 mt-2"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{
                background: i % 2 === 0
                  ? "hsl(var(--neon-cyan))"
                  : "hsl(var(--neon-magenta))",
              }}
              animate={{ height: ["4px", `${Math.random() * 20 + 6}px`, "4px"] }}
              transition={{ duration: 0.8 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
