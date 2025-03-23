import { HomeIcon, CogIcon } from "@heroicons/react/20/solid";
import { NavLink, useLocation } from "react-router";

function BottomNavigation() {
  const location = useLocation();
  return (
    <nav className="navigation-bar" data-oid="uv0bb..">
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/"
        data-oid="zjvv72v"
      >
        <HomeIcon className="navigation-button-icon" data-oid="h240c:2" />
        <span data-oid="7vf52t0">Home</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/settings"
        data-oid="abtdf33"
      >
        <CogIcon className="navigation-button-icon" data-oid="m-lh_e_" />
        <span data-oid=":08nx85">Settings</span>
      </NavLink>
    </nav>
  );
}

export default BottomNavigation;
