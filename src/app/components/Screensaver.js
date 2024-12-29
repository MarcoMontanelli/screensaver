'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCog } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import images from './images.json';
import SettingsModal from './SettingsModal';

const Screensaver = () => {
  const [blurred, setBlurred] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showSettings, setShowSettings] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    timeFormat24Hour: true,
    showSeconds: true,
    brightness: 50,
    speed: 5,
  });

  // Load settings from cookies
  useEffect(() => {
    const savedSettings = Cookies.get('screensaver-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Image slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, settings.speed * 1000); // Speed in seconds
    return () => clearInterval(interval);
  }, [settings.speed]);

  // Toggle blur
  const toggleBlur = () => {
    setBlurred((prev) => !prev);
  };

  // Calculate snapped position
  const snapToGrid = (x, y, gridSize = 50) => {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  };

  // Format time based on settings
  const formatTime = () => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      ...(settings.showSeconds && { second: '2-digit' }),
      hour12: !settings.timeFormat24Hour,
    };
    return time.toLocaleTimeString(undefined, options);
  };

  return (
    <div
      className="h-screen w-full relative overflow-hidden bg-gray-900"
      style={{ filter: `brightness(${settings.brightness}%)` }} // Apply brightness
    >
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex].src}
            alt={`Slide ${currentImageIndex + 1}`}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 1 }} // Fixed transition duration
            className={`w-full h-full object-cover ${
              blurred ? 'blur-lg' : 'blur-none'
            }`}
          />
        </AnimatePresence>
      </div>

      {/* Blur Toggle Button */}
      <motion.button
        onClick={toggleBlur}
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300"
      >
        <FontAwesomeIcon
          icon={blurred ? faEyeSlash : faEye}
          className="text-white text-lg"
        />
      </motion.button>

      {/* Settings Button */}
      <motion.button
        onClick={() => setShowSettings(true)}
        whileHover={{ scale: 1.2, rotate: -10 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-20 right-4 flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300"
      >
        <FontAwesomeIcon icon={faCog} className="text-white text-lg" />
      </motion.button>

      {/* Settings Modal */}
      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Draggable Clock with Snap-to-Grid */}
      <motion.div
        drag
        dragElastic={0.3}
        dragMomentum={false}
        onDragEnd={(event, info) => {
          const snapped = snapToGrid(info.point.x, info.point.y, 50);
          setPosition(snapped);
        }}
        initial={false}
        animate={position}
        className="absolute text-white font-bold text-7xl cursor-grab select-none"
        style={{
          top: 0,
          left: 0,
          x: position.x,
          y: position.y,
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {formatTime()}
      </motion.div>
    </div>
  );
};

export default Screensaver;
