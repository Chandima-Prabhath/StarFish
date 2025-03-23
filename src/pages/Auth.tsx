import React, { useState } from "react";
import BackendApiClient from "../lib/BackendApiClient";
import { Toast } from "@capacitor/toast";
import "./Auth.css";
import {
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/20/solid";

interface AuthProps {
  whenDone: (authToken?: string) => void;
}

// Helper function to display a toast message
const showToast = async (msg: string) => {
  await Toast.show({ text: msg });
};

const Auth: React.FC<AuthProps> = ({ whenDone }) => {
  // Form mode: login or signup
  const [mode, setMode] = useState<"login" | "signup">("login");
  // Basic form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  // Extra fields (good to have)
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Error state
  const [errorMessage, setErrorMessage] = useState("");

  const isLoginMode = mode === "login";

  // Generic handler for text inputs
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(event.target.value);
  };

  // Toggle between login and signup
  const toggleMode = () => {
    setMode(isLoginMode ? "signup" : "login");
    setErrorMessage("");
  };

  // Handle form submission
  const handleSubmit = async () => {
    setErrorMessage("");

    if (isLoginMode) {
      // ** LOGIN LOGIC **
      if (!username || !password) {
        const msg = "Please enter your username and password.";
        setErrorMessage(msg);
        showToast(msg);
        return;
      }
      try {
        const response = await BackendApiClient.login(username, password);
        if (response?.access_token) {
          // Save auth token & proceed
          whenDone(response.access_token);
        } else if (response?.error) {
          setErrorMessage(response.error);
          showToast(response.error);
        } else {
          const msg = "Login failed. Please try again.";
          setErrorMessage(msg);
          showToast(msg);
        }
      } catch (error: any) {
        console.error("Login error:", error);
        const msg =
          error?.response?.data?.detail ||
          error.message ||
          "An unexpected error occurred during login.";
        setErrorMessage(msg);
        showToast(msg);
      }
    } else {
      // ** SIGNUP LOGIC **
      if (!username || !email || !password || !firstName || !lastName) {
        const msg =
          "Please enter a username, email, password, first name, and last name.";
        setErrorMessage(msg);
        showToast(msg);
        return;
      }
      try {
        const userData = {
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        };
        const response = await BackendApiClient.createUser(userData);
        if (response?.user_id) {
          // On success, switch to login mode
          setMode("login");
          showToast("Signup successful! Please log in.");
        } else {
          const msg = "Signup failed. Please try again.";
          setErrorMessage(msg);
          showToast(msg);
        }
      } catch (error: any) {
        console.error("Signup error:", error);
        const msg =
          error?.response?.data?.detail ||
          error.message ||
          "An unexpected error occurred during signup.";
        setErrorMessage(msg);
        showToast(msg);
      }
    }
  };

  return (
    <div className="auth-container fade-in">
      <h1 className="auth-title">{isLoginMode ? "Login" : "Sign Up"}</h1>
      <p className="auth-subtitle">
        {isLoginMode
          ? "Welcome back! Please log in to continue."
          : "Create a new account to get started."}
      </p>

      {/* Auth Form */}
      <div className="auth-form">
        {/* Username */}
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => handleInputChange(e, setUsername)}
          />
        </div>

        {/* Email (Signup only) */}
        {!isLoginMode && (
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
            />
          </div>
        )}

        {/* First & Last Name (Signup only) */}
        {!isLoginMode && (
          <div className="name-fields">
            <div className="input-group">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => handleInputChange(e, setFirstName)}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => handleInputChange(e, setLastName)}
              />
            </div>
          </div>
        )}

        {/* Password */}
        <div className="input-group password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="password-icon" />
            ) : (
              <EyeIcon className="password-icon" />
            )}
          </button>
        </div>

        {/* Remember Me & Forgot Password (Login only) */}
        {isLoginMode && (
          <div className="auth-extras">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            <button
              type="button"
              className="forgot-password link-button"
              onClick={() => showToast("Forgot password flow not implemented.")}
            >
              Forgot Password?
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Submit Button */}
      <button type="button" className="auth-submit" onClick={handleSubmit}>
        {isLoginMode ? "Login" : "Sign Up"}
      </button>

      {/* Toggle Mode Link */}
      <p className="toggle-mode">
        {isLoginMode ? (
          <>
            Don’t have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={toggleMode}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={toggleMode}
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default Auth;
