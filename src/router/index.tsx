import { lazy } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router";
import { ROUTES } from "@/constants/routes";
import Layout from "@/layout.tsx";
import AppRouteError from "@/router/AppRouteError.tsx";
import RequireAuth from "@/router/RequireAuth.tsx";

const Landing = lazy(() => import("@/pages/landing/Landing"));
const Game = lazy(() => import("@/pages/game/Game"));
const ScoreModal = lazy(() => import("@/pages/score/ScoreModal"));

const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />} errorElement={<AppRouteError />}>
        <Route index element={<Landing />} />
        <Route element={<RequireAuth />}>
          <Route path={ROUTES.GAME} element={<Game />}>
            <Route path={ROUTES.SCORE} element={<ScoreModal />} />
          </Route>
        </Route>
        <Route path="*" element={<>404</>} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default Router;
