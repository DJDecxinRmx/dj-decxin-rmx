import { Zap, LogOut, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface AdminHeaderProps {
  user: User | null;
  onSignOut: () => void;
  onClose: () => void;
  tab: string;
  setTab: (tab: "profile" | "links" | "gallery" | "posts") => void;
  resetEdit: () => void;
}

const tabs = [
  { key: "profile" as const, label: "Perfil", icon: "👤" },
  { key: "links" as const, label: "Links", icon: "🔗" },
  { key: "gallery" as const, label: "Fotos", icon: "📷" },
  { key: "posts" as const, label: "Textos", icon: "📝" },
];

const AdminHeader = ({ user, onSignOut, onClose, tab, setTab, resetEdit }: AdminHeaderProps) => (
  <div className="sticky top-0 z-10 p-4 pb-3 border-b border-border bg-background/90 backdrop-blur-xl">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary animate-pulse-glow" />
        <h2 className="font-display text-sm tracking-widest neon-text-cyan">PANEL ADMIN</h2>
      </div>
      <div className="flex items-center gap-2">
        {user && <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{user.email}</span>}
        <button onClick={onSignOut} title="Cerrar sesión" className="p-1.5 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all">
          <LogOut className="w-4 h-4" />
        </button>
        <button onClick={onClose} title="Cerrar panel" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="flex gap-1 bg-muted/80 rounded-lg p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => { setTab(t.key); resetEdit(); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-md text-[11px] font-display tracking-wide transition-all ${
            tab === t.key
              ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(174_100%_50%/0.3)]"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span className="text-sm">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  </div>
);

export default AdminHeader;
