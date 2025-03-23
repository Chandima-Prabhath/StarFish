import React from "react";
import { motion } from "framer-motion";
import Logo from "../../assets/logo.png";
import "./SplashScreen.css";

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen" data-oid="07lj6n8">
      <motion.div
        className="logo-container"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        data-oid="dfh68ug"
      >
        <img src={Logo} alt="App Logo" data-oid="r7alg:_" />
      </motion.div>
      <motion.div
        className="loading-indicator"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        data-oid="ubq9bzo"
      />
    </div>
  );
};

export default SplashScreen;
