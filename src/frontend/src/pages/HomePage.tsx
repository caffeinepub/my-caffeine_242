import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type Movie,
  getMovies,
  setAdminSession,
  validateAdmin,
} from "@/lib/storage";
import { useRouter } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Film,
  LogIn,
  Settings,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useEffect, useState } from "react";

const PAGE_SIZE = 20;

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function HomePage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    setMovies(getMovies());
  }, []);

  const totalPages = Math.max(1, Math.ceil(movies.length / PAGE_SIZE));
  const pageMovies = movies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleMovieClick = (movie: Movie) => {
    router.navigate({ to: "/movie/$id", params: { id: String(movie.id) } });
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError("");
    await new Promise((r) => setTimeout(r, 300));

    if (validateAdmin(adminUsername, adminPassword)) {
      setAdminSession();
      setAdminModalOpen(false);
      setAdminUsername("");
      setAdminPassword("");
      router.navigate({ to: "/admin" });
    } else {
      setAdminError("Нэвтрэх нэр эсвэл нууц үг буруу байна");
    }
    setAdminLoading(false);
  };

  return (
    <div className="min-h-screen cinema-bg">
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background: "oklch(0.08 0.008 280 / 0.9)",
          borderBottom: "1px solid oklch(0.22 0.02 280)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center">
          <img
            src="/assets/generated/logo.dim_400x80.png"
            alt="Хятад Драма"
            className="max-h-12 w-auto object-contain"
          />
        </div>

        <Button
          data-ocid="header.settings_button"
          variant="ghost"
          size="icon"
          onClick={() => setAdminModalOpen(true)}
          className="w-9 h-9 rounded-lg hover:bg-surface-2"
          style={{ color: "oklch(0.55 0.02 280)" }}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Main content */}
      <main data-ocid="home.page" className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Section heading */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-ui text-xl font-semibold text-foreground">
              Бүх Цуврал
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {movies.length} цуврал нийт
            </p>
          </div>
          {totalPages > 1 && (
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages} хуудас
            </span>
          )}
        </div>

        {/* Movie grid */}
        {pageMovies.length === 0 ? (
          <div
            data-ocid="movies.empty_state"
            className="flex flex-col items-center justify-center py-24 text-muted-foreground"
          >
            <Film className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-ui text-lg">Кино байхгүй байна</p>
            <p className="text-sm mt-1">Админ кино нэмэх хүртэл хүлээнэ үү</p>
          </div>
        ) : (
          <motion.div
            key={`page-${page}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {pageMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                data-ocid={`movies.item.${index + 1}`}
                variants={cardVariants}
                onClick={() => handleMovieClick(movie)}
                className="group cursor-pointer rounded-xl overflow-hidden"
                style={{
                  background: "oklch(0.13 0.015 280)",
                  border: "1px solid oklch(0.22 0.02 280)",
                  transition:
                    "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                }}
                whileHover={{
                  scale: 1.04,
                  y: -6,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
              >
                {/* Poster */}
                <div className="relative aspect-[5/7] overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      background: "oklch(0 0 0 / 0.6)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: "oklch(0.72 0.18 55)",
                        boxShadow: "0 0 24px oklch(0.72 0.18 55 / 0.6)",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 ml-0.5"
                        style={{ fill: "oklch(0.1 0.01 280)" }}
                        aria-label="Play"
                        role="img"
                      >
                        <title>Play</title>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Gold border on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 0 2px oklch(0.72 0.18 55 / 0.6)",
                      borderRadius: "inherit",
                    }}
                  />
                </div>

                {/* Title */}
                <div className="p-3">
                  <p
                    className="font-body text-sm font-medium leading-tight line-clamp-2 group-hover:text-gold transition-colors duration-200"
                    style={{ color: "oklch(0.85 0.01 85)" }}
                  >
                    {movie.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              data-ocid="pagination.pagination_prev"
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="gap-2 font-ui"
              style={{
                background: "oklch(0.13 0.015 280)",
                border: "1px solid oklch(0.22 0.02 280)",
                color: "oklch(0.85 0.01 85)",
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Өмнөх
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-8 h-8 rounded-md text-sm font-ui font-medium transition-colors"
                  style={{
                    background:
                      p === page
                        ? "oklch(0.72 0.18 55)"
                        : "oklch(0.16 0.015 280)",
                    color:
                      p === page
                        ? "oklch(0.1 0.01 280)"
                        : "oklch(0.6 0.02 280)",
                    border: `1px solid ${p === page ? "oklch(0.72 0.18 55)" : "oklch(0.22 0.02 280)"}`,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <Button
              data-ocid="pagination.pagination_next"
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="gap-2 font-ui"
              style={{
                background: "oklch(0.13 0.015 280)",
                border: "1px solid oklch(0.22 0.02 280)",
                color: "oklch(0.85 0.01 85)",
              }}
            >
              Дараах
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
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

      {/* Admin Login Modal */}
      <AnimatePresence>
        {adminModalOpen && (
          <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
            <DialogContent
              data-ocid="admin_login.modal"
              className="sm:max-w-sm"
              style={{
                background: "oklch(0.13 0.015 280)",
                border: "1px solid oklch(0.28 0.025 280)",
              }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-ui text-foreground">
                  <LogIn
                    className="w-4 h-4"
                    style={{ color: "oklch(0.72 0.18 55)" }}
                  />
                  Админ нэвтрэх
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAdminLogin} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label className="font-body text-sm text-foreground">
                    Нэвтрэх нэр
                  </Label>
                  <Input
                    data-ocid="admin_login.input"
                    value={adminUsername}
                    onChange={(e) => {
                      setAdminUsername(e.target.value);
                      setAdminError("");
                    }}
                    placeholder="username"
                    autoComplete="username"
                    className="font-body"
                    style={{
                      background: "oklch(0.1 0.01 280)",
                      border: "1px solid oklch(0.22 0.02 280)",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-body text-sm text-foreground">
                    Нууц үг
                  </Label>
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError("");
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="font-body"
                    style={{
                      background: "oklch(0.1 0.01 280)",
                      border: "1px solid oklch(0.22 0.02 280)",
                    }}
                  />
                </div>

                {adminError && (
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "oklch(0.75 0.18 22)" }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {adminError}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 font-ui"
                    onClick={() => {
                      setAdminModalOpen(false);
                      setAdminUsername("");
                      setAdminPassword("");
                      setAdminError("");
                    }}
                    style={{
                      background: "oklch(0.18 0.02 280)",
                      border: "1px solid oklch(0.28 0.025 280)",
                    }}
                  >
                    Цуцлах
                  </Button>
                  <Button
                    data-ocid="admin_login.submit_button"
                    type="submit"
                    disabled={adminLoading || !adminUsername || !adminPassword}
                    className="flex-1 font-ui"
                    style={{
                      background: "oklch(0.72 0.18 55)",
                      color: "oklch(0.1 0.01 280)",
                    }}
                  >
                    {adminLoading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                      "Нэвтрэх"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
