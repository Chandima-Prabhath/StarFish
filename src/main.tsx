import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App";
import FirstTimeSetup from "./pages/FirstTimeSetup";

import { App as CapacitorApp } from "@capacitor/app";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

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

const RenderApp: React.FC = () => {
  const [isSetupDone, setIsSetupDone] = React.useState(false);

  React.useEffect(() => {
    const setup = localStorage.getItem("setup");
    if (setup === "true") {
      setIsSetupDone(true);
    }
  }, []);

  return (
    <>
      {isSetupDone ? (
        <App />
      ) : (
        <FirstTimeSetup whenDone={() => setIsSetupDone(true)} />
      )}
    </>
  );
};


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <BackButtonHandler />
      <RenderApp />
    </BrowserRouter>
  </React.StrictMode>
);
