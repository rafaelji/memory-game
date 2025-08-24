import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

const RequireAuth = () => {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to={ROUTES.LANDING} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
