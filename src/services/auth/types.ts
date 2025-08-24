import type { Session } from "@/shared/types/session.ts";

type LoginResult = { ok: true } | { ok: false; error: string };

type Listener = (session: Session | null) => void;

type AuthService = {
  getSession(): Session | null;
  isAuthenticated(): boolean;
  getUsername(): string | null;
  login(username: string): Promise<LoginResult>;
  logout(): Promise<void>;
  refresh(): Promise<Session | null>;
  subscribe(listener: Listener): () => void;
  destroy(): void;
};

export type { AuthService, LoginResult, Listener };
