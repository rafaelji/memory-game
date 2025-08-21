import { Link } from "react-router";
import { ROUTES } from "../../router/routes.ts";
import "./TopBar.css";

const TopBar = () => {
  return (
    <header className="topbar" role="banner">
      <div className="topbar__inner">
        <Link
          to={ROUTES.LANDING}
          className="topbar__brand"
          aria-label="Go to landing page"
        >
          <span className="topbar__title">Memory Game</span>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
