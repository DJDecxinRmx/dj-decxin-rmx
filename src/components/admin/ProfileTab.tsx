import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Upload } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { uploadFile } from "@/lib/supabase-helpers";
import { SectionHeader, inputClass } from "./shared";

interface Props {
  uploading: boolean;
  setUploading: (v: boolean) => void;
}

const ProfileTab = ({ uploading, setUploading }: Props) => {
  const { data, updateProfile } = useSite();
  const [formOpen, setFormOpen] = useState(true);
  const [editName, setEditName] = useState(data.profile.name);
  const [editTagline, setEditTagline] = useState(data.profile.tagline);
  const profileFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "profileImage" | "bannerImage", folder: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "site-assets", `${folder}/${Date.now()}-${file.name}`);
      await updateProfile({ ...data.profile, [field]: url });
    } finally { setUploading(false); }
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      await updateProfile({ ...data.profile, name: editName, tagline: editTagline });
    } finally { setUploading(false); }
  };

  return (
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
              <button onClick={() => profileFileRef.current?.click()} className="mt-1 w-full py-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex items-center justify-center gap-3 transition-colors active:bg-primary/10">
                {data.profile.profileImage ? (
                  <img src={data.profile.profileImage} alt="Perfil" className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                ) : (
                  <Upload className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground">Toca para cambiar</span>
              </button>
              <input ref={profileFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "profileImage", "profile")} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground font-display tracking-wide">BANNER</label>
              <button onClick={() => bannerFileRef.current?.click()} className="mt-1 w-full py-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 transition-colors active:bg-primary/10">
                {data.profile.bannerImage ? (
                  <img src={data.profile.bannerImage} alt="Banner" className="w-full h-20 rounded-lg object-cover" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Toca para subir banner</span>
                  </>
                )}
              </button>
              <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "bannerImage", "banner")} />
            </div>
            <button onClick={handleSave} disabled={uploading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-xs hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_15px_hsl(174_100%_50%/0.2)]">
              GUARDAR PERFIL
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileTab;
