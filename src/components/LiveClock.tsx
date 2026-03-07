import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const LiveClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const dateStr = now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-1 py-6"
    >
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        <p className="text-sm text-muted-foreground font-display tracking-wider capitalize">
          {dateStr}
        </p>
      </div>
      <motion.div
        className="w-24 h-[1px] mt-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default LiveClock;
