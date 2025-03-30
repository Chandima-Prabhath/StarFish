import { useState, useEffect, useRef, useCallback } from "react";
import "./profile.css";
import "react-image-crop/dist/ReactCrop.css";
import {
  BeakerIcon,
  InformationCircleIcon
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
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [appId, setAppId] = useState("Loading...");
  const [appVersion, setAppVersion] = useState("Loading...");
  const [appBuildNumber, setAppBuildNumber] = useState("Loading...");

  // Crop related states
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

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // When a file is selected, load it and display the crop UI.
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

  // When the image is loaded, compute a centered square crop.
  const onImageLoaded = useCallback((img: HTMLImageElement) => {
    imageRef.current = img;
    const { naturalWidth, naturalHeight } = img;
    const initialCrop = centerAspectCrop(naturalWidth, naturalHeight, 1);
    setCrop(initialCrop);
    return false;
  }, []);

  // Create a cropped blob from the image and the selected crop.
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
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.8
      );
    });
  };

  const handleUploadCroppedImage = async () => {
    const blob = await getCroppedImgBlob();
    if (!blob) return;
    setUploading(true);
    setUploadSuccess(false);
    try {
      const updatedUser = await BackendApiClient.uploadProfilePicture(blob as File);
      if (updatedUser.profile_picture) {
        setProfilePicture(updatedUser.profile_picture);
        localStorage.setItem("profile_picture", updatedUser.profile_picture);
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error("Failed to upload cropped image:", error);
    }
    setUploading(false);
    // Reset crop UI
    setShowCropUI(false);
    setSelectedImage(null);
    setCrop({ unit: "%", x: 25, y: 25, width: 50, height: 50 });
    setCompletedCrop(null);
  };

  return (
    <div className="profile-page scroll-page fade-in">
      <div className="profile-header">
        <h1 className="highlight-text">Profile</h1>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-container fade-in">
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
                bottom: "1rem",
                right: ".5rem",
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
          <h3 className="profile-name">
            {firstName} {lastName}
          </h3>
          <p className="profile-username">@{username}</p>
          <p className="profile-email">{email}</p>
          <p className="profile-bio">{bio}</p>

          <div className="profile-actions">
            <button className="btn edit-profile">Edit Profile</button>
            <button className="btn logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {/* Cropper Modal UI */}
        {showCropUI && selectedImage && (
          <div className="cropper-modal">
            <div className="cropper-content">
              <h3>Crop Your Image</h3>
              <ReactCrop
                crop={crop}
                ruleOfThirds
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
              >
                <img src={selectedImage} onLoad={(e) => onImageLoaded(e.currentTarget)} alt="Crop source" />
              </ReactCrop>
              <div className="cropper-buttons">
                <button className="btn upload" onClick={handleUploadCroppedImage} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Cropped Image"}
                </button>
                <button className="btn cancel" onClick={() => { setShowCropUI(false); setSelectedImage(null); }}>
                  Cancel
                </button>
              </div>
              {uploadSuccess && !uploading && (
                <div className="upload-success">
                  Profile picture updated!
                </div>
              )}
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
