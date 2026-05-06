import { useSite } from "@/context/SiteContext";

const HeroSection = () => {
  const { data } = useSite();
  const { profile } = data;

  return (
    <section id="hero" className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <img
          src={profile.bannerImage}
          alt="DJ Decxin Rmx performing"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 px-4 py-12">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary neon-border-cyan animate-fade-in">
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-xl md:text-3xl font-display font-bold tracking-wider neon-text-cyan text-center animate-fade-in whitespace-nowrap inline-block px-3 py-1.5 rounded-lg border-2 neon-border-cyan">
          {profile.name}
        </h1>

        <p className="text-foreground text-lg md:text-xl max-w-lg text-center font-medium animate-fade-in tracking-wide drop-shadow-[0_0_10px_hsl(var(--neon-magenta)/0.5)]">
          {profile.tagline}
        </p>

      </div>
    </section>
  );
};

export default HeroSection;
