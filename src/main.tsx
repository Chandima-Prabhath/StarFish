import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App";
import FirstTimeSetup from "./pages/FirstTimeSetup";

import { App as CapacitorApp } from "@capacitor/app";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

import BackendApiClient from './lib/BackendApiClient';
import SplashScreen from "./components/screens/SplashScreen";

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Toast } from '@capacitor/toast';

// Call the element loader before the render call
defineCustomElements(window);

const showToast = async (msg:any) => {
  await Toast.show({
    text: msg,
  });
};

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
  const [isSetupDone, setIsSetupDone] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await BackendApiClient.getCurrentUser();
        console.log("Current User:", currentUser);
        showToast(`Welcome back, ${currentUser?.username}`)
        setIsSetupDone(!!currentUser); // Set to true if currentUser exists, false otherwise
      } catch (error) {
        console.error("Error fetching current user:", error);
        setIsSetupDone(false); // Consider setup not done in case of error
      }
    };
    getCurrentUser();
  }, []);

  if (isSetupDone === null) {
    return <SplashScreen/>;
  }

  return (
    <>
      {isSetupDone ? (
        <App />
      ) : (
        <FirstTimeSetup whenDone={(authToken) => { if (authToken) setIsSetupDone(true); }} />
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
  </React.StrictMode>,
);
