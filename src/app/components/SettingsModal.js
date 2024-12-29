'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';

const SettingsModal = ({ show, onClose }) => {
  const [dropdownOpen, setDropdownOpen] = useState({
    animation: false,
    textFont: false,
    themes: false,
    clockface: false,
  });
  const [settings, setSettings] = useState({
    brightness: 50,
    speed: 5,
    animation: 'Slide',
    textColor: '#ffffff',
    textFont: 'Sans-serif',
    timeFormat24Hour: true,
    showSeconds: true,
    hueEnabled: false,
    hueColor: '#ff0000',
    theme: 'Theme 1',
    showDate: false,
    clockface: 'Standard',
  });

  // Load settings from cookies when the modal is mounted
  useEffect(() => {
    const savedSettings = Cookies.get('screensaver-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Toggle dropdown menus
  const toggleDropdown = (key) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Update settings state
  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save settings to cookies
  const applySettings = () => {
    Cookies.set('screensaver-settings', JSON.stringify(settings), { expires: 365 }); // Save for 1 year
    onClose();
    window.location.reload();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6 w-96 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
          >
            ✕
          </button>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>

          {/* Brightness Slider */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Brightness</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.brightness}
              onChange={(e) => handleChange('brightness', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Speed Slider */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Speed</label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.speed}
              onChange={(e) => handleChange('speed', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Dropdown for Carousel Animations */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Carousel Animation</label>
            <div className="relative" onClick={() => toggleDropdown('animation')}>
              <div className="border rounded-md py-2 px-4 cursor-pointer bg-gray-50">
                {settings.animation}
              </div>
              <AnimatePresence>
                {dropdownOpen.animation && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full mt-1 left-0 right-0 bg-white border rounded-md shadow-lg"
                  >
                    {['Slide', 'Fade', 'Zoom'].map((option) => (
                      <li
                        key={option}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleChange('animation', option)}
                      >
                        {option}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Text Color Picker */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Text Color</label>
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-full h-10"
            />
          </div>

          {/* Text Font Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Text Font</label>
            <div className="relative" onClick={() => toggleDropdown('textFont')}>
              <div className="border rounded-md py-2 px-4 cursor-pointer bg-gray-50">
                {settings.textFont}
              </div>
              <AnimatePresence>
                {dropdownOpen.textFont && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full mt-1 left-0 right-0 bg-white border rounded-md shadow-lg"
                  >
                    {['Sans-serif', 'Serif', 'Monospace'].map((option) => (
                      <li
                        key={option}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleChange('textFont', option)}
                      >
                        {option}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Time Format Toggle */}
          <div className="mb-4 flex items-center justify-between">
            <label className="block text-gray-600">24-Hour Clock</label>
            <input
              type="checkbox"
              checked={settings.timeFormat24Hour}
              onChange={(e) =>
                handleChange('timeFormat24Hour', e.target.checked)
              }
              className="w-5 h-5"
            />
          </div>

          {/* Seconds Toggle */}
          <div className="mb-4 flex items-center justify-between">
            <label className="block text-gray-600">Show Seconds</label>
            <input
              type="checkbox"
              checked={settings.showSeconds}
              onChange={(e) => handleChange('showSeconds', e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          {/* Hue Toggle and Picker */}
          <div className="mb-4 flex items-center justify-between">
            <label className="block text-gray-600">Enable Hue</label>
            <input
              type="checkbox"
              checked={settings.hueEnabled}
              onChange={(e) => handleChange('hueEnabled', e.target.checked)}
              className="w-5 h-5"
            />
          </div>
          {settings.hueEnabled && (
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Hue</label>
              <input
                type="color"
                value={settings.hueColor}
                onChange={(e) => handleChange('hueColor', e.target.value)}
                className="w-full h-10"
              />
            </div>
          )}

          {/* Themes Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Preloaded Themes</label>
            <div className="relative" onClick={() => toggleDropdown('themes')}>
              <div className="border rounded-md py-2 px-4 cursor-pointer bg-gray-50">
                {settings.theme}
              </div>
              <AnimatePresence>
                {dropdownOpen.themes && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full mt-1 left-0 right-0 bg-white border rounded-md shadow-lg"
                  >
                    {['Theme 1', 'Theme 2', 'Theme 3'].map((option) => (
                      <li
                        key={option}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleChange('theme', option)}
                      >
                        {option}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Clockface Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Clockface</label>
            <div
              className="relative"
              onClick={() => toggleDropdown('clockface')}
            >
              <div className="border rounded-md py-2 px-4 cursor-pointer bg-gray-50">
                {settings.clockface}
              </div>
              <AnimatePresence>
                {dropdownOpen.clockface && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full mt-1 left-0 right-0 bg-white border rounded-md shadow-lg"
                  >
                    {['Standard', 'Analog', 'Digital'].map((option) => (
                      <li
                        key={option}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleChange('clockface', option)}
                      >
                        {option}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={applySettings}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Apply
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SettingsModal;
