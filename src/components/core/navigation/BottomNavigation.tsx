import { HomeIcon, CogIcon } from "@heroicons/react/20/solid";
import {
    NavLink,
    useLocation,
  } from "react-router";

function BottomNavigation() {
  const location = useLocation();
  return (
    <nav className="navigation-bar">
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/"
      >
        <HomeIcon className="navigation-button-icon" />
        <span>Home</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/settings"
      >
        <CogIcon className="navigation-button-icon" />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
}

export default BottomNavigation;