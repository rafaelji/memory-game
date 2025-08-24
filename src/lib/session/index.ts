import type { Session } from "@/shared/types/session.ts";
import { SESSION_KEY } from "@/constants/session";

/** Allow-list validation: 1..20 of letters, digits, underscore or hyphen */
function validateUsername(raw: string): string | null {
  const s = raw.trim();
  return /^[A-Za-z0-9 _-]{1,20}$/.test(s) ? s : null;
}

/** Create a simple expiring session (7 days) */
function createSession(username: string, days = 7): Session {
  const createdAt = Date.now();
  const expiresAt = createdAt + days * 24 * 60 * 60 * 1000;
  return { username, createdAt, expiresAt };
}

/** Defensive JSON read */
function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const sessionObject = JSON.parse(raw) as Session;
    if (!sessionObject?.username || typeof sessionObject.expiresAt !== "number")
      return null;
    if (sessionObject.expiresAt <= Date.now()) return null;
    return sessionObject;
  } catch {
    return null;
  }
}

/** Defensive JSON write */
function writeSession(s: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("session:change"));
}

// Subscribe to session changes from this tab and other tabs
function onSessionChange(cb: () => void): () => void {
  const handler = () => cb();
  const storageHandler = (e: StorageEvent) => {
    if (e.key === SESSION_KEY) cb();
  };
  window.addEventListener("session:change", handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener("session:change", handler);
    window.removeEventListener("storage", storageHandler);
  };
}

export {
  validateUsername,
  createSession,
  readSession,
  writeSession,
  clearSession,
  onSessionChange,
};
