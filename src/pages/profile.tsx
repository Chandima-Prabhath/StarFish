import { useState, useEffect } from "react";
import "./profile.css";
import {
  BeakerIcon,
  InformationCircleIcon
} from "@heroicons/react/20/solid";
import { CodeBracketIcon } from "@heroicons/react/24/solid"; // or 20/solid if desired
import { App as CapacitorApp } from "@capacitor/app";

function logout() {
  localStorage.clear();
  window.location.href = "/";
}


function ProfilePage() {
  const [ username , setUsername] = useState("");
  const [ firstName, setFirstName] = useState("");
  const [ lastName, setLastName] = useState("");
  const [ email, setEmail] = useState("");
  const [ bio, setBio] = useState("");
  const [ profilePicture, setProfilePicture] = useState("");

  const [appId, setAppId] = useState("Loading...");
  const [appVersion, setAppVersion] = useState("Loading...");
  const [appBuildNumber, setAppBuildNumber] = useState("Loading...");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setFirstName(localStorage.getItem("first_name") || "");
    setLastName(localStorage.getItem("last_name") || "");
    setEmail(localStorage.getItem("email") || "");
    setBio(localStorage.getItem("bio") || "");
    setProfilePicture(localStorage.getItem("profile_picture") || "");

    CapacitorApp.getInfo().then((info) => {
      setAppVersion(info.version);
      setAppBuildNumber(info.build);
      setAppId(info.id);
    });
  }, []);

  return (
    <div className="profile-page scroll-page fade-in">
      <div className="profile-header">
        <h1 className="highlight-text">Profile</h1>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-container fade-in">
          <img
            src={profilePicture || "https://placehold.co/150"}
            alt="Profile"
            className="profile-picture"
          />
          <h3 className="profile-name">
            {firstName} {lastName}
          </h3>
          <p className="profile-username">@{username}</p>
          <p className="profile-email">{email}</p>
          <p className="profile-bio">{bio}</p>

          <div className="profile-actions">
            <button className="btn edit-profile">Edit Profile</button>
            <button className="btn logout" onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Settings / App Info */}
        <div className="settings-container">
          <h2 className="settings-title">About</h2>
          <div className="settings-list">
            {/* App ID */}
            <div className="setting-item">
              <span className="setting-label">App ID</span>
              <span className="setting-value">
                <CodeBracketIcon className="setting-icon" />
                {appId}
              </span>
            </div>

            {/* App Version */}
            <div className="setting-item">
              <span className="setting-label">App Version</span>
              <span className="setting-value">
                <InformationCircleIcon className="setting-icon" />
                {appVersion}
              </span>
            </div>

            {/* Build Number */}
            <div className="setting-item">
              <span className="setting-label">Build Number</span>
              <span className="setting-value">
                <BeakerIcon className="setting-icon" />
                {appBuildNumber}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
