import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiCalendar, FiBook } from 'react-icons/fi';

interface ProfileSectionProps {
  user: {
    name: string;
    email: string;
    joinDate: string;
    coursesEnrolled: number;
    avatar?: string;
  };
  onUpdateProfile: (updates: { name: string; email: string }) => Promise<void>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
    });
    setIsEditing(false);
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <FiEdit2 className="mr-1" size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <FiX className="mr-1" size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center text-sm text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md transition-colors disabled:opacity-50"
              >
                <FiSave className="mr-1" size={16} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser size={40} className="text-purple-500" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md">
                <FiEdit2 size={14} className="text-purple-600 dark:text-purple-400" />
              </button>
            )}
          </div>

          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FiMail className="mr-2 text-purple-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FiCalendar className="mr-2 text-purple-500" />
                  <span>Member since {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FiBook className="mr-2 text-purple-500" />
                  <span>{user.coursesEnrolled} courses enrolled</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSection;
