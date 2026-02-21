import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const inputClass =
    "w-full p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw loginError;
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al autenticar";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(174 100% 50%), transparent 70%)", top: "-10%", left: "-10%" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(320 100% 60%), transparent 70%)", bottom: "-5%", right: "-5%" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(hsl(174 100% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(174 100% 50%) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm glass rounded-2xl p-8 border border-border relative"
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-50 -z-10"
          style={{
            background: "linear-gradient(var(--angle, 0deg), hsl(174 100% 50% / 0.3), hsl(320 100% 60% / 0.3), hsl(174 100% 50% / 0.3))",
          }}
          animate={{ "--angle": ["0deg", "360deg"] } as any}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        <div className="flex flex-col items-center gap-4 mb-8">
          <motion.div
            className="w-16 h-16 rounded-full bg-primary/10 border border-primary flex items-center justify-center"
            style={{ boxShadow: "0 0 30px hsl(174 100% 50% / 0.3)" }}
            animate={{ boxShadow: ["0 0 20px hsl(174 100% 50% / 0.2)", "0 0 40px hsl(174 100% 50% / 0.5)", "0 0 20px hsl(174 100% 50% / 0.2)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lock className="w-7 h-7 text-primary" />
          </motion.div>
          <h1 className="font-display text-xl tracking-widest neon-text-cyan">
            PANEL ADMIN
          </h1>
          <p className="text-xs text-muted-foreground text-center font-display tracking-wide">
            Accede para gestionar tu página
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              required
              className={inputClass}
            />
          </motion.div>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              minLength={6}
              className={inputClass}
            />
          </motion.div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-destructive font-display tracking-wide text-center"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ boxShadow: "0 0 20px hsl(174 100% 50% / 0.3)" }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            ENTRAR
          </motion.button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Volver a la página
        </button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
