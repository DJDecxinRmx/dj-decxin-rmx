import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, User, Link2, Image, FileText, Plus, Trash2, Upload, RefreshCw, Globe, Copy, Check, LogOut, Loader2, ChevronDown, ChevronRight, Zap } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { uploadFile } from "@/lib/supabase-helpers";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const AdminPanel = () => {
  const {
    isAdmin, data, user,
    updateProfile, addLink, updateLink, removeLink,
    addGalleryImage, removeGalleryImage,
    addPost, removePost, signOut,
  } = useSite();

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"profile" | "links" | "gallery" | "posts">("profile");
  const [uploading, setUploading] = useState(false);

  // Collapsible states
  const [formOpen, setFormOpen] = useState(true);
  const [listOpen, setListOpen] = useState(false);

  // Profile
  const [editName, setEditName] = useState(data.profile.name);
  const [editTagline, setEditTagline] = useState(data.profile.tagline);
  const profileFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  // Links
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkDesc, setNewLinkDesc] = useState("");

  // Gallery
  const [newImageAlt, setNewImageAlt] = useState("");
  const [newImageDesc, setNewImageDesc] = useState("");
  const [newImageLink, setNewImageLink] = useState("");
  const galleryFileRef = useRef<HTMLInputElement>(null);

  // Posts
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImageUrl, setNewPostImageUrl] = useState<string | null>(null);
  const [newPostImageFile, setNewPostImageFile] = useState<File | null>(null);
  const postImageRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const SITE_URL = "https://dj-decxin-showcase.lovable.app";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "site-assets", `profile/${Date.now()}-${file.name}`);
      await updateProfile({ ...data.profile, profileImage: url });
    } finally { setUploading(false); }
  };

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "site-assets", `banner/${Date.now()}-${file.name}`);
      await updateProfile({ ...data.profile, bannerImage: url });
    } finally { setUploading(false); }
  };

  const handleSaveProfile = async () => {
    setUploading(true);
    try {
      await updateProfile({ ...data.profile, name: editName, tagline: editTagline });
    } finally { setUploading(false); }
  };

  const linkImageRef = useRef<HTMLInputElement>(null);
  const [newLinkImageFile, setNewLinkImageFile] = useState<File | null>(null);
  const [newLinkImagePreview, setNewLinkImagePreview] = useState<string | null>(null);

  const handleLinkImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewLinkImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setNewLinkImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddLink = async () => {
    if (!newLinkTitle || !newLinkUrl) return;
    setUploading(true);
    try {
      let imageUrl: string | undefined;
      if (newLinkImageFile) {
        imageUrl = await uploadFile(newLinkImageFile, "site-assets", `links/${Date.now()}-${newLinkImageFile.name}`);
      }
      await addLink({ title: newLinkTitle, url: newLinkUrl, description: newLinkDesc, image: imageUrl });
      setNewLinkTitle(""); setNewLinkUrl(""); setNewLinkDesc("");
      setNewLinkImageFile(null); setNewLinkImagePreview(null);
      if (linkImageRef.current) linkImageRef.current.value = "";
    } finally { setUploading(false); }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "site-assets", `gallery/${Date.now()}-${file.name}`);
      await addGalleryImage(url, newImageAlt || "Foto", newImageDesc || undefined, newImageLink || undefined);
      setNewImageAlt(""); setNewImageDesc(""); setNewImageLink("");
      if (galleryFileRef.current) galleryFileRef.current.value = "";
    } finally { setUploading(false); }
  };

  const handlePostImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPostImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setNewPostImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddPost = async () => {
    if (!newPostContent.trim() && !newPostImageFile) return;
    setUploading(true);
    try {
      let imageUrl: string | undefined;
      if (newPostImageFile) {
        imageUrl = await uploadFile(newPostImageFile, "site-assets", `posts/${Date.now()}-${newPostImageFile.name}`);
      }
      await addPost(newPostContent, imageUrl);
      setNewPostContent(""); setNewPostImageUrl(null); setNewPostImageFile(null);
      if (postImageRef.current) postImageRef.current.value = "";
    } finally { setUploading(false); }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/admin-login");
  };

  const inputClass = "w-full p-3 rounded-lg bg-background/80 border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all";

  const tabs = [
    { key: "profile" as const, label: "Perfil", icon: <User className="w-4 h-4" /> },
    { key: "links" as const, label: "Links", icon: <Link2 className="w-4 h-4" /> },
    { key: "gallery" as const, label: "Fotos", icon: <Image className="w-4 h-4" /> },
    { key: "posts" as const, label: "Textos", icon: <FileText className="w-4 h-4" /> },
  ];

  // Collapsible section header component
  const SectionHeader = ({ open, onToggle, icon, label, count }: { open: boolean; onToggle: () => void; icon: React.ReactNode; label: string; count?: number }) => (
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

  if (!isAdmin) {
    return (
      <button
        onClick={() => navigate("/admin-login")}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center shadow-lg hover:bg-primary/30 transition-colors"
        title="Admin"
        style={{ boxShadow: "0 0 20px hsl(174 100% 50% / 0.3)" }}
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        style={{ boxShadow: "0 0 25px hsl(174 100% 50% / 0.6), 0 0 50px hsl(174 100% 50% / 0.2)" }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Settings className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-40 h-full w-full max-w-md glass border-l border-border flex flex-col"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 p-4 pb-3 border-b border-border bg-background/90 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary animate-pulse-glow" />
                  <h2 className="font-display text-sm tracking-widest neon-text-cyan">PANEL ADMIN</h2>
                </div>
                <div className="flex items-center gap-2">
                  {user && <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{user.email}</span>}
                  <button onClick={handleSignOut} title="Cerrar sesión" className="p-1.5 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all">
                    <LogOut className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} title="Cerrar panel" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-muted/80 rounded-lg p-1">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => { setTab(t.key); setFormOpen(true); setListOpen(false); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-md text-[11px] font-display tracking-wide transition-all ${
                      tab === t.key
                        ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(174_100%_50%/0.3)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary font-display tracking-wide"
                >
                  <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                </motion.div>
              )}

              {/* Share & Refresh - Collapsible */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="text-[11px] font-display tracking-widest text-foreground">PÁGINA EN VIVO</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-data-[state=open]:rotate-90" />
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
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full py-2 rounded-lg bg-secondary/80 text-secondary-foreground font-display tracking-wide text-[11px] flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> ACTUALIZAR
                    </button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* PROFILE TAB */}
              {tab === "profile" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <SectionHeader open={formOpen} onToggle={() => setFormOpen(v => !v)} icon={<User className="w-4 h-4" />} label="EDITAR PERFIL" />
                  <AnimatePresence>
                    {formOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
                        <div>
                          <label className="text-[10px] text-muted-foreground font-display tracking-wide">NOMBRE</label>
                          <input value={editName} onChange={(e) => setEditName(e.target.value)} className={`${inputClass} mt-1`} />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground font-display tracking-wide">TAGLINE</label>
                          <input value={editTagline} onChange={(e) => setEditTagline(e.target.value)} className={`${inputClass} mt-1`} />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground font-display tracking-wide">FOTO DE PERFIL</label>
                          <div className="mt-1 flex items-center gap-3">
                            {data.profile.profileImage && (
                              <img src={data.profile.profileImage} alt="Perfil" className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                            )}
                            <button onClick={() => profileFileRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-xs text-foreground hover:border-primary transition-colors">
                              <Upload className="w-3 h-3" /> Subir
                            </button>
                            <input ref={profileFileRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground font-display tracking-wide">BANNER</label>
                          <div className="mt-1 space-y-2">
                            {data.profile.bannerImage && (
                              <img src={data.profile.bannerImage} alt="Banner" className="w-full h-20 rounded-lg object-cover border border-primary/20" />
                            )}
                            <button onClick={() => bannerFileRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-xs text-foreground hover:border-primary transition-colors">
                              <Upload className="w-3 h-3" /> Subir banner
                            </button>
                            <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerImageUpload} />
                          </div>
                        </div>
                        <button onClick={handleSaveProfile} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-xs hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_15px_hsl(174_100%_50%/0.2)]">
                          GUARDAR PERFIL
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* LINKS TAB */}
              {tab === "links" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <SectionHeader open={formOpen} onToggle={() => setFormOpen(v => !v)} icon={<Plus className="w-4 h-4" />} label="NUEVO LINK" />
                  <AnimatePresence>
                    {formOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
                        <input value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} placeholder="Título del link" className={inputClass} />
                        <input value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="URL (https://...)" className={inputClass} />
                        <input value={newLinkDesc} onChange={(e) => setNewLinkDesc(e.target.value)} placeholder="Descripción (opcional)" className={inputClass} />
                        <div>
                          <label className="text-[10px] text-muted-foreground font-display tracking-wide mb-1 block">IMAGEN (OPCIONAL)</label>
                          {newLinkImagePreview && (
                            <div className="relative mb-2 inline-block">
                              <img src={newLinkImagePreview} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-primary/30" />
                              <button onClick={() => { setNewLinkImagePreview(null); setNewLinkImageFile(null); if (linkImageRef.current) linkImageRef.current.value = ""; }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <button onClick={() => linkImageRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs text-foreground hover:border-primary transition-colors">
                            <Upload className="w-3 h-3" /> Subir imagen
                          </button>
                          <input ref={linkImageRef} type="file" accept="image/*" className="hidden" onChange={handleLinkImageSelect} />
                        </div>
                        <button onClick={handleAddLink} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_15px_hsl(174_100%_50%/0.2)]">
                          <Plus className="w-4 h-4" /> AGREGAR LINK
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <SectionHeader open={listOpen} onToggle={() => setListOpen(v => !v)} icon={<Link2 className="w-4 h-4" />} label="LINKS ACTUALES" count={data.links.length} />
                  <AnimatePresence>
                    {listOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
                        {data.links.map((link, i) => (
                          <motion.div key={link.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-all group">
                            {link.image && (
                              <img src={link.image} alt="" className="w-10 h-10 rounded-md object-cover border border-border shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground truncate">{link.title}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{link.url}</p>
                            </div>
                            <button onClick={() => removeLink(link.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1.5 rounded-md hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                        {data.links.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No hay links aún</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* GALLERY TAB */}
              {tab === "gallery" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <SectionHeader open={formOpen} onToggle={() => setFormOpen(v => !v)} icon={<Plus className="w-4 h-4" />} label="SUBIR FOTO" />
                  <AnimatePresence>
                    {formOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
                        <input value={newImageAlt} onChange={(e) => setNewImageAlt(e.target.value)} placeholder="Nombre / título (opcional)" className={inputClass} />
                        <textarea value={newImageDesc} onChange={(e) => setNewImageDesc(e.target.value)} placeholder="Descripción (opcional)" rows={2} className={`${inputClass} resize-none`} />
                        <input value={newImageLink} onChange={(e) => setNewImageLink(e.target.value)} placeholder="Enlace (opcional, https://...)" className={inputClass} />
                        <button onClick={() => galleryFileRef.current?.click()} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_15px_hsl(174_100%_50%/0.2)]">
                          <Upload className="w-4 h-4" /> SELECCIONAR Y SUBIR
                        </button>
                        <input ref={galleryFileRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <SectionHeader open={listOpen} onToggle={() => setListOpen(v => !v)} icon={<Image className="w-4 h-4" />} label="FOTOS ACTUALES" count={data.gallery.length} />
                  <AnimatePresence>
                    {listOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          {data.gallery.map((img, i) => (
                            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="relative group aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all">
                              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                              <button onClick={() => removeGalleryImage(img.id)} className="absolute inset-0 bg-destructive/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-5 h-5 text-foreground" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                        {data.gallery.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No hay fotos aún</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* POSTS TAB */}
              {tab === "posts" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <SectionHeader open={formOpen} onToggle={() => setFormOpen(v => !v)} icon={<Plus className="w-4 h-4" />} label="NUEVO TEXTO" />
                  <AnimatePresence>
                    {formOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
                        <textarea
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="Escribe un texto, anuncio o pega un enlace..."
                          rows={3}
                          className={`${inputClass} resize-none`}
                        />
                        <div>
                          <label className="text-[10px] text-muted-foreground font-display tracking-wide mb-1 block">IMAGEN (OPCIONAL)</label>
                          {newPostImageUrl && (
                            <div className="relative mb-2">
                              <img src={newPostImageUrl} alt="Preview" className="w-full h-28 object-cover rounded-lg border border-primary/20" />
                              <button onClick={() => { setNewPostImageUrl(null); setNewPostImageFile(null); if (postImageRef.current) postImageRef.current.value = ""; }} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <button onClick={() => postImageRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-xs text-foreground hover:border-primary transition-colors">
                            <Upload className="w-3 h-3" /> Subir foto
                          </button>
                          <input ref={postImageRef} type="file" accept="image/*" className="hidden" onChange={handlePostImageSelect} />
                        </div>
                        <button onClick={handleAddPost} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_15px_hsl(174_100%_50%/0.2)]">
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          PUBLICAR
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <SectionHeader open={listOpen} onToggle={() => setListOpen(v => !v)} icon={<FileText className="w-4 h-4" />} label="PUBLICACIONES" count={data.posts.length} />
                  <AnimatePresence>
                    {listOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
                        {data.posts.map((post, i) => (
                          <motion.div key={post.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-all">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                {post.image && <img src={post.image} alt="" className="w-full h-20 object-cover rounded-md mb-2 border border-border" />}
                                <p className="text-xs text-foreground whitespace-pre-wrap line-clamp-3">{post.content}</p>
                              </div>
                              <button onClick={() => removePost(post.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1.5 rounded-md hover:bg-destructive/10">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1.5">
                              {new Date(post.createdAt).toLocaleDateString("es")}
                            </p>
                          </motion.div>
                        ))}
                        {data.posts.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No hay publicaciones aún</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Bottom padding for FAB */}
              <div className="h-20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;
