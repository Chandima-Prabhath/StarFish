import { HomeIcon, CogIcon } from "@heroicons/react/20/solid";
import { NavLink, useLocation } from "react-router";

function BottomNavigation() {
  const location = useLocation();
  return (
    <nav className="navigation-bar" data-oid="sm.a4g_">
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/"
        data-oid="-9zb8s."
      >
        <HomeIcon className="navigation-button-icon" data-oid="1-7jv0g" />
        <span data-oid="::vxogl">Home</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/settings"
        data-oid="ocauag6"
      >
        <CogIcon className="navigation-button-icon" data-oid="r9d057p" />
        <span data-oid="kctzphk">Settings</span>
      </NavLink>
    </nav>
  );
}

export default BottomNavigation;
