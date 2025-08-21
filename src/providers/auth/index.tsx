import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  readSession,
  writeSession,
  clearSession,
  createSession,
  validateUsername,
  onSessionChange,
} from "../../utils/session";
import type { Session } from "../../types/session";
import type { AuthContextValue } from "../../types/auth.ts";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession());

  useEffect(() => onSessionChange(() => setSession(readSession())), []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      session,
      login: (usernameRaw: string) => {
        const valid = validateUsername(usernameRaw);
        if (!valid) {
          return {
            ok: false,
            error: "Use 1–20 chars: letters, digits, _ or -",
          };
        }
        writeSession(createSession(valid));
        setSession(readSession());
        return { ok: true };
      },
      logout: () => {
        clearSession();
        setSession(null);
      },
      refresh: () => setSession(readSession()),
    };
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
