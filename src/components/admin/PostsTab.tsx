import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Upload, X, Pencil, Save, Trash2, Loader2 } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { uploadFile } from "@/lib/supabase-helpers";
import { SectionHeader, inputClass, formatDate } from "./shared";

interface Props {
  uploading: boolean;
  setUploading: (v: boolean) => void;
}

const PostsTab = ({ uploading, setUploading }: Props) => {
  const { data, addPost, updatePost, removePost } = useSite();
  const [formOpen, setFormOpen] = useState(true);
  const [listOpen, setListOpen] = useState(false);

  // New post
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // Edit post
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const editImageRef = useRef<HTMLInputElement>(null);

  const selectImage = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File | null) => void, setPreview: (s: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {
    if (!content.trim() && !imageFile) return;
    setUploading(true);
    try {
      let imgUrl: string | undefined;
      if (imageFile) imgUrl = await uploadFile(imageFile, "site-assets", `posts/${Date.now()}-${imageFile.name}`);
      await addPost(content, imgUrl);
      setContent(""); setImageUrl(null); setImageFile(null);
      if (imageRef.current) imageRef.current.value = "";
    } finally { setUploading(false); }
  };

  const startEdit = (post: typeof data.posts[0]) => {
    setEditId(post.id);
    setEditContent(post.content);
    setEditImagePreview(post.image || null);
    setEditImageFile(null);
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    setUploading(true);
    try {
      let imgUrl: string | undefined;
      if (editImageFile) {
        imgUrl = await uploadFile(editImageFile, "site-assets", `posts/${Date.now()}-${editImageFile.name}`);
      }
      await updatePost(editId, {
        content: editContent,
        ...(editImageFile ? { image: imgUrl } : {}),
      });
      setEditId(null);
      setEditImageFile(null);
      setEditImagePreview(null);
    } finally { setUploading(false); }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <SectionHeader open={formOpen} onToggle={() => setFormOpen(v => !v)} icon={<Plus className="w-4 h-4" />} label="NUEVO TEXTO" />
      <AnimatePresence>
        {formOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribe un texto, anuncio o pega un enlace..." rows={3} className={`${inputClass} resize-none`} />
            <div>
              <label className="text-[10px] text-muted-foreground font-display tracking-wide mb-1 block">IMAGEN (OPCIONAL)</label>
              <button onClick={() => imageRef.current?.click()} className="w-full py-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 transition-colors active:bg-primary/10 relative">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Preview" className="w-full h-28 object-cover rounded-md" />
                    <button onClick={(e) => { e.stopPropagation(); setImageUrl(null); setImageFile(null); if (imageRef.current) imageRef.current.value = ""; }} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Toca para elegir foto</span>
                  </>
                )}
              </button>
              <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => selectImage(e, setImageFile, setImageUrl)} />
            </div>
            <button onClick={handleAdd} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_15px_hsl(174_100%_50%/0.2)]">
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
                {editId === post.id ? (
                  <div className="space-y-2">
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={4} className={`${inputClass} resize-none !text-xs`} />
                    <div>
                      <label className="text-[10px] text-muted-foreground font-display tracking-wide mb-1 block">CAMBIAR IMAGEN (OPCIONAL)</label>
                      <button onClick={() => editImageRef.current?.click()} className="w-full py-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 transition-colors active:bg-primary/10 relative">
                        {editImagePreview ? (
                          <>
                            <img src={editImagePreview} alt="Preview" className="w-full h-20 object-cover rounded-md" />
                            <button onClick={(e) => { e.stopPropagation(); setEditImageFile(null); setEditImagePreview(null); if (editImageRef.current) editImageRef.current.value = ""; }} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Toca para elegir</span>
                          </>
                        )}
                      </button>
                      <input ref={editImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => selectImage(e, setEditImageFile, setEditImagePreview)} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSaveEdit} disabled={uploading} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-[11px] font-display tracking-wide flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-50">
                        <Save className="w-3 h-3" /> GUARDAR
                      </button>
                      <button onClick={cancelEdit} className="px-3 py-2 rounded-lg bg-muted border border-border text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                        CANCELAR
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {post.image && <img src={post.image} alt="" className="w-full h-20 object-cover rounded-md mb-2 border border-border" />}
                        <p className="text-xs text-foreground whitespace-pre-wrap line-clamp-3">{post.content}</p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button onClick={() => startEdit(post)} className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-md hover:bg-primary/10" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => removePost(post.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{formatDate(post.createdAt)}</p>
                  </>
                )}
              </motion.div>
            ))}
            {data.posts.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No hay publicaciones aún</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostsTab;
