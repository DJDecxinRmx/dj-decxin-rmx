import { motion } from "framer-motion";
import { useSite } from "@/context/SiteContext";

const PostsSection = () => {
  const { data } = useSite();

  if (data.posts.length === 0) return null;

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
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-display text-xl tracking-widest neon-text-magenta text-center mb-8"
      >
        NOVEDADES
      </motion.h2>

      <div className="flex flex-col gap-4">
        {data.posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ 
              boxShadow: "0 0 20px hsl(320 100% 60% / 0.3), 0 0 40px hsl(174 100% 50% / 0.1)",
            }}
            className="glass rounded-lg overflow-hidden border border-border hover:border-secondary/50 transition-all duration-500 group"
          >
            {post.image && (
              <div className="relative overflow-hidden">
                <motion.img
                  src={post.image}
                  alt=""
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )}
            <div className="p-4">
              {post.content && (
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {renderContent(post.content)}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-3 font-display tracking-wide">
                {new Date(post.createdAt).toLocaleDateString("es", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PostsSection;
