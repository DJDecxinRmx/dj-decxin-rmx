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
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-lg overflow-hidden border border-border"
          >
            {post.image && (
              <img
                src={post.image}
                alt=""
                className="w-full h-48 object-cover"
                loading="lazy"
              />
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
