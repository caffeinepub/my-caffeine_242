import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import {
  clearDeviceAuth,
  getDeviceToken,
  isDeviceAuthenticated,
} from "@/lib/storage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import AccessPage from "@/pages/AccessPage";
import AdminPage from "@/pages/AdminPage";
import HomePage from "@/pages/HomePage";
import MoviePage from "@/pages/MoviePage";

// ─── Token Validator ──────────────────────────────────────────────────────────
// Validates the stored device token against the backend once the actor is ready.
// If the token is invalid (e.g. backend was upgraded), clears auth and redirects.

function TokenValidator() {
  const { actor } = useActor();
  const router = useRouter();
  const validated = useRef(false);

  useEffect(() => {
    if (!actor || validated.current) return;

    const storedToken = getDeviceToken();
    if (!storedToken) return; // no token, nothing to validate

    validated.current = true;

    actor
      .checkDeviceToken(storedToken)
      .then((isValid) => {
        if (!isValid) {
          clearDeviceAuth();
          router.navigate({ to: "/access" });
        }
      })
      .catch(() => {
        // Network error — don't clear auth, allow retry
        validated.current = false;
      });
  }, [actor, router]);

  return null;
}

// ─── Root Route ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="film-grain" />
      <TokenValidator />
      <Outlet />
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.13 0.015 280)",
            border: "1px solid oklch(0.72 0.18 55 / 0.3)",
            color: "oklch(0.92 0.01 85)",
          },
        }}
      />
    </>
  ),
});

// ─── Access Route ─────────────────────────────────────────────────────────────

const accessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/access",
  component: AccessPage,
  beforeLoad: () => {
    if (isDeviceAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
});

// ─── Home Route ───────────────────────────────────────────────────────────────

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
  beforeLoad: () => {
    if (!isDeviceAuthenticated()) {
      throw redirect({ to: "/access" });
    }
  },
});

// ─── Movie Route ──────────────────────────────────────────────────────────────

const movieRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/movie/$id",
  component: MoviePage,
  beforeLoad: () => {
    if (!isDeviceAuthenticated()) {
      throw redirect({ to: "/access" });
    }
  },
});

// ─── Admin Route ──────────────────────────────────────────────────────────────

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
  // No redirect: AdminPage handles login state itself
});

// ─── Router ───────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  accessRoute,
  homeRoute,
  movieRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
