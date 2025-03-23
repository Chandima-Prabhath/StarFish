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
    <div className="settings-page fade-in" data-oid="mhi3d8q">
      <h1 className="highlight-text" data-oid="lvsjdc5">
        Settings
      </h1>
      <div className="info-container fade-in" data-oid="dqq-6:w">
        <h3 data-oid="0sxeebf">Username</h3>
        <p data-oid="idybg_v">{username}</p>
        <h3 data-oid="t-sx73j">App ID</h3>
        <p data-oid="nas:_pa">{appId}</p>
        <h3 data-oid="ckaf99p">App Version</h3>
        <p data-oid="qi9-41r">{appVersion}</p>
        <h3 data-oid="fw781tp">App Build Number</h3>
        <p data-oid="8ac:bcu">{appBuildNumber}</p>
      </div>
    </div>
  );
}

export default SettingsPage;
