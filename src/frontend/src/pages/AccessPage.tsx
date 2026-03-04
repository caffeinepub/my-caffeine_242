import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { setAdminSession, setDeviceToken } from "@/lib/storage";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, LogIn, Settings, Unlock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function AccessPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { actor, isFetching: actorLoading } = useActor();

  // Admin modal state
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setAdminError(
        "Сервертэй холбогдож байна. Хэдхэн секунд хүлээгээд дахин оролдоно уу.",
      );
      return;
    }
    setAdminLoading(true);
    setAdminError("");
    try {
      const result = await actor.adminLogin(adminUsername, adminPassword);
      if (result.ok) {
        setAdminSession(result.token);
        setAdminModalOpen(false);
        setAdminUsername("");
        setAdminPassword("");
        router.navigate({ to: "/admin" });
      } else {
        setAdminError("Нэвтрэх нэр эсвэл нууц үг буруу байна");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setAdminError("Сервертэй холбогдоход алдаа гарлаа. Дахин оролдоно уу.");
    }
    setAdminLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setError("6 оронтой код оруулна уу");
      return;
    }
    if (!actor) {
      setError(
        "Сервертэй холбогдож байна. Хэдхэн секунд хүлээгээд дахин оролдоно уу.",
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await actor.validatePinCode(code);
      if (!result.ok) {
        setError("Код буруу эсвэл хугацаа дууссан байна");
        setIsLoading(false);
        return;
      }

      setDeviceToken(result.deviceToken);
      setIsLoading(false);
      await router.navigate({ to: "/" });
    } catch {
      setError("Сервертэй холбогдоход алдаа гарлаа. Дахин оролдоно уу.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen cinema-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Admin settings icon - top right */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          data-ocid="header.settings_button"
          variant="ghost"
          size="icon"
          onClick={() => setAdminModalOpen(true)}
          className="w-9 h-9 rounded-lg hover:bg-surface-2"
          style={{ color: "oklch(0.45 0.02 280)" }}
          title="Админ нэвтрэх"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
      {/* Decorative film strip lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 48px,
            oklch(0.72 0.18 55 / 0.03) 48px,
            oklch(0.72 0.18 55 / 0.03) 50px
          )`,
        }}
      />

      {/* Ambient glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.18 55 / 0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.5 0.1 280 / 0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center w-full max-w-sm px-6"
      >
        {/* Logo area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center mb-10"
        >
          <img
            src="/assets/generated/logo.dim_400x80.png"
            alt="Хятад Драма"
            className="max-h-12 w-auto object-contain mb-4"
          />
          <p className="mt-2 text-sm text-muted-foreground text-center font-body">
            Шилдэг хятад цувралуудыг нэг дор
          </p>
        </motion.div>

        {/* Login form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-full"
          style={{
            background: "oklch(0.13 0.015 280 / 0.8)",
            border: "1px solid oklch(0.22 0.02 280)",
            borderRadius: "1rem",
            backdropFilter: "blur(12px)",
            padding: "2rem",
          }}
        >
          <p className="text-center text-sm text-muted-foreground mb-6 font-body">
            Нэвтрэхийн тулд админаас авсан <br />
            <span style={{ color: "oklch(0.72 0.18 55)" }}>
              6 оронтой нэвтрэх кодоо
            </span>{" "}
            оруулна уу
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                data-ocid="pin.input"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.slice(0, 6));
                  setError("");
                }}
                placeholder="000000"
                maxLength={6}
                autoComplete="off"
                autoCapitalize="characters"
                className="text-center text-2xl font-mono tracking-[0.4em] h-14 font-ui uppercase"
                style={{
                  background: "oklch(0.1 0.01 280)",
                  border: `1px solid ${error ? "oklch(0.62 0.22 22)" : "oklch(0.22 0.02 280)"}`,
                  color: "oklch(0.92 0.01 85)",
                }}
              />
            </div>

            {error && (
              <motion.div
                data-ocid="pin.error_state"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm"
                style={{ color: "oklch(0.75 0.18 22)" }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              data-ocid="pin.submit_button"
              type="submit"
              disabled={isLoading || code.length < 6 || !actor}
              className="w-full h-12 font-ui font-semibold text-base gap-2"
              style={{
                background:
                  code.length === 6 && !isLoading && actor
                    ? "oklch(0.72 0.18 55)"
                    : "oklch(0.22 0.02 280)",
                color:
                  code.length === 6 && !isLoading && actor
                    ? "oklch(0.1 0.01 280)"
                    : "oklch(0.45 0.02 280)",
                transition: "all 0.2s",
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Шалгаж байна...
                </span>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  Нэвтрэх
                </>
              )}
            </Button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-muted-foreground text-center font-body"
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
        </motion.p>
      </motion.div>

      {/* Admin Login Modal */}
      <Dialog
        open={adminModalOpen}
        onOpenChange={(open) => {
          setAdminModalOpen(open);
          if (!open) {
            setAdminUsername("");
            setAdminPassword("");
            setAdminError("");
          }
        }}
      >
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

            {actorLoading && !adminError && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "oklch(0.65 0.06 280)" }}
              >
                <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
                Сервертэй холбогдож байна...
              </div>
            )}

            {adminError && (
              <div
                data-ocid="admin_login.error_state"
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
                disabled={
                  adminLoading ||
                  actorLoading ||
                  !adminUsername ||
                  !adminPassword ||
                  !actor
                }
                className="flex-1 font-ui"
                style={{
                  background: "oklch(0.72 0.18 55)",
                  color: "oklch(0.1 0.01 280)",
                }}
              >
                {adminLoading || actorLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (
                  "Нэвтрэх"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
