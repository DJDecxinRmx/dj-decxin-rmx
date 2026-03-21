import { useMemo } from "react";

const ParticlesBackground = () => {
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      isCyan: Math.random() > 0.4,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.isCyan
              ? "hsl(var(--neon-cyan))"
              : "hsl(var(--neon-magenta))",
            boxShadow: p.isCyan
              ? "0 0 6px hsl(174 100% 50% / 0.6)"
              : "0 0 6px hsl(320 100% 60% / 0.6)",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticlesBackground;
