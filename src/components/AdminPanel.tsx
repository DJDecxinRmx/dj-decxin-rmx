import { useState } from "react";
import { Settings, X, Loader2, Globe, Copy, Check, RefreshCw, ChevronRight } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AdminHeader from "./admin/AdminHeader";
import ProfileTab from "./admin/ProfileTab";
import LinksTab from "./admin/LinksTab";
import GalleryTab from "./admin/GalleryTab";
import PostsTab from "./admin/PostsTab";

const SITE_URL = import.meta.env.VITE_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");

const AdminPanel = () => {
  const { isAdmin, user, signOut } = useSite();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"profile" | "links" | "gallery" | "posts">("profile");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/admin-login");
  };

  if (!isAdmin) {
    return (
      <button
        onClick={() => navigate("/admin-login")}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center hover:bg-primary/30 transition-colors"
        title="Admin"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-transform active:scale-90"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed top-0 right-0 z-40 h-full w-full max-w-md bg-card/95 border-l border-border flex flex-col"
          style={{ animation: "slideIn 0.2s ease-out" }}
        >
          <AdminHeader user={user} onSignOut={handleSignOut} onClose={() => setIsOpen(false)} tab={tab} setTab={setTab} resetEdit={() => {}} />

          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" style={{ paddingBottom: "80vh" }}>
            {uploading && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary font-display tracking-wide">
                <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
              </div>
            )}

            <Collapsible>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-[11px] font-display tracking-widest text-foreground">PÁGINA EN VIVO</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-data-[state=open]:rotate-90 transition-transform" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border space-y-2">
                  <div className="flex items-center gap-2">
                    <input readOnly value={SITE_URL} className="flex-1 p-2 rounded-md bg-background border border-border text-[11px] text-primary font-mono truncate" />
                    <button onClick={handleCopyUrl} className="shrink-0 p-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity" title="Copiar">
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <button onClick={() => window.location.reload()} className="w-full py-2 rounded-lg bg-secondary/80 text-secondary-foreground font-display tracking-wide text-[11px] flex items-center justify-center gap-2 hover:bg-secondary transition-colors">
                    <RefreshCw className="w-3 h-3" /> ACTUALIZAR
                  </button>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {tab === "profile" && <ProfileTab uploading={uploading} setUploading={setUploading} />}
            {tab === "links" && <LinksTab uploading={uploading} setUploading={setUploading} />}
            {tab === "gallery" && <GalleryTab uploading={uploading} setUploading={setUploading} />}
            {tab === "posts" && <PostsTab uploading={uploading} setUploading={setUploading} />}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
