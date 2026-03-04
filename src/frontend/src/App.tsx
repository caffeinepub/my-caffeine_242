import { Toaster } from "@/components/ui/sonner";
import {
  initStorage,
  isAdminAuthenticated,
  isDeviceAuthenticated,
} from "@/lib/storage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { useEffect } from "react";

import AccessPage from "@/pages/AccessPage";
import AdminPage from "@/pages/AdminPage";
import HomePage from "@/pages/HomePage";
import MoviePage from "@/pages/MoviePage";

// ─── Root Route ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="film-grain" />
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
  beforeLoad: () => {
    if (!isAdminAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
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
  useEffect(() => {
    initStorage();
  }, []);

  return <RouterProvider router={router} />;
}
