import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    loginStatus,
    login: iiLogin,
    clear,
  } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const principal = identity?.getPrincipal().toText() ?? null;

  // Wrap login in try/catch so errors never propagate as unhandled rejections
  const login = () => {
    try {
      const result: unknown = iiLogin();
      if (result !== null && typeof result === "object" && "catch" in result) {
        (result as Promise<unknown>).catch((err: unknown) => {
          console.error("[МебелМенаџер] Login error:", err);
        });
      }
    } catch (err) {
      console.error("[МебелМенаџер] Login sync error:", err);
    }
  };

  // Wrap logout similarly
  const logout = () => {
    try {
      const result: unknown = clear();
      if (result !== null && typeof result === "object" && "catch" in result) {
        (result as Promise<unknown>).catch((err: unknown) => {
          console.error("[МебелМенаџер] Logout error:", err);
        });
      }
    } catch (err) {
      console.error("[МебелМенаџер] Logout sync error:", err);
    }
  };

  return {
    identity,
    isAuthenticated,
    isLoggingIn,
    loginStatus,
    principal,
    login,
    logout,
  };
}
