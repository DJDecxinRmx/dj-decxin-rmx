import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const LiveClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-1 py-6"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="w-4 h-4 text-primary" />
        </motion.div>
        <motion.span
          key={timeStr}
          initial={{ opacity: 0.7, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-mono text-2xl tracking-widest neon-text-cyan font-bold"
        >
          {timeStr}
        </motion.span>
      </div>
      <p className="text-xs text-muted-foreground font-display tracking-wider capitalize">
        {dateStr}
      </p>
      <motion.div
        className="w-24 h-[1px] mt-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default LiveClock;
