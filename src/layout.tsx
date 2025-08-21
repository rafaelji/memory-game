import { Outlet } from "react-router";
import TopBar from "./components/top-bar/TopBar.tsx";

const Layout = () => {
  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
};

export default Layout;
