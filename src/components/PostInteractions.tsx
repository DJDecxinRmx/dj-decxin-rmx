import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Send, Trash2, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSite } from "@/context/SiteContext";

// Generate a stable visitor ID
const getVisitorId = () => {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
};

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

const StarRating = ({ postId }: { postId: string }) => {
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hover, setHover] = useState(0);

  const loadRatings = useCallback(async () => {
    const { data } = await supabase.from("post_ratings").select("rating, visitor_id").eq("post_id", postId);
    if (data) {
      setCount(data.length);
      setAvg(data.length > 0 ? data.reduce((s, r) => s + r.rating, 0) / data.length : 0);
      const mine = data.find((r) => r.visitor_id === getVisitorId());
      if (mine) setUserRating(mine.rating);
    }
  }, [postId]);

  useEffect(() => { loadRatings(); }, [loadRatings]);

  const handleRate = async (value: number) => {
    const visitorId = getVisitorId();
    setUserRating(value);
    await supabase.from("post_ratings").upsert(
      { post_id: postId, rating: value, visitor_id: visitorId },
      { onConflict: "post_id,visitor_id" }
    );
    loadRatings();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRate(star)}
            className="p-0.5 transition-transform hover:scale-125"
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                (hover || userRating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : avg >= star
                  ? "text-yellow-400/50 fill-yellow-400/30"
                  : "text-muted-foreground/40"
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground font-mono">
        {avg > 0 ? avg.toFixed(1) : "—"} ({count})
      </span>
    </div>
  );
};

const PostComments = ({ postId }: { postId: string }) => {
  const { isAdmin, user } = useSite();
  const [comments, setComments] = useState<Comment[]>([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuario";

  const loadComments = useCallback(async () => {
    const { data } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) setComments(data);
  }, [postId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${postId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "post_comments", filter: `post_id=eq.${postId}` }, () => loadComments())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [postId, loadComments]);

  const handleSignInWithGoogle = async () => {
    setSigningIn(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const handleSubmit = async () => {
    if (!text.trim() || !user) return;
    setSending(true);
    await supabase.from("post_comments").insert({
      post_id: postId,
      author_name: userName,
      content: text.trim(),
    });
    setText("");
    setSending(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("post_comments").delete().eq("id", id);
  };

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span className="font-display tracking-wide">
          {comments.length > 0 ? `${comments.length} comentario${comments.length > 1 ? "s" : ""}` : "Comentar"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              {comments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-display tracking-wide text-primary">{c.author_name}</span>
                      <span className="text-[9px] text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString("es", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80 mt-0.5 whitespace-pre-wrap">{c.content}</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDelete(c.id)} className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:bg-destructive/10 rounded transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              ))}

              {/* Comment form or sign-in prompt */}
              {user ? (
                <div className="flex flex-col gap-2 pt-1">
                  <p className="text-[10px] text-muted-foreground font-display tracking-wide">
                    Comentando como <span className="text-primary">{userName}</span>
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder="Escribe un comentario..."
                      className="flex-1 p-2 rounded-lg bg-background/80 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={sending || !text.trim()}
                      className="px-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSignInWithGoogle}
                  disabled={signingIn}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="font-display tracking-wide">Inicia sesión con Google para comentar</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PostInteractions = ({ postId }: { postId: string }) => (
  <div className="space-y-2">
    <StarRating postId={postId} />
    <PostComments postId={postId} />
  </div>
);

export default PostInteractions;
