import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../../assets/logo.png';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen">
      <motion.div
        className="logo-container"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img src={Logo} alt="App Logo" />
      </motion.div>
      <motion.div
        className="loading-indicator"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default SplashScreen;
