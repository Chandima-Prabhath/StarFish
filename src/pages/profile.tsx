import { useState, useEffect, useRef, useCallback } from "react";
import "./profile.css";
import "react-image-crop/dist/ReactCrop.css";
import {
  ArrowUpTrayIcon,
  BeakerIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from "@heroicons/react/20/solid";
import { CodeBracketIcon, PencilIcon } from "@heroicons/react/24/solid";
import { App as CapacitorApp } from "@capacitor/app";
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import BackendApiClient from "../lib/BackendApiClient";

// Helper function to get a centered square crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: mediaWidth,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

function logout() {
  localStorage.clear();
  window.location.href = "/";
}

function ProfilePage() {
  // User info state including userId
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [appId, setAppId] = useState("Loading...");
  const [appVersion, setAppVersion] = useState("Loading...");
  const [appBuildNumber, setAppBuildNumber] = useState("Loading...");

  // Crop related state
  const [showCropUI, setShowCropUI] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Edit profile modal state
  const [editingProfile, setEditingProfile] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBio, setEditBio] = useState("");

  useEffect(() => {
    // Load user info from localStorage, including the user_id
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
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

  // Open file input for profile picture change
  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // When a file is selected, load and show crop UI
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSelectedImage(reader.result as string);
        setShowCropUI(true);
      });
      reader.readAsDataURL(file);
    }
  };

  // Compute a centered 1:1 crop on image load
  const onImageLoaded = useCallback((img: HTMLImageElement) => {
    imageRef.current = img;
    const { naturalWidth, naturalHeight } = img;
    const initialCrop = centerAspectCrop(naturalWidth, naturalHeight, 1);
    setCrop(initialCrop);
    return false;
  }, []);

  // Generate cropped image blob from the crop selection
  const getCroppedImgBlob = async (): Promise<Blob | null> => {
    if (!imageRef.current || !completedCrop) return null;
    const image = imageRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width!;
    canvas.height = completedCrop.height!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(
      image,
      completedCrop.x! * scaleX,
      completedCrop.y! * scaleY,
      completedCrop.width! * scaleX,
      completedCrop.height! * scaleY,
      0,
      0,
      completedCrop.width!,
      completedCrop.height!
    );
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        0.8
      );
    });
  };

  // Upload the cropped image as the new profile picture
  const handleUploadCroppedImage = async () => {
    const blob = await getCroppedImgBlob();
    if (!blob) return;
    setUploading(true);
    setUploadSuccess(false);
    try {
      // Convert Blob to a File instance (with a name and type)
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      const updatedUser = await BackendApiClient.uploadProfilePicture(file);
      if (updatedUser.profile_picture) {
        setProfilePicture(updatedUser.profile_picture);
        localStorage.setItem("profile_picture", updatedUser.profile_picture);
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error("Failed to upload cropped image:", error);
    }
    setUploading(false);
    setShowCropUI(false);
    setSelectedImage(null);
    setCrop({ unit: "%", x: 25, y: 25, width: 50, height: 50 });
    setCompletedCrop(null);
  };


  // Open edit profile modal and prefill fields
  const openEditProfile = () => {
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setEditEmail(email);
    setEditBio(bio);
    setEditingProfile(true);
    setEditSuccess(false);
  };

  // Save profile changes via API using updateUser(userId, userData)
  const handleSaveProfile = async () => {
    if (userId === null) {
      console.error("User ID is missing. Cannot update profile.");
      return;
    }
    setEditLoading(true);
    setEditSuccess(false);
    try {
      const updatedUser = await BackendApiClient.updateUser(userId, {
        first_name: editFirstName,
        last_name: editLastName,
        email: editEmail,
        bio: editBio,
      });
      // Update local state and storage
      setFirstName(updatedUser.first_name || "");
      setLastName(updatedUser.last_name || "");
      setEmail(updatedUser.email || "");
      setBio(updatedUser.bio || "");
      localStorage.setItem("first_name", updatedUser.first_name || "");
      localStorage.setItem("last_name", updatedUser.last_name || "");
      localStorage.setItem("email", updatedUser.email || "");
      localStorage.setItem("bio", updatedUser.bio || "");
      setEditSuccess(true);
      setEditingProfile(false)
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    setEditLoading(false);
  };

  return (
    <div className="profile-page scroll-page fade-in">
      <div className="profile-header">
        <h1 className="highlight-text">Profile</h1>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-container fade-in">
          <div className="top-profile-section">
            <div
              className="profile-picture-container"
              style={{ position: "relative", display: "inline-block" }}
            >
              <img
                src={profilePicture || "https://placehold.co/150"}
                alt="Profile"
                className="profile-picture"
              />
              <div
                className="edit-icon"
                onClick={handleEditClick}
                title="Change Profile Picture"
                style={{
                  position: "absolute",
                  bottom: ".4rem",
                  right: ".2rem",
                  cursor: "pointer"
                }}
              >
                <PencilIcon style={{ width: "20px", height: "20px" }} />
              </div>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <div>
              <h3 className="profile-name">
                {firstName} {lastName}
              </h3>
              <p className="profile-username">@{username}</p>
              <p className="profile-email">{email}</p>
            </div>
          </div>
          
          <p className="profile-bio">{bio}</p>

          <div className="profile-actions">
            <button className="btn edit-profile" onClick={openEditProfile}>
              Edit Profile
            </button>
            <button className="btn logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {editingProfile && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit Profile</h3>
              <div className="modal-inputs">
                <label>
                  First Name:
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                  />
                </label>
                <label>
                  Last Name:
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </label>
                <label>
                  Bio:
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                  />
                </label>
              </div>
              <div className="modal-buttons">
                <button
                  className="btn save"
                  onClick={handleSaveProfile}
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="btn cancel"
                  onClick={() => setEditingProfile(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cropper Modal UI */}
        {showCropUI && selectedImage && (
          <div className="cropper-modal">
            <div className="cropper-content">
              <div className="cropper-buttons">
                <h3>Crop Image</h3>
                <button
                  className="btn upload"
                  onClick={handleUploadCroppedImage}
                  disabled={uploading}
                >
                  {uploading ? <> <ArrowUpTrayIcon className="setting-icon" />Uploading</> : <> <CheckCircleIcon className="setting-icon" />Done</>}
                </button>
                <button
                  className="btn cancel"
                  onClick={() => {
                    setShowCropUI(false);
                    setSelectedImage(null);
                  }}
                >
                  <XMarkIcon className="setting-icon" /> Close
                </button>
              </div>
              <ReactCrop
                crop={crop}
                ruleOfThirds
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
              >
                <img
                  src={selectedImage}
                  onLoad={(e) => onImageLoaded(e.currentTarget)}
                  alt="Crop source"
                />
              </ReactCrop>

            </div>
          </div>
        )}

        {/* Settings / App Info */}
        <div className="settings-container">
          <h2 className="settings-title">About</h2>
          <div className="settings-list">
            <div className="setting-item">
              <span className="setting-label">App ID</span>
              <span className="setting-value">
                <CodeBracketIcon className="setting-icon" />
                {appId}
              </span>
            </div>
            <div className="setting-item">
              <span className="setting-label">App Version</span>
              <span className="setting-value">
                <InformationCircleIcon className="setting-icon" />
                {appVersion}
              </span>
            </div>
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
