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

        <h1 className="text-2xl md:text-4xl font-display font-bold tracking-wider neon-text-cyan text-center animate-fade-in whitespace-nowrap inline-block px-4 py-2 rounded-lg border-2 neon-border-cyan">
          {profile.name}
        </h1>

        <p className="text-muted-foreground text-base max-w-md text-center font-light animate-fade-in">
          {profile.tagline}
        </p>

        <div className="flex items-end gap-1 h-5 mt-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 rounded-full animate-equalizer"
              style={{
                background: i % 2 === 0 ? "hsl(var(--neon-cyan))" : "hsl(var(--neon-magenta))",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
