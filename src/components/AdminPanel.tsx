import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, User, Link2, Image, FileText, Plus, Trash2 } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const AdminPanel = () => {
  const { isAdmin, toggleAdmin, data, updateProfile, addLink, removeLink, updateLink, addGalleryImage, removeGalleryImage, addPost, removePost } = useSite();
  const [tab, setTab] = useState<"profile" | "links" | "gallery" | "posts">("profile");

  // Form states
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkDesc, setNewLinkDesc] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [editName, setEditName] = useState(data.profile.name);
  const [editTagline, setEditTagline] = useState(data.profile.tagline);
  const [editProfileImg, setEditProfileImg] = useState(data.profile.profileImage);
  const [editBannerImg, setEditBannerImg] = useState(data.profile.bannerImage);

  const handleSaveProfile = () => {
    updateProfile({
      name: editName,
      tagline: editTagline,
      profileImage: editProfileImg,
      bannerImage: editBannerImg,
    });
  };

  const handleAddLink = () => {
    if (!newLinkTitle || !newLinkUrl) return;
    addLink({ title: newLinkTitle, url: newLinkUrl, description: newLinkDesc });
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkDesc("");
  };

  const handleAddImage = () => {
    if (!newImageUrl) return;
    addGalleryImage(newImageUrl, newImageAlt || "Foto");
    setNewImageUrl("");
    setNewImageAlt("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      addGalleryImage(result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPost = () => {
    if (!newPostContent.trim()) return;
    addPost(newPostContent);
    setNewPostContent("");
  };

  const tabs = [
    { key: "profile" as const, label: "Perfil", icon: <User className="w-4 h-4" /> },
    { key: "links" as const, label: "Links", icon: <Link2 className="w-4 h-4" /> },
    { key: "gallery" as const, label: "Fotos", icon: <Image className="w-4 h-4" /> },
    { key: "posts" as const, label: "Textos", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Admin toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleAdmin}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        style={{ boxShadow: "0 0 20px hsl(174 100% 50% / 0.5)" }}
      >
        {isAdmin ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
      </motion.button>

      {/* Admin panel */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-40 h-full w-full max-w-md glass border-l border-border overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="font-display text-lg tracking-widest neon-text-cyan mb-6">
                ADMINISTRAR
              </h2>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-display tracking-wide transition-all ${
                      tab === t.key
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Profile tab */}
              {tab === "profile" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-display tracking-wide">NOMBRE</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full mt-1 p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-display tracking-wide">TAGLINE</label>
                    <input
                      value={editTagline}
                      onChange={(e) => setEditTagline(e.target.value)}
                      className="w-full mt-1 p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-display tracking-wide">URL FOTO DE PERFIL</label>
                    <input
                      value={editProfileImg}
                      onChange={(e) => setEditProfileImg(e.target.value)}
                      className="w-full mt-1 p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-display tracking-wide">URL BANNER</label>
                    <input
                      value={editBannerImg}
                      onChange={(e) => setEditBannerImg(e.target.value)}
                      className="w-full mt-1 p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                      placeholder="https://..."
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-sm hover:opacity-90 transition-opacity"
                  >
                    GUARDAR PERFIL
                  </button>
                </div>
              )}

              {/* Links tab */}
              {tab === "links" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <input
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      placeholder="Título del link"
                      className="w-full p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                    <input
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="URL (https://...)"
                      className="w-full p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                    <input
                      value={newLinkDesc}
                      onChange={(e) => setNewLinkDesc(e.target.value)}
                      placeholder="Descripción (opcional)"
                      className="w-full p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={handleAddLink}
                      className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
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
                        <button
                          onClick={() => removeLink(link.id)}
                          className="text-destructive hover:opacity-70 transition-opacity shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery tab */}
              {tab === "gallery" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-display tracking-wide mb-2 block">SUBIR IMAGEN</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-display file:text-xs file:tracking-wide file:cursor-pointer"
                    />
                  </div>

                  <div className="text-center text-xs text-muted-foreground font-display tracking-wide">— O —</div>

                  <div className="space-y-3">
                    <input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="URL de imagen (https://...)"
                      className="w-full p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                    <input
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                      placeholder="Descripción (opcional)"
                      className="w-full p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={handleAddImage}
                      className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-4 h-4" /> AGREGAR POR URL
                    </button>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground font-display tracking-wide mb-2">FOTOS ACTUALES</p>
                    <div className="grid grid-cols-3 gap-2">
                      {data.gallery.map((img) => (
                        <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeGalleryImage(img.id)}
                            className="absolute inset-0 bg-destructive/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-5 h-5 text-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Posts tab */}
              {tab === "posts" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Escribe un texto, anuncio o pega un enlace..."
                      rows={4}
                      className="w-full p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary resize-none"
                    />
                    <button
                      onClick={handleAddPost}
                      className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-4 h-4" /> PUBLICAR
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
                          <p className="text-sm text-foreground whitespace-pre-wrap flex-1">{post.content}</p>
                          <button
                            onClick={() => removePost(post.id)}
                            className="text-destructive hover:opacity-70 transition-opacity shrink-0 mt-0.5"
                          >
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
