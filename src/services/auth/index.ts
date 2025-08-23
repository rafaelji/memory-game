import {
  readSession,
  writeSession,
  clearSession,
  createSession,
  validateUsername,
  onSessionChange,
} from "../../lib/session";
import type { AuthService, Listener, LoginResult } from "./types.ts";
import type { Session } from "../../shared/types/session";
import type { Logger } from "../logger/types.ts";
import defaultLogger from "../logger";

/**
 * Auth Service (client-side)
 * -------------------------
 * Purpose:
 *   - Single source of truth (per tab) for the current session (NOT real auth).
 *   - Centralizes cross-tab sync (localStorage "storage" event) and notifies subscribers.
 *   - Provides a future-proof API: reads are sync (cheap snapshot), mutations are async-ready.
 *
 * API contracts:
 *   - getSession/isAuthenticated/getUsername: synchronous snapshot from in-memory cache.
 *   - login/logout/refresh: async (Promise). Today they update local storage; tomorrow they may call a backend.
 *   - subscribe(fn): delivers the current snapshot immediately and on every change. Returns unsubscribe().
 *
 * Error policy:
 *   - Subscriber callbacks must not throw. We guard with try/catch so one bad listener cannot break others.
 *   - In dev we log via an injectable logger; in production the default logger is a noop (or swap for Sentry/Datadog).
 *
 * Concurrency & sync:
 *   - The service listens to localStorage changes (cross-tab) and updates the cache, emitting to all subscribers.
 *   - Methods are idempotent where reasonable (logout can be called multiple times safely).
 *
 * Scope & lifecycle:
 *   - Intended as a per-tab singleton (exported instance) for SPAs. For SSR or tests, use the factory and inject an instance.
 */

export function createAuthService(logger: Logger = defaultLogger): AuthService {
  let session: Session | null = readSession();
  const listeners = new Set<Listener>();

  const unsubscribeSessionEvents = onSessionChange(() => {
    const next = readSession();
    const changed =
      (!!session && !!next && session.username !== next.username) ||
      !!session !== !!next;
    session = next;
    if (changed) emit();
  });

  function snapshot(): Session | null {
    return session ? { ...session } : null;
  }

  function emit() {
    const snap = snapshot();
    for (const fn of listeners) {
      try {
        fn(snap);
      } catch (err) {
        logger.error("[authService] listener threw", err);
      }
    }
  }

  function getSession(): Session | null {
    return snapshot();
  }

  function isAuthenticated(): boolean {
    return !!session;
  }

  function getUsername(): string | null {
    return session?.username ?? null;
  }

  async function login(username: string): Promise<LoginResult> {
    const valid = validateUsername(username);
    if (!valid) {
      return { ok: false, error: "Use 1–20 chars: letters, digits, _ or -" };
    }
    writeSession(createSession(valid)); // fires events
    session = readSession();
    emit();
    return { ok: true };
  }

  async function logout(): Promise<void> {
    clearSession(); // fires events
    session = null;
    emit();
  }

  async function refresh(): Promise<Session | null> {
    session = readSession();
    emit();
    return snapshot();
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    try {
      listener(snapshot());
    } catch (err) {
      logger.error("[authService] subscriber threw on initial emit", err);
    }
    return () => {
      listeners.delete(listener);
    };
  }

  function destroy(): void {
    listeners.clear();
    unsubscribeSessionEvents?.();
  }

  return {
    getSession,
    isAuthenticated,
    getUsername,
    login,
    logout,
    refresh,
    subscribe,
    destroy,
  };
}

export const authService = createAuthService();
