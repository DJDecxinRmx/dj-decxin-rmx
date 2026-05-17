import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Lock, Loader2, Disc3, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "brayanvega239@gmail.com";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // If already logged in as admin, redirect
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (roleData) navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });
      if (loginError) throw loginError;
      if (!authData.session) throw new Error("No se pudo iniciar sesión");

      // Verify admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        throw new Error("No tienes permisos de administrador");
      }

      // Small delay so SiteContext picks up the session
      await new Promise((r) => setTimeout(r, 500));
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Contraseña incorrecta";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Panel Admin | DJ Decxin Remix</title>
        <meta name="description" content="Acceso administrativo al sitio oficial de DJ Decxin Rmx." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://dj-decxin-rmx.lovable.app/admin-login" />
        <meta property="og:title" content="Panel Admin | DJ Decxin Remix" />
        <meta property="og:url" content="https://dj-decxin-rmx.lovable.app/admin-login" />
      </Helmet>
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(174 100% 50%), transparent 70%)", top: "-15%", left: "-10%" }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.06, 0.18, 0.06], x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(320 100% 60%), transparent 70%)", bottom: "-10%", right: "-5%" }}
          animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.05, 0.15, 0.05], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, hsl(174 100% 50%), transparent 70%)", top: "50%", left: "60%" }}
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.03, 0.1, 0.03] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(hsl(174 100% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(174 100% 50%) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? "hsl(174 100% 50%)" : "hsl(320 100% 60%)",
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              boxShadow: i % 2 === 0 ? "0 0 8px hsl(174 100% 50% / 0.8)" : "0 0 8px hsl(320 100% 60% / 0.8)",
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 5 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm glass rounded-2xl p-8 border border-border relative"
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-50 -z-10"
          style={{
            background: "linear-gradient(var(--angle, 0deg), hsl(174 100% 50% / 0.4), hsl(320 100% 60% / 0.4), hsl(174 100% 50% / 0.1), hsl(320 100% 60% / 0.4))",
          }}
          animate={{ "--angle": ["0deg", "360deg"] } as any}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Spinning disc icon */}
          <motion.div
            className="relative w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center"
            style={{ boxShadow: "0 0 40px hsl(174 100% 50% / 0.4), inset 0 0 20px hsl(174 100% 50% / 0.1)" }}
            animate={{
              boxShadow: [
                "0 0 20px hsl(174 100% 50% / 0.2), inset 0 0 10px hsl(174 100% 50% / 0.05)",
                "0 0 50px hsl(174 100% 50% / 0.6), inset 0 0 25px hsl(174 100% 50% / 0.15)",
                "0 0 20px hsl(174 100% 50% / 0.2), inset 0 0 10px hsl(174 100% 50% / 0.05)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Disc3 className="w-9 h-9 text-primary" />
            </motion.div>
            {/* Orbiting dot */}
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-secondary"
              style={{ boxShadow: "0 0 10px hsl(320 100% 60% / 0.8)" }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              initial={{ x: 36, y: 0 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="font-display text-xl tracking-widest neon-text-cyan flex items-center gap-2 justify-center">
              <Zap className="w-4 h-4" />
              PANEL ADMIN
              <Zap className="w-4 h-4" />
            </h1>
            <motion.p
              className="text-xs text-muted-foreground mt-2 font-display tracking-wide"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Ingresa tu contraseña para acceder
            </motion.p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/30"
            >
              <p className="text-xs text-destructive font-display tracking-wide text-center">
                {error}
              </p>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(174 100% 50% / 0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display tracking-widest text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 relative overflow-hidden"
            style={{ boxShadow: "0 0 25px hsl(174 100% 50% / 0.3)" }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span className="relative z-10">ENTRAR</span>
          </motion.button>
        </form>

        <motion.button
          onClick={() => navigate("/")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ x: -3 }}
          className="w-full mt-5 text-xs text-muted-foreground hover:text-foreground transition-colors font-display tracking-wide"
        >
          ← Volver a la página
        </motion.button>
      </motion.div>
    </main>
  );
};

export default AdminLogin;
