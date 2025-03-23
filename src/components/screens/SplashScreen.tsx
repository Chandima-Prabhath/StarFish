import React from "react";
import { motion } from "framer-motion";
import Logo from "../../assets/logo.png";
import "./SplashScreen.css";

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen" data-oid="6gyh4e:">
      <motion.div
        className="logo-container"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        data-oid="_z9w5h_"
      >
        <img src={Logo} alt="App Logo" data-oid="915an6v" />
      </motion.div>
      <motion.div
        className="loading-indicator"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        data-oid=".jvwdid"
      />
    </div>
  );
};

export default SplashScreen;
