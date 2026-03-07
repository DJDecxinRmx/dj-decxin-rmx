import { motion } from "framer-motion";
import { ExternalLink, MessageSquare } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import PostInteractions from "./PostInteractions";

const PostsSection = () => {
  const { data } = useSite();

  if (data.posts.length === 0) return null;

  const extractFirstUrl = (text: string): string | null => {
    const match = text.match(/(https?:\/\/[^\s]+)/);
    return match ? match[0] : null;
  };

  const renderContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:neon-text-cyan transition-all break-all"
        >
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <section id="posts" className="px-4 py-12 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-3 mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <MessageSquare className="w-5 h-5 text-secondary" />
        </motion.div>
        <h2 className="font-display text-xl tracking-widest neon-text-magenta text-center">
          NOVEDADES
        </h2>
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 1 }}
        >
          <MessageSquare className="w-5 h-5 text-secondary" />
        </motion.div>
      </motion.div>

      <div className="flex flex-col gap-5">
        {data.posts.map((post, index) => {
          const firstUrl = extractFirstUrl(post.content);
          const imageIsLink = !!post.image && !!firstUrl;

          return (
            <motion.div
              key={post.id}
              initial={{ y: 40, opacity: 0, scale: 0.92 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, type: "spring", stiffness: 90, damping: 15 }}
              whileHover={{
                boxShadow: "0 0 25px hsl(320 100% 60% / 0.35), 0 0 50px hsl(174 100% 50% / 0.15)",
              }}
              className="glass rounded-xl overflow-hidden border border-border hover:border-secondary/50 transition-all duration-500 group relative"
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {/* Scan lines */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(320_100%_60%/0.02)_2px,hsl(320_100%_60%/0.02)_4px)]" />
              </div>

              {/* Image - clickable if there's a URL */}
              {post.image && (
                <div className="relative overflow-hidden">
                  {imageIsLink ? (
                    <a href={firstUrl!} target="_blank" rel="noopener noreferrer" className="block relative">
                      <motion.img
                        src={post.image}
                        alt=""
                        className="w-full h-52 object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                      {/* Link indicator badge */}
                      <motion.div
                        className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass border border-primary/50 text-primary"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-[10px] font-display tracking-wider">ABRIR</span>
                      </motion.div>
                    </a>
                  ) : (
                    <div className="relative">
                      <motion.img
                        src={post.image}
                        alt=""
                        className="w-full h-52 object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                    </div>
                  )}
                </div>
              )}

              <div className="relative p-4">
                {post.content && (
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {renderContent(post.content)}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-muted-foreground font-display tracking-wide">
                    {new Date(post.createdAt).toLocaleDateString("es", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" · "}
                    {new Date(post.createdAt).toLocaleTimeString("es", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-secondary"
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <PostInteractions postId={post.id} />
              </div>

              {/* Bottom neon line */}
              <motion.div
                className="h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PostsSection;
