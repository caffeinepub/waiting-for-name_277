import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Since backend.d.ts has an empty interface (bindgen not run yet),
// we expose auth state and a ready flag derived from Internet Identity.

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const principal = identity?.getPrincipal().toText() ?? null;

  return {
    identity,
    isAuthenticated,
    isLoggingIn,
    loginStatus,
    principal,
    login,
    logout: clear,
  };
}
