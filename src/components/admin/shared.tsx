import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const inputClass = "w-full p-3 rounded-lg bg-background/80 border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all";

export const SectionHeader = ({ open, onToggle, icon, label, count }: { open: boolean; onToggle: () => void; icon: React.ReactNode; label: string; count?: number }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/60 border border-border hover:border-primary/40 transition-all group"
  >
    <div className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <span className="text-xs font-display tracking-widest text-foreground">{label}</span>
      {count !== undefined && (
        <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-display">{count}</span>
      )}
    </div>
    <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
      <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </motion.div>
  </button>
);

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
