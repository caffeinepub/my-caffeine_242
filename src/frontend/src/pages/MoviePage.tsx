import { Button } from "@/components/ui/button";
import { type Movie, getMovies } from "@/lib/storage";
import { useParams, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Film } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

function getDropboxEmbedUrl(url: string): string {
  // Convert Dropbox share links to raw/direct links
  return url
    .replace("www.dropbox.com", "dl.dropboxusercontent.com")
    .replace("?dl=0", "?raw=1")
    .replace("dl=0", "raw=1");
}

export default function MoviePage() {
  const router = useRouter();
  const { id } = useParams({ from: "/movie/$id" });
  const [movie, setMovie] = useState<Movie | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    const movies = getMovies();
    const found = movies.find((m) => m.id === Number(id));
    if (found) {
      setMovie(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen cinema-bg flex flex-col items-center justify-center">
        <Film
          className="w-16 h-16 mb-4 opacity-30"
          style={{ color: "oklch(0.72 0.18 55)" }}
        />
        <h2 className="font-ui text-xl font-semibold text-foreground mb-2">
          Кино олдсонгүй
        </h2>
        <p className="text-muted-foreground mb-6">
          Тухайн кино устгагдсан байж болзошгүй
        </p>
        <Button
          onClick={() => router.navigate({ to: "/" })}
          style={{
            background: "oklch(0.72 0.18 55)",
            color: "oklch(0.1 0.01 280)",
          }}
        >
          Нүүр хуудас руу буцах
        </Button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen cinema-bg flex items-center justify-center">
        <span
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{
            borderColor: "oklch(0.72 0.18 55)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  const embedUrl = getDropboxEmbedUrl(movie.videoUrl);
  const isDropbox =
    movie.videoUrl.includes("dropbox.com") ||
    movie.videoUrl.includes("dropboxusercontent.com");

  return (
    <div data-ocid="player.page" className="min-h-screen cinema-bg">
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center gap-4 px-6 py-4"
        style={{
          background: "oklch(0.08 0.008 280 / 0.9)",
          borderBottom: "1px solid oklch(0.22 0.02 280)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Button
          data-ocid="player.back_button"
          variant="ghost"
          size="sm"
          onClick={() => router.navigate({ to: "/" })}
          className="gap-2 font-ui"
          style={{ color: "oklch(0.72 0.18 55)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Буцах
        </Button>

        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center"
            style={{
              background: "oklch(0.72 0.18 55 / 0.15)",
              border: "1px solid oklch(0.72 0.18 55 / 0.3)",
            }}
          >
            <Film
              className="w-4 h-4"
              style={{ color: "oklch(0.72 0.18 55)" }}
            />
          </div>
          <span className="font-display text-lg font-bold gold-text truncate">
            Хятад Драма
          </span>
        </div>
      </header>

      {/* Player */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Movie title */}
          <h1 className="font-display text-3xl font-bold text-foreground mb-2 gold-text">
            {movie.title}
          </h1>
          <div
            className="w-16 h-0.5 mb-8 rounded-full"
            style={{ background: "oklch(0.72 0.18 55)" }}
          />

          {/* Video player area */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.08 0.008 280)",
              border: "1px solid oklch(0.22 0.02 280)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            }}
          >
            {/* Aspect ratio container 16:9 */}
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              {iframeError ? (
                /* Fallback: poster with open-in-new link */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                  {movie.posterUrl && (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="max-h-64 rounded-lg object-cover opacity-50"
                    />
                  )}
                  <div className="text-center px-4">
                    <p className="text-sm text-muted-foreground mb-4 font-body">
                      Суулгагч дотор тоглуулах боломжгүй байна
                    </p>
                    <a
                      href={movie.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-ui font-semibold text-sm transition-opacity hover:opacity-90"
                      style={{
                        background: "oklch(0.72 0.18 55)",
                        color: "oklch(0.1 0.01 280)",
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Dropbox-д үзэх
                    </a>
                  </div>
                </div>
              ) : isDropbox ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={embedUrl}
                  title={movie.title}
                  allow="fullscreen"
                  allowFullScreen
                  onError={() => setIframeError(true)}
                />
              ) : (
                <video
                  className="absolute inset-0 w-full h-full"
                  src={movie.videoUrl}
                  controls
                  poster={movie.posterUrl}
                  onError={() => setIframeError(true)}
                >
                  <track kind="captions" />
                  Таны хөтөч видео тоглуулахыг дэмждэггүй байна
                </video>
              )}
            </div>
          </div>

          {/* Direct link */}
          <div
            className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "oklch(0.13 0.015 280)",
              border: "1px solid oklch(0.22 0.02 280)",
            }}
          >
            <ExternalLink
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "oklch(0.72 0.18 55)" }}
            />
            <span className="text-sm text-muted-foreground font-body flex-1 truncate">
              {movie.videoUrl}
            </span>
            <a
              href={movie.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-ui font-medium flex-shrink-0 hover:underline"
              style={{ color: "oklch(0.72 0.18 55)" }}
            >
              Нээх
            </a>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className="mt-16 py-6 text-center text-xs text-muted-foreground font-body"
        style={{ borderTop: "1px solid oklch(0.18 0.02 280)" }}
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "oklch(0.72 0.18 55)" }}
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
