import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import App from "./App";
import "./index.css";
import SettingsPage from "./pages/settings";
import { App as CapacitorApp } from "@capacitor/app";
import { HomeIcon, CogIcon } from "@heroicons/react/20/solid";

const BackButtonHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let backButtonListener: any;
    // Listen for the Capacitor back button event
    CapacitorApp.addListener("backButton", () => {
      // Check if browser history has previous entries by examining window.history.state.idx
      const state = window.history.state;
      if (
        state &&
        typeof state.idx === "number" &&
        state.idx > 0 &&
        location.pathname !== "/"
      ) {
        navigate(-1);
      } else {
        // No history available; exit the app
        CapacitorApp.exitApp();
      }
    }).then((listener) => {
      backButtonListener = listener;
    });

    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [navigate]);

  return null;
};

function Layout() {
  const location = useLocation();
  return (
    <nav className="navigation-bar" data-oid="dt1dhu7">
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/"
        data-oid="7qyqfnf"
      >
        <HomeIcon className="navigation-button-icon" data-oid="7i99dx0" />
        <span data-oid="z1vzv9n">Home</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "navigation-button active" : "navigation-button"
        }
        to="/settings"
        data-oid="j4km7bb"
      >
        <CogIcon className="navigation-button-icon" data-oid="a4nl.ip" />
        <span data-oid=":9pp:3w">Settings</span>
      </NavLink>
    </nav>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode data-oid="7xozi84">
    <BrowserRouter data-oid="jn:ijmn">
      <div className="App" data-oid="gswighd">
        <BackButtonHandler data-oid="jbhjcs_" />
        <Routes data-oid="1yvlfun">
          <Route
            path="/"
            element={<App data-oid="o2axol0" />}
            data-oid="xbqi1hp"
          />

          <Route
            path="/settings"
            element={<SettingsPage data-oid="jfq5734" />}
            data-oid="8:d65di"
          />
        </Routes>
        <Layout data-oid="zl4l0q8" />
      </div>
    </BrowserRouter>
  </React.StrictMode>,
);
