import { motion } from "framer-motion";
import heroImage from "@/assets/hero-dj.jpg";
import profileImage from "@/assets/dj-profile.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="DJ Decxin Rmx performing"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-16">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary neon-border-cyan"
        >
          <img
            src={profileImage}
            alt="DJ Decxin Rmx"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-6xl font-display font-bold tracking-wider neon-text-cyan text-center"
        >
          DJ DECXIN RMX
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-muted-foreground text-lg max-w-md text-center font-light"
        >
          Beats que mueven tu alma 🎧
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
