import { Outlet } from "react-router";
import TopBar from "./components/top-bar/TopBar.tsx";

const Layout = () => {
  return (
    <>
      <TopBar />
      <main id="main" className="container-lg" role="main">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
