import type { ExpiryType, Movie, PinCode } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import {
  clearAdminSession,
  expiryLabel,
  formatExpiry,
  getAdminSession,
  isAdminAuthenticated,
  setAdminSession,
} from "@/lib/storage";
import { useRouter } from "@tanstack/react-router";
import {
  AlertCircle,
  Ban,
  Eye,
  EyeOff,
  Film,
  Key,
  LogIn,
  LogOut,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Sub-components ───────────────────────────────────────────────────────────

function PinStatusBadge({ pin }: { pin: PinCode }) {
  if (!pin.isActive) {
    return (
      <Badge
        variant="outline"
        style={{
          color: "oklch(0.55 0.02 280)",
          borderColor: "oklch(0.28 0.02 280)",
        }}
      >
        Цуцлагдсан
      </Badge>
    );
  }
  if (
    pin.expiresAt !== -1n &&
    Date.now() > Number(pin.expiresAt / 1_000_000n)
  ) {
    return (
      <Badge
        variant="outline"
        style={{
          color: "oklch(0.62 0.22 22)",
          borderColor: "oklch(0.62 0.22 22 / 0.3)",
        }}
      >
        Хугацаа дууссан
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      style={{
        color: "oklch(0.72 0.16 150)",
        borderColor: "oklch(0.72 0.16 150 / 0.3)",
      }}
    >
      Идэвхтэй
    </Badge>
  );
}

function truncateUrl(url: string, max = 40): string {
  return url.length > max ? `${url.slice(0, max)}…` : url;
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

// ─── Admin Login Form (shown when not authenticated) ───────────────────────────

function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { actor, isFetching: actorLoading } = useActor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setError(
        "Сервертэй холбогдож байна. Хэдхэн секунд хүлээгээд дахин оролдоно уу.",
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await actor.adminLogin(username, password);
      if (result.ok) {
        setAdminSession(result.token);
        onSuccess();
      } else {
        setError("Нэвтрэх нэр эсвэл нууц үг буруу байна");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Сервертэй холбогдоход алдаа гарлаа. Дахин оролдоно уу.");
    }
    setLoading(false);
  };

  const inputStyle = {
    background: "oklch(0.1 0.01 280)",
    border: "1px solid oklch(0.22 0.02 280)",
    color: "oklch(0.92 0.01 85)",
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "oklch(0.08 0.008 280)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm px-6"
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: "oklch(0.72 0.18 55 / 0.15)",
              border: "1px solid oklch(0.72 0.18 55 / 0.3)",
            }}
          >
            <ShieldCheck
              className="w-7 h-7"
              style={{ color: "oklch(0.72 0.18 55)" }}
            />
          </div>
          <h1 className="font-ui text-xl font-bold text-foreground">
            Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-body">
            Хятад Драма
          </p>
        </div>

        <div
          className="rounded-xl p-6"
          style={{
            background: "oklch(0.13 0.015 280 / 0.9)",
            border: "1px solid oklch(0.22 0.02 280)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body text-sm text-foreground">
                Нэвтрэх нэр
              </Label>
              <Input
                data-ocid="admin_login.input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="username"
                autoComplete="username"
                className="font-body"
                style={inputStyle}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm text-foreground">
                Нууц үг
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                className="font-body"
                style={inputStyle}
              />
            </div>

            {actorLoading && !error && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "oklch(0.65 0.06 280)" }}
              >
                <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
                Сервертэй холбогдож байна...
              </div>
            )}

            {error && (
              <div
                data-ocid="admin_login.error_state"
                className="flex items-center gap-2 text-sm"
                style={{ color: "oklch(0.75 0.18 22)" }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              data-ocid="admin_login.submit_button"
              type="submit"
              disabled={
                loading || actorLoading || !username || !password || !actor
              }
              className="w-full gap-2 font-ui"
              style={{
                background: "oklch(0.72 0.18 55)",
                color: "oklch(0.1 0.01 280)",
              }}
            >
              {loading || actorLoading ? (
                <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Нэвтрэх
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const { actor } = useActor();
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated());
  const token = getAdminSession();

  // Movies state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieDialogOpen, setMovieDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [movieForm, setMovieForm] = useState({
    title: "",
    posterUrl: "",
    videoUrl: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMovieId, setDeletingMovieId] = useState<bigint | null>(null);

  // Pins state
  const [pins, setPins] = useState<PinCode[]>([]);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinExpiryType, setPinExpiryType] = useState<ExpiryType>(
    "thirtyDays" as ExpiryType,
  );
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [revokingCode, setRevokingCode] = useState<string | null>(null);

  // Settings state
  const [settingsUsername, setSettingsUsername] = useState("");
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsPasswordConfirm, setSettingsPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => {
    if (!actor) return;
    const loadData = async () => {
      try {
        const [moviesResult, pinsResult] = await Promise.all([
          actor.getMovies(0n, 100n),
          actor.listPinCodes(token),
        ]);
        setMovies(moviesResult.movies);
        if (pinsResult.ok) {
          setPins(pinsResult.pins);
        }
      } catch {
        toast.error("Өгөгдөл ачааллахад алдаа гарлаа");
      }
    };
    loadData();
  }, [actor, token]);

  const refreshMovies = async () => {
    if (!actor) return;
    try {
      const result = await actor.getMovies(0n, 100n);
      setMovies(result.movies);
    } catch {
      toast.error("Кино жагсаалт шинэчлэхэд алдаа гарлаа");
    }
  };

  const refreshPins = async () => {
    if (!actor) return;
    try {
      const result = await actor.listPinCodes(token);
      if (result.ok) {
        setPins(result.pins);
      }
    } catch {
      toast.error("PIN жагсаалт шинэчлэхэд алдаа гарлаа");
    }
  };

  const handleLogout = async () => {
    if (actor) {
      try {
        await actor.adminLogout(token);
      } catch {
        // ignore errors on logout
      }
    }
    clearAdminSession();
    router.navigate({ to: "/" });
  };

  // ── Movie CRUD ──────────────────────────────────────────────────────────────

  const openAddMovie = () => {
    setEditingMovie(null);
    setMovieForm({ title: "", posterUrl: "", videoUrl: "" });
    setMovieDialogOpen(true);
  };

  const openEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      posterUrl: movie.posterUrl,
      videoUrl: movie.videoUrl,
    });
    setMovieDialogOpen(true);
  };

  const handleMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieForm.title.trim() || !movieForm.videoUrl.trim()) {
      toast.error("Гарчиг болон видео URL заавал шаардлагатай");
      return;
    }
    if (!actor) return;
    try {
      if (editingMovie) {
        await actor.updateMovie(
          token,
          editingMovie.id,
          movieForm.title.trim(),
          movieForm.posterUrl.trim(),
          movieForm.videoUrl.trim(),
        );
        toast.success("Кино амжилттай шинэчлэгдлээ");
      } else {
        await actor.addMovie(
          token,
          movieForm.title.trim(),
          movieForm.posterUrl.trim() ||
            `https://picsum.photos/seed/${Date.now()}/300/420`,
          movieForm.videoUrl.trim(),
        );
        toast.success("Кино амжилттай нэмэгдлээ");
      }
      await refreshMovies();
      setMovieDialogOpen(false);
    } catch {
      toast.error("Кино хадгалахад алдаа гарлаа");
    }
  };

  const confirmDelete = (id: bigint) => {
    setDeletingMovieId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingMovieId !== null && actor) {
      try {
        await actor.deleteMovie(token, deletingMovieId);
        await refreshMovies();
        toast.success("Кино устгагдлаа");
      } catch {
        toast.error("Кино устгахад алдаа гарлаа");
      }
    }
    setDeleteDialogOpen(false);
    setDeletingMovieId(null);
  };

  // ── PIN CRUD ────────────────────────────────────────────────────────────────

  const handleCreatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    try {
      const result = await actor.createPinCode(token, pinExpiryType);
      if (result.ok) {
        await refreshPins();
        setPinDialogOpen(false);
        toast.success(`Шинэ код үүслээ: ${result.code}`);
      } else {
        toast.error("Код үүсгэхэд алдаа гарлаа");
      }
    } catch {
      toast.error("Код үүсгэхэд алдаа гарлаа");
    }
  };

  const confirmRevoke = (code: string) => {
    setRevokingCode(code);
    setRevokeDialogOpen(true);
  };

  const handleRevoke = async () => {
    if (revokingCode && actor) {
      try {
        await actor.revokePinCode(token, revokingCode);
        await refreshPins();
        toast.success("Код цуцлагдлаа");
      } catch {
        toast.error("Код цуцлахад алдаа гарлаа");
      }
    }
    setRevokeDialogOpen(false);
    setRevokingCode(null);
  };

  // ── Settings ────────────────────────────────────────────────────────────────

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsUsername.trim()) {
      toast.error("Нэвтрэх нэр хоосон байна");
      return;
    }
    if (settingsPassword && settingsPassword !== settingsPasswordConfirm) {
      toast.error("Нууц үг тохирохгүй байна");
      return;
    }
    if (!settingsPassword) {
      toast.error("Шинэ нууц үг оруулна уу");
      return;
    }
    if (!actor) return;
    setSettingsSaving(true);
    try {
      const ok = await actor.updateAdminCredentials(
        token,
        settingsUsername.trim(),
        settingsPassword.trim(),
      );
      if (ok) {
        setSettingsPassword("");
        setSettingsPasswordConfirm("");
        toast.success("Тохиргоо хадгалагдлаа");
      } else {
        toast.error("Тохиргоо хадгалахад алдаа гарлаа");
      }
    } catch {
      toast.error("Тохиргоо хадгалахад алдаа гарлаа");
    }
    setSettingsSaving(false);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const inputStyle = {
    background: "oklch(0.1 0.01 280)",
    border: "1px solid oklch(0.22 0.02 280)",
    color: "oklch(0.92 0.01 85)",
  };

  if (!authenticated) {
    return <AdminLoginForm onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.08 0.008 280)" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{
          background: "oklch(0.1 0.01 280)",
          borderBottom: "1px solid oklch(0.22 0.02 280)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: "oklch(0.72 0.18 55 / 0.15)",
              border: "1px solid oklch(0.72 0.18 55 / 0.3)",
            }}
          >
            <ShieldCheck
              className="w-5 h-5"
              style={{ color: "oklch(0.72 0.18 55)" }}
            />
          </div>
          <div>
            <h1 className="font-ui text-lg font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              Хятад Драма
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-2 font-ui"
          style={{ color: "oklch(0.62 0.22 22)" }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </header>

      {/* Tabs */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="movies">
          <TabsList
            className="mb-8 font-ui"
            style={{
              background: "oklch(0.13 0.015 280)",
              border: "1px solid oklch(0.22 0.02 280)",
            }}
          >
            <TabsTrigger value="movies" className="gap-2">
              <Film className="w-4 h-4" />
              Movies
            </TabsTrigger>
            <TabsTrigger value="pins" className="gap-2">
              <Key className="w-4 h-4" />
              PIN Codes
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <ShieldCheck className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* ── Movies Tab ──────────────────────────────────────────────────── */}
          <TabsContent value="movies">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-ui text-lg font-semibold text-foreground">
                    Movies ({movies.length})
                  </h2>
                  <p className="text-sm text-muted-foreground font-body">
                    Manage Chinese drama catalogue
                  </p>
                </div>
                <Button
                  data-ocid="admin.add_movie_button"
                  onClick={openAddMovie}
                  className="gap-2 font-ui"
                  style={{
                    background: "oklch(0.72 0.18 55)",
                    color: "oklch(0.1 0.01 280)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Movie
                </Button>
              </div>

              <div
                data-ocid="admin.movies.table"
                className="rounded-xl overflow-hidden"
                style={{
                  background: "oklch(0.13 0.015 280)",
                  border: "1px solid oklch(0.22 0.02 280)",
                }}
              >
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: "oklch(0.22 0.02 280)" }}>
                      <TableHead className="font-ui text-muted-foreground">
                        Title
                      </TableHead>
                      <TableHead className="font-ui text-muted-foreground">
                        Poster URL
                      </TableHead>
                      <TableHead className="font-ui text-muted-foreground">
                        Video URL
                      </TableHead>
                      <TableHead className="font-ui text-muted-foreground w-24">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movies.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground py-12 font-body"
                        >
                          No movies yet. Add your first movie above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      movies.map((movie, index) => (
                        <TableRow
                          key={String(movie.id)}
                          style={{ borderColor: "oklch(0.18 0.02 280)" }}
                        >
                          <TableCell className="font-body text-sm text-foreground font-medium">
                            {movie.title}
                          </TableCell>
                          <TableCell
                            className="font-mono text-xs text-muted-foreground max-w-[160px] truncate"
                            title={movie.posterUrl}
                          >
                            {truncateUrl(movie.posterUrl)}
                          </TableCell>
                          <TableCell
                            className="font-mono text-xs text-muted-foreground max-w-[160px] truncate"
                            title={movie.videoUrl}
                          >
                            {truncateUrl(movie.videoUrl)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                data-ocid={`admin.movie.edit_button.${index + 1}`}
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 hover:bg-surface-2"
                                onClick={() => openEditMovie(movie)}
                                style={{ color: "oklch(0.72 0.18 55)" }}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                data-ocid={`admin.movie.delete_button.${index + 1}`}
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => confirmDelete(movie.id)}
                                style={{ color: "oklch(0.62 0.22 22)" }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </TabsContent>

          {/* ── PIN Codes Tab ────────────────────────────────────────────────── */}
          <TabsContent value="pins">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-ui text-lg font-semibold text-foreground">
                    PIN Codes ({pins.length})
                  </h2>
                  <p className="text-sm text-muted-foreground font-body">
                    Create and manage access codes
                  </p>
                </div>
                <Button
                  data-ocid="admin.create_pin_button"
                  onClick={() => setPinDialogOpen(true)}
                  className="gap-2 font-ui"
                  style={{
                    background: "oklch(0.72 0.18 55)",
                    color: "oklch(0.1 0.01 280)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Create PIN Code
                </Button>
              </div>

              <div
                data-ocid="admin.pins.table"
                className="rounded-xl overflow-hidden"
                style={{
                  background: "oklch(0.13 0.015 280)",
                  border: "1px solid oklch(0.22 0.02 280)",
                }}
              >
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: "oklch(0.22 0.02 280)" }}>
                      <TableHead className="font-ui text-muted-foreground">
                        Code
                      </TableHead>
                      <TableHead className="font-ui text-muted-foreground">
                        Expiry Type
                      </TableHead>
                      <TableHead className="font-ui text-muted-foreground">
                        Expires At
                      </TableHead>
                      <TableHead className="font-ui text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="font-ui text-muted-foreground w-24">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pins.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-12 font-body"
                        >
                          No PIN codes yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pins.map((pin, index) => (
                        <TableRow
                          key={pin.code}
                          style={{ borderColor: "oklch(0.18 0.02 280)" }}
                        >
                          <TableCell>
                            <span
                              className="font-mono text-base font-bold tracking-widest"
                              style={{ color: "oklch(0.72 0.18 55)" }}
                            >
                              {pin.code}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm font-body text-muted-foreground">
                            {expiryLabel(pin.expiryType)}
                          </TableCell>
                          <TableCell className="text-sm font-body text-muted-foreground">
                            {formatExpiry(pin.expiresAt)}
                          </TableCell>
                          <TableCell>
                            <PinStatusBadge pin={pin} />
                          </TableCell>
                          <TableCell>
                            {pin.isActive &&
                              (pin.expiresAt === -1n ||
                                Date.now() <=
                                  Number(pin.expiresAt / 1_000_000n)) && (
                                <Button
                                  data-ocid={`admin.pin.revoke_button.${index + 1}`}
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1.5 text-xs font-ui h-7"
                                  onClick={() => confirmRevoke(pin.code)}
                                  style={{ color: "oklch(0.62 0.22 22)" }}
                                >
                                  <Ban className="w-3 h-3" />
                                  Revoke
                                </Button>
                              )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </TabsContent>

          {/* ── Settings Tab ─────────────────────────────────────────────────── */}
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="font-ui text-lg font-semibold text-foreground">
                  Admin Settings
                </h2>
                <p className="text-sm text-muted-foreground font-body">
                  Update admin credentials
                </p>
              </div>

              <div
                className="max-w-md rounded-xl p-6"
                style={{
                  background: "oklch(0.13 0.015 280)",
                  border: "1px solid oklch(0.22 0.02 280)",
                }}
              >
                <form onSubmit={handleSettingsSave} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="font-ui text-sm text-foreground">
                      Username
                    </Label>
                    <Input
                      data-ocid="admin.settings.input"
                      value={settingsUsername}
                      onChange={(e) => setSettingsUsername(e.target.value)}
                      placeholder="admin"
                      autoComplete="username"
                      className="font-body"
                      style={inputStyle}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-ui text-sm text-foreground">
                      New Password{" "}
                      <span className="text-muted-foreground font-normal">
                        (required)
                      </span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={settingsPassword}
                        onChange={(e) => setSettingsPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="font-body pr-10"
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {settingsPassword && (
                    <div className="space-y-2">
                      <Label className="font-ui text-sm text-foreground">
                        Confirm Password
                      </Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={settingsPasswordConfirm}
                        onChange={(e) =>
                          setSettingsPasswordConfirm(e.target.value)
                        }
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="font-body"
                        style={{
                          ...inputStyle,
                          borderColor:
                            settingsPasswordConfirm &&
                            settingsPassword !== settingsPasswordConfirm
                              ? "oklch(0.62 0.22 22)"
                              : "oklch(0.22 0.02 280)",
                        }}
                      />
                      {settingsPasswordConfirm &&
                        settingsPassword !== settingsPasswordConfirm && (
                          <p
                            className="text-xs"
                            style={{ color: "oklch(0.75 0.18 22)" }}
                          >
                            Passwords do not match
                          </p>
                        )}
                    </div>
                  )}

                  <Button
                    data-ocid="admin.settings.save_button"
                    type="submit"
                    disabled={settingsSaving}
                    className="w-full gap-2 font-ui"
                    style={{
                      background: "oklch(0.72 0.18 55)",
                      color: "oklch(0.1 0.01 280)",
                    }}
                  >
                    {settingsSaving ? (
                      <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Movie Form Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={movieDialogOpen} onOpenChange={setMovieDialogOpen}>
        <DialogContent
          data-ocid="admin.movie_form.dialog"
          className="sm:max-w-md"
          style={{
            background: "oklch(0.13 0.015 280)",
            border: "1px solid oklch(0.28 0.025 280)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-ui text-foreground flex items-center gap-2">
              <Film
                className="w-4 h-4"
                style={{ color: "oklch(0.72 0.18 55)" }}
              />
              {editingMovie ? "Edit Movie" : "Add Movie"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleMovieSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="font-ui text-sm text-foreground">
                Title <span style={{ color: "oklch(0.62 0.22 22)" }}>*</span>
              </Label>
              <Input
                value={movieForm.title}
                onChange={(e) =>
                  setMovieForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Кино гарчиг"
                className="font-body"
                style={{
                  background: "oklch(0.1 0.01 280)",
                  border: "1px solid oklch(0.22 0.02 280)",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-ui text-sm text-foreground">
                Poster URL{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                value={movieForm.posterUrl}
                onChange={(e) =>
                  setMovieForm((f) => ({ ...f, posterUrl: e.target.value }))
                }
                placeholder="https://..."
                type="url"
                className="font-body"
                style={{
                  background: "oklch(0.1 0.01 280)",
                  border: "1px solid oklch(0.22 0.02 280)",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-ui text-sm text-foreground">
                Video URL{" "}
                <span style={{ color: "oklch(0.62 0.22 22)" }}>*</span>
              </Label>
              <Input
                value={movieForm.videoUrl}
                onChange={(e) =>
                  setMovieForm((f) => ({ ...f, videoUrl: e.target.value }))
                }
                placeholder="https://www.dropbox.com/..."
                type="url"
                className="font-body"
                style={{
                  background: "oklch(0.1 0.01 280)",
                  border: "1px solid oklch(0.22 0.02 280)",
                }}
              />
            </div>

            <DialogFooter className="gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                className="font-ui"
                onClick={() => setMovieDialogOpen(false)}
                style={{
                  background: "oklch(0.18 0.02 280)",
                  border: "1px solid oklch(0.28 0.025 280)",
                  color: "oklch(0.85 0.01 85)",
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-ui"
                style={{
                  background: "oklch(0.72 0.18 55)",
                  color: "oklch(0.1 0.01 280)",
                }}
              >
                {editingMovie ? "Update" : "Add Movie"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ─────────────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          className="sm:max-w-sm"
          style={{
            background: "oklch(0.13 0.015 280)",
            border: "1px solid oklch(0.62 0.22 22 / 0.3)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-ui text-foreground flex items-center gap-2">
              <Trash2
                className="w-4 h-4"
                style={{ color: "oklch(0.62 0.22 22)" }}
              />
              Delete Movie
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm font-body text-muted-foreground">
            Are you sure you want to delete this movie? This action cannot be
            undone.
          </p>
          <DialogFooter className="gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="admin.movie.cancel_button"
              className="font-ui"
              onClick={() => setDeleteDialogOpen(false)}
              style={{
                background: "oklch(0.18 0.02 280)",
                border: "1px solid oklch(0.28 0.025 280)",
                color: "oklch(0.85 0.01 85)",
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.movie.confirm_button"
              className="font-ui"
              onClick={handleDelete}
              style={{
                background: "oklch(0.62 0.22 22)",
                color: "oklch(0.98 0 0)",
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Create PIN Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
        <DialogContent
          data-ocid="admin.pin_form.dialog"
          className="sm:max-w-sm"
          style={{
            background: "oklch(0.13 0.015 280)",
            border: "1px solid oklch(0.28 0.025 280)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-ui text-foreground flex items-center gap-2">
              <Key
                className="w-4 h-4"
                style={{ color: "oklch(0.72 0.18 55)" }}
              />
              Create PIN Code
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePin} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="font-ui text-sm text-foreground">
                Expiry Duration
              </Label>
              <Select
                value={pinExpiryType}
                onValueChange={(v) => setPinExpiryType(v as ExpiryType)}
              >
                <SelectTrigger
                  className="font-body"
                  style={{
                    background: "oklch(0.1 0.01 280)",
                    border: "1px solid oklch(0.22 0.02 280)",
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "oklch(0.15 0.015 280)",
                    border: "1px solid oklch(0.28 0.025 280)",
                  }}
                >
                  <SelectItem value="twentyMinutes" className="font-body">
                    20 минут
                  </SelectItem>
                  <SelectItem value="thirtyDays" className="font-body">
                    30 хоног
                  </SelectItem>
                  <SelectItem value="ninetyDays" className="font-body">
                    90 хоног
                  </SelectItem>
                  <SelectItem value="unlimited" className="font-body">
                    Хугацаагүй
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-xs text-muted-foreground font-body">
              A random 6-character alphanumeric code will be generated
              automatically.
            </p>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                className="font-ui"
                onClick={() => setPinDialogOpen(false)}
                style={{
                  background: "oklch(0.18 0.02 280)",
                  border: "1px solid oklch(0.28 0.025 280)",
                  color: "oklch(0.85 0.01 85)",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-ui"
                style={{
                  background: "oklch(0.72 0.18 55)",
                  color: "oklch(0.1 0.01 280)",
                }}
              >
                Generate Code
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Revoke Confirm Dialog ─────────────────────────────────────────────── */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent
          className="sm:max-w-sm"
          style={{
            background: "oklch(0.13 0.015 280)",
            border: "1px solid oklch(0.62 0.22 22 / 0.3)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-ui text-foreground flex items-center gap-2">
              <Ban
                className="w-4 h-4"
                style={{ color: "oklch(0.62 0.22 22)" }}
              />
              Revoke PIN Code
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm font-body text-muted-foreground">
            Are you sure you want to revoke code{" "}
            <span
              className="font-mono font-bold"
              style={{ color: "oklch(0.72 0.18 55)" }}
            >
              {revokingCode}
            </span>
            ? Users with this code will lose access.
          </p>
          <DialogFooter className="gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="admin.pin.cancel_button"
              className="font-ui"
              onClick={() => setRevokeDialogOpen(false)}
              style={{
                background: "oklch(0.18 0.02 280)",
                border: "1px solid oklch(0.28 0.025 280)",
                color: "oklch(0.85 0.01 85)",
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.pin.confirm_button"
              className="font-ui"
              onClick={handleRevoke}
              style={{
                background: "oklch(0.62 0.22 22)",
                color: "oklch(0.98 0 0)",
              }}
            >
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
