import { Routes, Route } from "react-router";
import { ROUTES } from "./routes.ts";
import Layout from "../layout.tsx";

const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<>Landing Page</>} />
        <Route path={ROUTES.GAME} element={<>Game Board</>} />
        <Route path={ROUTES.SCORE} element={<>Game Score</>} />
        <Route path="*" element={<>404</>} />
      </Route>
    </Routes>
  );
};

export default Router;
