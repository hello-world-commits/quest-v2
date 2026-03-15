import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { checkAuth, refreshAuth } from "@/utils/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ location }) => {
    if (!checkAuth()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  // Refresh the auth record so user flags (can_submit, can_validate) stay
  // in sync with the server without requiring a logout/login cycle.
  loader: async ({ location }) => {
    try {
      await refreshAuth();
    } catch {
      // Token revoked or expired server-side — force re-login.
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  // Re-use cached result for up to 2 minutes to avoid an extra request
  // on every single in-app navigation.
  staleTime: 2 * 60 * 1000,
  component: Outlet,
});
