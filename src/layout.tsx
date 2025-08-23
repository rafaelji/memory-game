import { Navigate, Outlet, useLocation } from "react-router";
import TopBar from "./components/top-bar/TopBar.tsx";
import useAuth from "./hooks/useAuth";
import { ROUTES } from "./constants/routes";

const Layout = () => {
  const { session } = useAuth();
  const location = useLocation();

  if (location.pathname !== ROUTES.LANDING && !session) {
    return <Navigate to={ROUTES.LANDING} replace state={{ from: location }} />;
  }

  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
};

export default Layout;
