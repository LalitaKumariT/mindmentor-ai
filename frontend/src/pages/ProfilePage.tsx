import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('User Name');
  const [email, setEmail] = useState('user@example.com');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your save logic here
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Settings</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
              {name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{email}</p>
          </div>

          <form onSubmit={handleSave}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-70"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-70"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      // Reset form
                      setName('User Name');
                      setEmail('user@example.com');
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <FiSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
