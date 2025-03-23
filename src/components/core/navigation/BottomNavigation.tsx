import { HomeIcon, CogIcon, MagnifyingGlassIcon, MapIcon, NewspaperIcon, UserIcon } from "@heroicons/react/20/solid";
import { NavLink, useLocation } from "react-router";

function BottomNavigation() {
  const location = useLocation();
  return (
    <nav className="navigation-bar">
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/map"
      >
        <MapIcon className="navigation-button-icon" />
        <span>Map</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/search"
      >
        <MagnifyingGlassIcon className="navigation-button-icon" />
        <span>Search</span>
      </NavLink>

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
        to="/events"
      >
        <NewspaperIcon className="navigation-button-icon" />
        <span>Events</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/profile"
      >
        <UserIcon className="navigation-button-icon" />
        <span>Profile</span>
      </NavLink>

    </nav>
  );
}

export default BottomNavigation;
