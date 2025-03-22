import React, { useState } from 'react';
import BackendApiClient from '../lib/BackendApiClient';
import { Toast } from '@capacitor/toast';

// Define the props interface for the component
interface FirstTimeSetupProps {
  whenDone: (authToken?: string) => void; // Callback function to execute when setup is complete, optionally passing an authentication token
}

// Import the CSS module for styling
import "./FirstTimeSetup.css";

// Helper function to display a toast message
const showToast = async (msg: string) => {
  await Toast.show({
    text: msg,
  });
};

// Main functional component for the first-time setup screen
const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ whenDone }) => {
  // State to manage the current mode: 'login' or 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  // State for the username input
  const [username, setUsername] = useState('');
  // State for the email input (only used in signup mode)
  const [email, setEmail] = useState('');
  // State for the password input
  const [password, setPassword] = useState('');
  // State to display any error messages to the user
  const [errorMessage, setErrorMessage] = useState('');

  // Helper variable to check if the current mode is 'login'
  const isLoginMode = mode === 'login';

  // Generic handler for input field changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(event.target.value);
  };

  // Function to handle the form submission (login or signup)
  const handleSubmit = async () => {
    setErrorMessage(''); // Clear any previous error messages

    if (isLoginMode) {
      // Login mode logic
      if (!username || !password) {
        setErrorMessage('Please enter your username and password.');
        showToast('Please enter your username and password.');
        return;
      }
      try {
        const response = await BackendApiClient.login(username, password);
        console.log('Login response:', response);
        if (response?.access_token) {
          // Store the authentication token and call the 'whenDone' callback
          whenDone(response.access_token);
        } else if (response?.error) {
          setErrorMessage(response.error);
          showToast(response.error);
        } else {
          const message = 'Login failed. Please try again.';
          showToast(message);
          setErrorMessage(message);
        }
      } catch (error: any) {
        console.error('Login error:', error);
        const message = error?.response?.data?.detail || error.message || 'An unexpected error occurred during login.';
        showToast(message);
        setErrorMessage(message);
      }
    } else {
      // Signup mode logic
      if (!username || !email || !password) {
        const message = 'Please enter a username, email, and password.';
        showToast(message);
        setErrorMessage(message);
        return;
      }
      try {
        const userData = {
          username,
          email,
          password,
        };
        const response = await BackendApiClient.createUser(userData);
        if (response?.user_id) {
          // Switch back to login mode after successful signup
          setMode('login');
          showToast('Signup successful! Please log in.');
        } else {
          const message = 'Signup failed. Please try again.';
          setErrorMessage(message);
          showToast(message);
        }
      } catch (error: any) {
        console.error('Signup error:', error);
        const message = error?.response?.data?.detail || error.message || 'An unexpected error occurred during signup.';
        setErrorMessage(message);
        showToast(message);
      }
    }
  };

  // Function to toggle between login and signup modes
  const toggleMode = () => {
    setMode(isLoginMode ? 'signup' : 'login');
    setErrorMessage(''); // Clear any existing error messages when switching modes
  };

  return (
    <div className="first-time-setup fade-in">
      <h1>{isLoginMode ? 'Login' : 'Sign Up'}</h1>
      <p>
        {isLoginMode
          ? 'Welcome back! Please log in to continue.'
          : 'Create a new account to get started.'}
      </p>

      <p>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Your Username"
          value={username}
          onChange={(e) => handleInputChange(e, setUsername)}
        />
      </p>

      {!isLoginMode && (
        <p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => handleInputChange(e, setEmail)}
          />
        </p>
      )}

      <p>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => handleInputChange(e, setPassword)}
        />
      </p>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button type="button" onClick={handleSubmit}>
        {isLoginMode ? 'Login' : 'Sign Up'}
      </button>

      <p className="toggle-mode">
        {isLoginMode ? (
          <>
            Don't have an account?{' '}
            <button type="button" className="link-button" onClick={toggleMode}>
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" className="link-button" onClick={toggleMode}>
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default FirstTimeSetup;