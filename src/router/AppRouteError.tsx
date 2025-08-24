import { isRouteErrorResponse, useRouteError } from "react-router";
import logger from "@/services/logger";
import TopBar from "@/components/top-bar/TopBar";

export default function AppRouteError() {
  const err = useRouteError();

  logger.error(err);

  return (
    <>
      <TopBar />
      <main id="main" className="container-lg mt-8" role="main">
        <div className="panel text-center" role="alert" aria-live="assertive">
          {isRouteErrorResponse(err) ? (
            <>
              <h1 className="mt-0">Oops</h1>
              <p>
                {err.status} – {err.statusText}
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-0">Something went wrong</h1>
              <p>Please try again.</p>
            </>
          )}
          <button
            className="btn btn--primary"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </main>
    </>
  );
}
