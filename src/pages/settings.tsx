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
    <div className="settings-page fade-in" data-oid="2yeubyp">
      <h1 className="highlight-text" data-oid="dvz-m5q">
        Settings
      </h1>
      <div className="info-container fade-in" data-oid="2-rf0ah">
        <h3 data-oid="7v36b8q">Username</h3>
        <p data-oid="moyxiv6">{username}</p>
        <h3 data-oid=":ai4dqp">App ID</h3>
        <p data-oid="hrbwww8">{appId}</p>
        <h3 data-oid="laduf:w">App Version</h3>
        <p data-oid="nk-qvan">{appVersion}</p>
        <h3 data-oid="_bfq.83">App Build Number</h3>
        <p data-oid="9uao.z.">{appBuildNumber}</p>
      </div>
    </div>
  );
}

export default SettingsPage;
