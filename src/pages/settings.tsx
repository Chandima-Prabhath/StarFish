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
    <div className="settings-page fade-in" data-oid="ll1dfp6">
      <h1 className="highlight-text" data-oid="82ev-k2">
        Settings
      </h1>
      <div className="info-container fade-in" data-oid="_y-_r6z">
        <h3 data-oid="lgu__6l">Username</h3>
        <p data-oid="1id-f_l">{username}</p>
        <h3 data-oid="5fpm2.7">App ID</h3>
        <p data-oid="bix9kp5">{appId}</p>
        <h3 data-oid="v-j9bow">App Version</h3>
        <p data-oid="3xo91sj">{appVersion}</p>
        <h3 data-oid="75jfk4k">App Build Number</h3>
        <p data-oid="q1881t1">{appBuildNumber}</p>
      </div>
    </div>
  );
}

export default SettingsPage;
