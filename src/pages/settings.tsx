import { useState, useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";

function SettingsPage() {
  const [appId, setAppId] = useState("Loading...");
  const [appVersion, setAppVersion] = useState("Loading...");
  const [appBuildNumber, setAppBuildNumber] = useState("Loading...");

  useEffect(() => {
    CapacitorApp.getInfo().then((info) => {
      setAppVersion(info.version);
      setAppBuildNumber(info.build);
      setAppId(info.id);
    });
  }, []);
  return (
    <div className="settings-page fade-in" data-oid="jf7dpc8">
      <h1 className="highlight-text" data-oid="5vt:yxf">
        Settings
      </h1>
      <div className="info-container fade-in" data-oid="-6brsii">
        <h3 data-oid="2q1m6b5">App ID</h3>
        <p data-oid="1v7qk9m">{appId}</p>
        <h3 data-oid="7p3zvvh">App Version</h3>
        <p data-oid="k4ztq_n">{appVersion}</p>
        <h3 data-oid="vn._ovx">App Build Number</h3>
        <p data-oid="mv-ejo8">{appBuildNumber}</p>
      </div>
    </div>
  );
}

export default SettingsPage;
