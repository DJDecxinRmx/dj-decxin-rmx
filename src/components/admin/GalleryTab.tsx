import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Image, Upload, Trash2, Camera } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { uploadFile } from "@/lib/supabase-helpers";
import { isValidHttpUrl } from "@/lib/url-validation";
import { SectionHeader, inputClass } from "./shared";
import { toast } from "@/hooks/use-toast";

interface Props {
  uploading: boolean;
  setUploading: (v: boolean) => void;
}

const GalleryTab = ({ uploading, setUploading }: Props) => {
  const { data, addGalleryImage, removeGalleryImage } = useSite();
  const [formOpen, setFormOpen] = useState(true);
  const [listOpen, setListOpen] = useState(false);
  const [alt, setAlt] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (link && !isValidHttpUrl(link)) {
      toast({ title: "Enlace inválido", description: "Solo se permiten URLs http:// o https://", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const url = await uploadFile(selectedFile, "site-assets", `gallery/${Date.now()}-${selectedFile.name}`);
      await addGalleryImage(url, alt || "Foto", desc || undefined, link || undefined);
      setAlt(""); setDesc(""); setLink(""); setPreview(null); setSelectedFile(null);
    } finally { setUploading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <SectionHeader open={formOpen} onToggle={() => setFormOpen(v => !v)} icon={<Plus className="w-4 h-4" />} label="SUBIR FOTO" />
      <AnimatePresence>
        {formOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
            <span className="text-[10px] text-muted-foreground font-display tracking-wide">SELECCIONAR IMAGEN</span>
            <label className="w-full py-6 rounded-lg border-2 border-dashed border-border active:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 transition-colors active:bg-primary/10 cursor-pointer block">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-md" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Toca para abrir galería</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleSelectFile} />
            </label>
            {preview && (
              <>
                <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Nombre / título (opcional)" className={inputClass} />
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripción (opcional)" rows={2} className={`${inputClass} resize-none`} />
                <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Enlace (opcional, https://...)" className={inputClass} />
                <button onClick={handleUpload} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_15px_hsl(174_100%_50%/0.2)]">
                  <Upload className="w-4 h-4" /> SUBIR FOTO
                </button>
              </>
            )}
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
  );
};

export default GalleryTab;
