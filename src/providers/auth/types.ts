import type { Session } from "@/shared/types/session.ts";

type AuthContextValue = {
  session: Session | null;
  login: (
    username: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<Session | null>;
  getLastPlayer: () => string | null;
};

export type { AuthContextValue };
