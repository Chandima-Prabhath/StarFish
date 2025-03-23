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
    <div className="settings-page fade-in" data-oid="_ycswig">
      <h1 className="highlight-text" data-oid="mff6we9">
        Settings
      </h1>
      <div className="info-container fade-in" data-oid="1alaw.v">
        <h3 data-oid="rcnru7d">Username</h3>
        <p data-oid="k1:zgr:">{username}</p>
        <h3 data-oid="w2f01vj">App ID</h3>
        <p data-oid="04785wd">{appId}</p>
        <h3 data-oid="kx8s03d">App Version</h3>
        <p data-oid="im9.f87">{appVersion}</p>
        <h3 data-oid="8wo7pvj">App Build Number</h3>
        <p data-oid="46jwmv3">{appBuildNumber}</p>
      </div>
    </div>
  );
}

export default SettingsPage;
