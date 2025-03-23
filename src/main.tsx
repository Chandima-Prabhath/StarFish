import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App";
import Auth from "./pages/Auth";

import { App as CapacitorApp } from "@capacitor/app";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

import BackendApiClient from "./lib/BackendApiClient";
import SplashScreen from "./components/screens/SplashScreen";

import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { Toast } from "@capacitor/toast";

// Call the element loader before the render call
defineCustomElements(window);

const showToast = async (msg: any) => {
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

function saveUserInfo(user_id: number | null, username: string | null, first_name: string | null, last_name: string | null, email: string | null, bio: string | null, profile_picture: string | null) {
  localStorage.setItem('user_id', user_id !== null ? user_id.toString() : '');
  localStorage.setItem('username', username || '');
  localStorage.setItem('first_name', first_name || '');
  localStorage.setItem('last_name', last_name || '');
  localStorage.setItem('email', email || '');
  localStorage.setItem('bio', bio || '');
  localStorage.setItem('profile_picture', profile_picture || '');
}

const RenderApp: React.FC = () => {
  const [isSetupDone, setIsSetupDone] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await BackendApiClient.getCurrentUser();
        if (currentUser) {
          console.log("Current User:", currentUser);
          showToast(`Welcome back, ${currentUser?.username}`);
          setIsSetupDone(!!currentUser); // Set to true if currentUser exists, false otherwise
          saveUserInfo(
            currentUser.user_id || null,
            currentUser.username || null,
            currentUser.first_name || null,
            currentUser.last_name || null,
            currentUser.email || null,
            currentUser.bio || null,
            currentUser.profile_picture || null
          );
        } else {
          setIsSetupDone(false); // Consider setup not done if currentUser is null
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setIsSetupDone(false); // Consider setup not done in case of error
      }
    };
    getCurrentUser();
  }, [isSetupDone]);

  if (isSetupDone === null) {
    return <SplashScreen />;
  }

  return (
    <>
      {isSetupDone ? (
        <App />
      ) : (
        <Auth
          whenDone={(authToken) => {
            if (authToken) setIsSetupDone(true);
          }}
        />
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
