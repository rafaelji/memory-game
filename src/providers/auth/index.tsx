import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@/shared/types/session";
import { authService } from "@/services/auth";
import type { AuthContextValue } from "./types.ts";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provides the current session and async auth operations.
 * - Subscribes to authService changes (cross-tab safe).
 * - Proxies async mutations so components can await and handle errors/latency.
 */
function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(
    authService.getSession(),
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      login: authService.login,
      logout: authService.logout,
      refresh: authService.refresh,
      getLastPlayer: authService.getLastPlayer,
    }),
    [session],
  );

  useEffect(() => {
    // Subscribe to current + future changes; auto-unsubscribe on unmount
    return authService.subscribe(setSession);
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
