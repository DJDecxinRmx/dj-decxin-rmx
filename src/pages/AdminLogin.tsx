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
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const inputClass =
    "w-full p-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        const { data, error: signupError } = await supabase.auth.signUp({ email, password });
        if (signupError) throw signupError;
        if (data.user) {
          // Assign admin role to first user
          const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true });
          if (count === 0) {
            await supabase.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
          }
          navigate("/");
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        navigate("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al autenticar";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm glass rounded-2xl p-8 border border-border"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary flex items-center justify-center"
            style={{ boxShadow: "0 0 30px hsl(174 100% 50% / 0.3)" }}>
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-xl tracking-widest neon-text-cyan">
            {isSignup ? "CREAR CUENTA ADMIN" : "PANEL ADMIN"}
          </h1>
          <p className="text-xs text-muted-foreground text-center font-display tracking-wide">
            {isSignup
              ? "Crea tu cuenta de administrador"
              : "Accede para gestionar tu página"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email"
            required
            className={inputClass}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            minLength={6}
            className={inputClass}
          />
          {error && (
            <p className="text-xs text-destructive font-display tracking-wide text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSignup ? "CREAR CUENTA" : "ENTRAR"}
          </button>
        </form>

        <button
          onClick={() => { setIsSignup(!isSignup); setError(""); }}
          className="w-full mt-4 text-xs text-muted-foreground hover:text-primary transition-colors font-display tracking-wide"
        >
          {isSignup ? "¿Ya tienes cuenta? Iniciar sesión" : "¿Primera vez? Crear cuenta admin"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Volver a la página
        </button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
