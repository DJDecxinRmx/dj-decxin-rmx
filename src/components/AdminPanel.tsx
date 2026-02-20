import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, User, Link2, Image, FileText, Plus, Trash2, Upload, RefreshCw, Globe, Copy, Check, LogOut, Loader2 } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { uploadFile } from "@/lib/supabase-helpers";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const {
    isAdmin, data, user,
    updateProfile, addLink, removeLink,
    addGalleryImage, removeGalleryImage,
    addPost, removePost, signOut,
  } = useSite();

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"profile" | "links" | "gallery" | "posts">("profile");
  const [uploading, setUploading] = useState(false);

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
    } finally {
      setUploading(false);
    }
  };

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "site-assets", `banner/${Date.now()}-${file.name}`);
      await updateProfile({ ...data.profile, bannerImage: url });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setUploading(true);
    try {
      await updateProfile({ ...data.profile, name: editName, tagline: editTagline });
    } finally {
      setUploading(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLinkTitle || !newLinkUrl) return;
    setUploading(true);
    try {
      await addLink({ title: newLinkTitle, url: newLinkUrl, description: newLinkDesc });
      setNewLinkTitle(""); setNewLinkUrl(""); setNewLinkDesc("");
    } finally {
      setUploading(false);
    }
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
    } finally {
      setUploading(false);
    }
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
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/admin-login");
  };

  const inputClass = "w-full p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary";

  const tabs = [
    { key: "profile" as const, label: "Perfil", icon: <User className="w-4 h-4" /> },
    { key: "links" as const, label: "Links", icon: <Link2 className="w-4 h-4" /> },
    { key: "gallery" as const, label: "Fotos", icon: <Image className="w-4 h-4" /> },
    { key: "posts" as const, label: "Textos", icon: <FileText className="w-4 h-4" /> },
  ];

  // Only show the panel button if user is admin
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        style={{ boxShadow: "0 0 20px hsl(174 100% 50% / 0.5)" }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-40 h-full w-full max-w-md glass border-l border-border overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg tracking-widest neon-text-cyan">ADMINISTRAR</h2>
                <div className="flex items-center gap-2">
                  {user && <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</span>}
                  <button onClick={handleSignOut} title="Cerrar sesión" className="text-muted-foreground hover:text-destructive transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {uploading && (
                <div className="flex items-center gap-2 mb-4 text-xs text-primary font-display tracking-wide">
                  <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-display tracking-wide transition-all ${
                      tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Share & Refresh */}
              <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-primary" />
                  <p className="text-xs font-display tracking-wide text-foreground">TU PÁGINA EN VIVO</p>
                </div>
                <div className="flex items-center gap-2">
                  <input readOnly value={SITE_URL} className="flex-1 p-2 rounded-md bg-background border border-border text-xs text-primary font-mono truncate" />
                  <button onClick={handleCopyUrl} className="shrink-0 p-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity" title="Copiar enlace">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-2 rounded-lg bg-secondary text-secondary-foreground font-display tracking-wide text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <RefreshCw className="w-3 h-3" /> ACTUALIZAR PÁGINA
                </button>
                <p className="text-[10px] text-muted-foreground text-center">Comparte este enlace para que tus usuarios vean tu contenido</p>
              </div>

              {/* PROFILE TAB */}
              {tab === "profile" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-display tracking-wide">NOMBRE</label>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className={`${inputClass} mt-1`} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-display tracking-wide">TAGLINE</label>
                    <input value={editTagline} onChange={(e) => setEditTagline(e.target.value)} className={`${inputClass} mt-1`} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-display tracking-wide">FOTO DE PERFIL</label>
                    <div className="mt-1 flex items-center gap-3">
                      {data.profile.profileImage && (
                        <img src={data.profile.profileImage} alt="Perfil" className="w-16 h-16 rounded-full object-cover border border-border" />
                      )}
                      <button onClick={() => profileFileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground hover:border-primary transition-colors">
                        <Upload className="w-4 h-4" /> Subir imagen
                      </button>
                      <input ref={profileFileRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-display tracking-wide">BANNER</label>
                    <div className="mt-1 space-y-2">
                      {data.profile.bannerImage && (
                        <img src={data.profile.bannerImage} alt="Banner" className="w-full h-24 rounded-lg object-cover border border-border" />
                      )}
                      <button onClick={() => bannerFileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground hover:border-primary transition-colors">
                        <Upload className="w-4 h-4" /> Subir banner
                      </button>
                      <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerImageUpload} />
                    </div>
                  </div>
                  <button onClick={handleSaveProfile} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                    GUARDAR PERFIL
                  </button>
                </div>
              )}

              {/* LINKS TAB */}
              {tab === "links" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <input value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} placeholder="Título del link" className={inputClass} />
                    <input value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="URL (https://...)" className={inputClass} />
                    <input value={newLinkDesc} onChange={(e) => setNewLinkDesc(e.target.value)} placeholder="Descripción (opcional)" className={inputClass} />
                    <button onClick={handleAddLink} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                      <Plus className="w-4 h-4" /> AGREGAR LINK
                    </button>
                  </div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <p className="text-xs text-muted-foreground font-display tracking-wide mb-2">LINKS ACTUALES</p>
                    {data.links.map((link) => (
                      <div key={link.id} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{link.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                        </div>
                        <button onClick={() => removeLink(link.id)} className="text-destructive hover:opacity-70 transition-opacity shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GALLERY TAB */}
              {tab === "gallery" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-xs text-muted-foreground font-display tracking-wide block">SUBIR FOTO</label>
                    <input value={newImageAlt} onChange={(e) => setNewImageAlt(e.target.value)} placeholder="Nombre / título (opcional)" className={inputClass} />
                    <textarea value={newImageDesc} onChange={(e) => setNewImageDesc(e.target.value)} placeholder="Descripción o texto (opcional)" rows={2} className={`${inputClass} resize-none`} />
                    <input value={newImageLink} onChange={(e) => setNewImageLink(e.target.value)} placeholder="Enlace (opcional, https://...)" className={inputClass} />
                    <button onClick={() => galleryFileRef.current?.click()} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                      <Upload className="w-4 h-4" /> SELECCIONAR Y SUBIR FOTO
                    </button>
                    <input ref={galleryFileRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground font-display tracking-wide mb-2">FOTOS ACTUALES</p>
                    <div className="grid grid-cols-3 gap-2">
                      {data.gallery.map((img) => (
                        <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                          <button onClick={() => removeGalleryImage(img.id)} className="absolute inset-0 bg-destructive/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-5 h-5 text-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* POSTS TAB */}
              {tab === "posts" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Escribe un texto, anuncio o pega un enlace..."
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                    <div>
                      <label className="text-xs text-muted-foreground font-display tracking-wide mb-1 block">IMAGEN (OPCIONAL)</label>
                      {newPostImageUrl && (
                        <div className="relative mb-2">
                          <img src={newPostImageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-border" />
                          <button onClick={() => { setNewPostImageUrl(null); setNewPostImageFile(null); if (postImageRef.current) postImageRef.current.value = ""; }} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <button onClick={() => postImageRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground hover:border-primary transition-colors">
                        <Upload className="w-4 h-4" /> Subir foto
                      </button>
                      <input ref={postImageRef} type="file" accept="image/*" className="hidden" onChange={handlePostImageSelect} />
                    </div>
                    <button onClick={handleAddPost} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      PUBLICAR
                    </button>
                  </div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <p className="text-xs text-muted-foreground font-display tracking-wide mb-2">PUBLICACIONES</p>
                    {data.posts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No hay publicaciones aún</p>
                    )}
                    {data.posts.map((post) => (
                      <div key={post.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {post.image && <img src={post.image} alt="" className="w-full h-24 object-cover rounded-md mb-2 border border-border" />}
                            <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>
                          </div>
                          <button onClick={() => removePost(post.id)} className="text-destructive hover:opacity-70 transition-opacity shrink-0 mt-0.5">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(post.createdAt).toLocaleDateString("es")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;
