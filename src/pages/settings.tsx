import { useState, useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";

function SettingsPage() {
  const [username, setUsername] = useState("");
  const [appId, setAppId] = useState("Loading...");
  const [appVersion, setAppVersion] = useState("Loading...");
  const [appBuildNumber, setAppBuildNumber] = useState("Loading...");

  useEffect(() => {
    CapacitorApp.getInfo().then((info) => {
      setAppVersion(info.version);
      setAppBuildNumber(info.build);
      setAppId(info.id);
    });
    setUsername(localStorage.getItem("username") || "");
  }, []);
  return (
    <div className="settings-page fade-in">
      <h1 className="highlight-text">Settings</h1>
      <div className="info-container fade-in">
        <h3>Username</h3>
        <p>{username}</p>
        <h3>App ID</h3>
        <p>{appId}</p>
        <h3>App Version</h3>
        <p>{appVersion}</p>
        <h3>App Build Number</h3>
        <p>{appBuildNumber}</p>
      </div>
    </div>
  );
}

export default SettingsPage;
