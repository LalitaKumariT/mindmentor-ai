import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBell, FiMoon, FiSun, FiLock, FiGlobe, FiHelpCircle, FiLogOut } from 'react-icons/fi';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
  });

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const tabs = [
    { id: 'account', icon: <FiUser className="w-4 h-4 mr-2" />, label: 'Account' },
    { id: 'notifications', icon: <FiBell className="w-4 h-4 mr-2" />, label: 'Notifications' },
    { id: 'appearance', icon: <FiMoon className="w-4 h-4 mr-2" />, label: 'Appearance' },
    { id: 'security', icon: <FiLock className="w-4 h-4 mr-2" />, label: 'Security' },
    { id: 'language', icon: <FiGlobe className="w-4 h-4 mr-2" />, label: 'Language' },
    { id: 'help', icon: <FiHelpCircle className="w-4 h-4 mr-2" />, label: 'Help & Support' },
  ];

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0 md:mr-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account preferences</p>
        </div>
        
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          
          <button className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors mt-4">
            <FiLogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'account' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 text-2xl font-bold">
                  JD
                </div>
                <div className="ml-6">
                  <button className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, GIF or PNG. Max size of 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea
                  rows={4}
                  defaultValue="Passionate about learning and self-improvement. Currently studying computer science and machine learning."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates, reminders, and more</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get alerts on your device</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-medium">Study Reminders</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Daily and weekly study reminders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notifications.reminders}
                    onChange={() => handleNotificationChange('reminders')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-3">Notification Sound</h3>
                <select className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option>Default</option>
                  <option>Chime</option>
                  <option>Bell</option>
                  <option>None</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'appearance' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Appearance</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  {darkMode ? (
                    <FiMoon className="w-5 h-5 text-purple-600 mr-3" />
                  ) : (
                    <FiSun className="w-5 h-5 text-yellow-500 mr-3" />
                  )}
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {darkMode ? 'Dark theme is enabled' : 'Light theme is enabled'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-3">Theme Color</h3>
                <div className="flex space-x-3">
                  {['purple', 'blue', 'green', 'red', 'indigo'].map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full bg-${color}-500`}
                      title={color.charAt(0).toUpperCase() + color.slice(1)}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-3">Font Size</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">A</span>
                  <input
                    type="range"
                    min="14"
                    max="20"
                    defaultValue="16"
                    className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-lg">A</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Security</h2>
            
            <div className="space-y-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Create a new password that is at least 8 characters long
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="px-4 py-2 border border-purple-600 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30">
                  Enable Two-Factor Authentication
                </button>
              </div>

              <div className="p-4 border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20 rounded-lg">
                <h3 className="font-medium text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                  Delete My Account
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'language' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Language & Region</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Language</h3>
                <select className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option>English (United States)</option>
                  <option>Español</option>
                  <option>Français</option>
                  <option>Deutsch</option>
                  <option>中文</option>
                </select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Time Zone</h3>
                <select className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                  <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                  <option>(UTC+00:00) London</option>
                  <option>(UTC+01:00) Berlin</option>
                  <option>(UTC+05:30) Mumbai, Kolkata, Chennai, New Delhi</option>
                </select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Date Format</h3>
                <div className="flex flex-wrap gap-3">
                  {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map((format) => (
                    <label key={format} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="date-format"
                        className="form-radio h-4 w-4 text-purple-600 dark:text-purple-400 border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                        defaultChecked={format === 'MM/DD/YYYY'}
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'help' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Help & Support</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-medium text-lg mb-3">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {[
                    'How do I reset my password?',
                    'How can I upgrade my account?',
                    'Where can I find my study history?',
                    'How do I contact support?',
                    'What payment methods do you accept?'
                  ].map((question, index) => (
                    <div key={index} className="p-3 hover:bg-white dark:hover:bg-gray-600/50 rounded-lg transition-colors cursor-pointer">
                      {question} →
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <h3 className="font-medium text-lg mb-3">Contact Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Our support team is here to help with any questions or issues you might have.
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    Contact Us
                  </button>
                </div>

                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <h3 className="font-medium text-lg mb-3">Documentation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Browse our documentation for detailed guides and tutorials.
                  </p>
                  <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
                    View Documentation
                  </button>
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-medium text-lg mb-3">About MindMentor AI</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Version: 1.0.0
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  © {new Date().getFullYear()} MindMentor AI. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
