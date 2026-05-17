import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Link2, Upload, X, Pencil, Save, Trash2 } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { uploadFile } from "@/lib/supabase-helpers";
import { isValidHttpUrl } from "@/lib/url-validation";
import { SectionHeader, inputClass } from "./shared";
import { toast } from "@/hooks/use-toast";

interface Props {
  uploading: boolean;
  setUploading: (v: boolean) => void;
}

const LinksTab = ({ uploading, setUploading }: Props) => {
  const { data, addLink, updateLink, removeLink } = useSite();
  const [formOpen, setFormOpen] = useState(true);
  const [listOpen, setListOpen] = useState(false);

  // New link
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // Edit link
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDesc, setEditDesc] = useState("");
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
    if (!title || !url) return;
    if (!isValidHttpUrl(url)) {
      toast({ title: "URL inválida", description: "Solo se permiten URLs http:// o https://", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      let imgUrl: string | undefined;
      if (imageFile) imgUrl = await uploadFile(imageFile, "site-assets", `links/${Date.now()}-${imageFile.name}`);
      await addLink({ title, url, description: desc, image: imgUrl });
      setTitle(""); setUrl(""); setDesc("");
      setImageFile(null); setImagePreview(null);
      if (imageRef.current) imageRef.current.value = "";
    } finally { setUploading(false); }
  };

  const startEdit = (link: typeof data.links[0]) => {
    setEditId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditDesc(link.description);
    setEditImagePreview(link.image || null);
    setEditImageFile(null);
  };

  const handleSaveEdit = async () => {
    if (!editId || !editTitle || !editUrl) return;
    if (!isValidHttpUrl(editUrl)) {
      toast({ title: "URL inválida", description: "Solo se permiten URLs http:// o https://", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      let imgUrl: string | undefined;
      if (editImageFile) {
        imgUrl = await uploadFile(editImageFile, "site-assets", `links/${Date.now()}-${editImageFile.name}`);
      }
      await updateLink(editId, {
        title: editTitle,
        url: editUrl,
        description: editDesc,
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

  const ImagePicker = ({ preview, onSelect, onClear, inputRef, label = "Imagen (opcional)" }: { preview: string | null; onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear: () => void; inputRef: React.RefObject<HTMLInputElement>; label?: string }) => (
    <div>
      <label className="text-[10px] text-muted-foreground font-display tracking-wide mb-1 block">{label.toUpperCase()}</label>
      {preview && (
        <div className="relative mb-2 inline-block">
          <img src={preview} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-primary/30" />
          <button onClick={onClear} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <button onClick={() => inputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs text-foreground hover:border-primary transition-colors">
        <Upload className="w-3 h-3" /> Subir imagen
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onSelect} />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      {/* Add new */}
      <SectionHeader open={formOpen} onToggle={() => setFormOpen(v => !v)} icon={<Plus className="w-4 h-4" />} label="NUEVO LINK" />
      <AnimatePresence>
        {formOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del link" className={inputClass} />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL (https://...)" className={inputClass} />
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripción (opcional)" className={inputClass} />
            <ImagePicker
              preview={imagePreview}
              onSelect={(e) => selectImage(e, setImageFile, setImagePreview)}
              onClear={() => { setImageFile(null); setImagePreview(null); if (imageRef.current) imageRef.current.value = ""; }}
              inputRef={imageRef}
            />
            <button onClick={handleAdd} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_15px_hsl(174_100%_50%/0.2)]">
              <Plus className="w-4 h-4" /> AGREGAR LINK
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <SectionHeader open={listOpen} onToggle={() => setListOpen(v => !v)} icon={<Link2 className="w-4 h-4" />} label="LINKS ACTUALES" count={data.links.length} />
      <AnimatePresence>
        {listOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
            {data.links.map((link, i) => (
              <motion.div key={link.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-all">
                {editId === link.id ? (
                  <div className="space-y-2">
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Título" className={`${inputClass} !p-2 !text-xs`} />
                    <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="URL" className={`${inputClass} !p-2 !text-xs`} />
                    <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Descripción" className={`${inputClass} !p-2 !text-xs`} />
                    <ImagePicker
                      preview={editImagePreview}
                      onSelect={(e) => selectImage(e, setEditImageFile, setEditImagePreview)}
                      onClear={() => { setEditImageFile(null); setEditImagePreview(null); if (editImageRef.current) editImageRef.current.value = ""; }}
                      inputRef={editImageRef}
                      label="Cambiar imagen (opcional)"
                    />
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
                  <div className="flex items-center gap-2">
                    {link.image && <img src={link.image} alt="" className="w-10 h-10 rounded-md object-cover border border-border shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{link.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <button onClick={() => startEdit(link)} className="text-muted-foreground hover:text-primary transition-colors shrink-0 p-1.5 rounded-md hover:bg-primary/10" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeLink(link.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1.5 rounded-md hover:bg-destructive/10" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
            {data.links.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No hay links aún</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LinksTab;
