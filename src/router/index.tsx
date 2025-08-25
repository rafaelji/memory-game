import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router";
import { ROUTES } from "@/constants/routes";
import Layout from "@/layout.tsx";
import Landing from "@/pages/landing/Landing.tsx";
import AppRouteError from "@/router/AppRouteError.tsx";
import RequireAuth from "@/router/RequireAuth.tsx";
import Game from "@/pages/game/Game.tsx";

const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />} errorElement={<AppRouteError />}>
        <Route index element={<Landing />} />
        <Route element={<RequireAuth />}>
          <Route path={ROUTES.GAME} element={<Game />} />
          <Route path={ROUTES.SCORE} element={<>Game Score</>} />
        </Route>
        <Route path="*" element={<>404</>} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default Router;
