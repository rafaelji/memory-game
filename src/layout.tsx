import { Suspense } from "react";
import { Outlet } from "react-router";
import TopBar from "./components/top-bar/TopBar.tsx";
import PageLoader from "@/components/page-loader/PageLoader"; // novo fallback

const Layout = () => {
  return (
    <>
      <TopBar />
      <main id="main" className="container-lg" role="main">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
};

export default Layout;
