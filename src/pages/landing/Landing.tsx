import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../router/routes";
import {
  readSession,
  validateUsername,
  writeSession,
  createSession,
} from "../../utils/session.ts";
import "./Landing.css";

const Landing = () => {
  const nav = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const existing = readSession();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const valid = validateUsername(username);
    if (!valid) {
      setError("Use 1–20 chars: letters, digits, _ or -");
      return;
    }
    writeSession(createSession(valid));
    nav(ROUTES.GAME);
  };

  return (
    <section className="landing container-sm">
      <div className="panel landing__panel">
        <h1 className="landing__title">Welcome</h1>
        <p className="landing__subtitle">
          Enter your name to start the Memory Game.
        </p>

        {existing && (
          <p className="badge" aria-live="polite">
            Signed in previously as <strong>{existing.username}</strong>
          </p>
        )}

        <form className="form" onSubmit={onSubmit} noValidate>
          <label className="form__group">
            <span className="form__label">Name</span>
            <input
              className="input"
              type="text"
              name="username"
              placeholder="e.g. Rafael Silva"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              inputMode="text"
              aria-invalid={!!error}
              aria-describedby={error ? "username-error" : undefined}
              maxLength={20}
            />
          </label>

          {error && (
            <div id="username-error" role="alert" className="form__error">
              {error}
            </div>
          )}

          <div className="form__actions">
            <button type="submit" className="btn btn--primary full-width">
              Enter
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Landing;
