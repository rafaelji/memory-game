import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
import "./Landing.css";

const Landing = () => {
  const { login, session } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? ROUTES.GAME;

  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = login(username);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    nav(from);
  };

  return (
    <section className="landing container-sm">
      <div className="panel landing__panel">
        <h1 className="landing__title">Welcome</h1>
        <p className="landing__subtitle">
          Enter your name to start the Memory Game.
        </p>

        {session && (
          <p className="badge" aria-live="polite">
            Signed in previously as <strong>{session.username}</strong>
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
