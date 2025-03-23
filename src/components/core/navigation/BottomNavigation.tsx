import { HomeIcon, CogIcon } from "@heroicons/react/20/solid";
import { NavLink, useLocation } from "react-router";

function BottomNavigation() {
  const location = useLocation();
  return (
    <nav className="navigation-bar" data-oid="5n7h6re">
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/"
        data-oid="r5kiuwu"
      >
        <HomeIcon className="navigation-button-icon" data-oid="ss-22tp" />
        <span data-oid="als3kl7">Home</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/settings"
        data-oid="68zplz8"
      >
        <CogIcon className="navigation-button-icon" data-oid="x9:c2g9" />
        <span data-oid="j7-2xwn">Settings</span>
      </NavLink>
    </nav>
  );
}

export default BottomNavigation;
