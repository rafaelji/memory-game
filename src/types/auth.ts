import type { Session } from "./session.ts";

type AuthContextValue = {
  session: Session | null;
  login: (usernameRaw: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  refresh: () => void;
};

export type { AuthContextValue };
