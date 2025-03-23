import React from "react";
import { motion } from "framer-motion";
import Logo from "../../assets/logo.png";
import "./SplashScreen.css";

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen">
      {/* Animated Background Overlay (optional) */}
      <div className="background-animation" />

      {/* Logo Container with a Glow/Halo */}
      <motion.div
        className="logo-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="logo-halo" />
        <img src={Logo} alt="App Logo" />
      </motion.div>

      {/* Tagline (optional) */}
      <motion.h1
        className="splash-tagline"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, ease: "easeOut" }}
      >
        Discover local events near you!
      </motion.h1>

      {/* Loading Indicator */}
      <motion.div
        className="loading-indicator"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default SplashScreen;
