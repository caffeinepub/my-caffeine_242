import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerDeviceToken, validatePin } from "@/lib/storage";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, Unlock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function AccessPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setError("6 оронтой код оруулна уу");
      return;
    }

    setIsLoading(true);
    setError("");

    // Slight delay for UX
    await new Promise((r) => setTimeout(r, 400));

    const pin = validatePin(code.toUpperCase());
    if (!pin) {
      setError("Код буруу эсвэл хугацаа дууссан байна");
      setIsLoading(false);
      return;
    }

    registerDeviceToken(pin.code, pin.expiresAt);
    setIsLoading(false);
    await router.navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen cinema-bg flex flex-col items-center justify-center relative overflow-hidden">
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
                  setCode(e.target.value.toUpperCase().slice(0, 6));
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
              disabled={isLoading || code.length < 6}
              className="w-full h-12 font-ui font-semibold text-base gap-2"
              style={{
                background:
                  code.length === 6 && !isLoading
                    ? "oklch(0.72 0.18 55)"
                    : "oklch(0.22 0.02 280)",
                color:
                  code.length === 6 && !isLoading
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
    </div>
  );
}
