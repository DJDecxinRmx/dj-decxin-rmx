import { useMemo } from "react";
import { MessageSquare, Download } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import PostInteractions from "./PostInteractions";

const PostsSection = () => {
  const { data } = useSite();

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

  const posts = useMemo(() => data.posts, [data.posts]);

  if (posts.length === 0) return null;

  return (
    <section id="posts" className="px-4 py-12 max-w-lg mx-auto">
      <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
        <MessageSquare className="w-5 h-5 text-secondary animate-pulse-glow" />
        <h2 className="font-display text-xl tracking-widest neon-text-magenta text-center">
          NOVEDADES
        </h2>
        <MessageSquare className="w-5 h-5 text-secondary animate-pulse-glow" />
      </div>

      <div className="flex flex-col gap-5">
        {posts.map((post) => {
          const firstUrl = extractFirstUrl(post.content);
          const hasImageAndLink = !!post.image && !!firstUrl;
          const hasImage = !!post.image;

          return (
            <div
              key={post.id}
              className="glass rounded-xl overflow-hidden border border-border hover:border-secondary/50 transition-all duration-300 group relative neon-border-animated neon-border-animated-subtle animate-fade-in"
            >
              {/* Image - shows FULL, no crop, no opacity overlay */}
              {hasImage && (
                <div className="relative">
                  {hasImageAndLink ? (
                    <a href={firstUrl!} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={post.image}
                        alt=""
                        className="w-full h-auto object-contain bg-black/20 group-hover:brightness-110 transition-all duration-500"
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-auto object-contain bg-black/20 group-hover:brightness-110 transition-all duration-500"
                      loading="lazy"
                    />
                  )}
                </div>
              )}

              {/* If NO image but has a link — show a mini download thumbnail card */}
              {!hasImage && firstUrl && (
                <a
                  href={firstUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 mx-4 mt-4 rounded-lg bg-primary/10 border border-primary/30 hover:border-primary/60 transition-all group/dl"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 group-hover/dl:bg-primary/30 transition-colors">
                    <Download className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-display tracking-wide text-primary truncate">DESCARGAR</p>
                    <p className="text-[10px] text-muted-foreground truncate">{firstUrl}</p>
                  </div>
                  <Download className="w-4 h-4 text-primary animate-pulse-glow shrink-0" />
                </a>
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
                      hour12: true,
                    })}
                  </p>
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-glow" />
                </div>
                <PostInteractions postId={post.id} />
              </div>

              {/* Bottom neon line */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PostsSection;
