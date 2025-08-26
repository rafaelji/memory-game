import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
} from "react-router";
import { describe, expect, vi, it } from "vitest";
import { ROUTES } from "@/constants/routes";
import RequireAuth from "@/router/RequireAuth";

// Mock the auth hook. Default: not authenticated.
vi.mock("@/hooks/useAuth", () => {
  return {
    default: () => ({ session: null }),
  };
});

function AppShell() {
  return (
    <div>
      layout
      <Outlet />
    </div>
  );
}

function Landing() {
  return <div data-testid="landing">landing</div>;
}

function PrivatePage() {
  return <div data-testid="private">private</div>;
}

describe("RequireAuth", () => {
  it("redirects to landing when unauthenticated", async () => {
    const router = createMemoryRouter(
      createRoutesFromElements(
        <Route element={<AppShell />}>
          <Route path={ROUTES.LANDING} element={<Landing />} />
          <Route element={<RequireAuth />}>
            <Route path={ROUTES.GAME} element={<PrivatePage />} />
          </Route>
        </Route>,
      ),
      { initialEntries: [ROUTES.GAME] },
    );

    render(<RouterProvider router={router} />);
    expect(await screen.findByTestId("landing")).toBeInTheDocument();
    expect(screen.queryByTestId("private")).not.toBeInTheDocument();
  });

  it("allows access when authenticated", async () => {
    // Swap the mocked hook to authenticated for this test
    const useAuth = await import("@/hooks/useAuth");
    // @ts-expect-error reassigning mocked default
    useAuth.default = () => ({ session: { username: "rafa" } });

    const router = createMemoryRouter(
      createRoutesFromElements(
        <Route element={<AppShell />}>
          <Route path={ROUTES.LANDING} element={<Landing />} />
          <Route element={<RequireAuth />}>
            <Route path={ROUTES.GAME} element={<PrivatePage />} />
          </Route>
        </Route>,
      ),
      { initialEntries: [ROUTES.GAME] },
    );

    render(<RouterProvider router={router} />);
    expect(await screen.findByTestId("private")).toBeInTheDocument();
    expect(screen.queryByTestId("landing")).not.toBeInTheDocument();
  });
});
