import type { Session } from "../../shared/types/session.ts";

type AuthContextValue = {
  session: Session | null;
  login: (usernameRaw: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  refresh: () => void;
};

export type { AuthContextValue };
