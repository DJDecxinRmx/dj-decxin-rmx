import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const getVisitorId = () => {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
};

const PostInteractions = ({ postId }: { postId: string }) => {
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
        {[1, 2, 3, 4, 5].map((heart) => (
          <motion.button
            key={heart}
            onMouseEnter={() => setHover(heart)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRate(heart)}
            whileTap={{ scale: 1.4 }}
            className="p-0.5 transition-transform hover:scale-125"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                (hover || userRating) >= heart
                  ? "text-primary fill-primary"
                  : avg >= heart
                  ? "text-primary/50 fill-primary/30"
                  : "text-muted-foreground/40"
              }`}
            />
          </motion.button>
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground font-mono">
        {avg > 0 ? avg.toFixed(1) : "—"} ({count})
      </span>
    </div>
  );
};

export default PostInteractions;
