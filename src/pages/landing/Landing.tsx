import { type ChangeEvent, type FormEvent, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router";
import { ROUTES } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import logger from "@/services/logger";
import Button from "@/components/button/Button.tsx";
import "./Landing.css";

const Landing = () => {
  const { login, session, getLastPlayer } = useAuth();
  const lastPlayer = !session ? getLastPlayer() : null;
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? ROUTES.GAME;

  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await login(username);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      nav(from, { replace: true });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      logger.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startGameWithPreviousPlayer = async () => {
    if (loading || !lastPlayer) return;
    setError(null);
    setLoading(true);
    try {
      const res = await login(lastPlayer);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      nav(from, { replace: true });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      logger.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return <Navigate to={ROUTES.GAME} replace />;
  }

  return (
    <section className="landing container-sm">
      <div className="panel landing__panel">
        <h1 className="landing__title">Welcome</h1>
        <p className="landing__subtitle">
          Enter your name to start the Memory Game.
        </p>

        {!session && lastPlayer && (
          <p className="badge text-center" aria-live="polite">
            Signed in previously as{" "}
            <strong className="link" onClick={startGameWithPreviousPlayer}>
              {lastPlayer}
            </strong>
          </p>
        )}

        <form
          className="form"
          onSubmit={onSubmit}
          aria-busy={loading}
          noValidate
        >
          <label className="form__group">
            <span className="form__label">Name</span>
            <input
              className="input"
              type="text"
              name="username"
              placeholder="e.g. Rafael Silva"
              value={username}
              onChange={onChangeInput}
              autoComplete="username"
              inputMode="text"
              aria-invalid={!!error}
              aria-describedby={error ? "username-error" : undefined}
              maxLength={20}
              disabled={loading}
              pattern="[A-Za-z0-9 _\-]{1,20}"
              enterKeyHint="go"
              autoFocus
            />
          </label>

          {error && (
            <div id="username-error" role="alert" className="form__error">
              {error}
            </div>
          )}

          <div className="form__actions">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {loading ? "Entering…" : "Enter"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Landing;
