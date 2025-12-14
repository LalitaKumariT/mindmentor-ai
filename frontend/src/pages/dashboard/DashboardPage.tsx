import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiTarget, FiClock, FiAward, FiTrendingUp, FiCalendar } from 'react-icons/fi';

const DashboardPage: React.FC = () => {
  const stats = [
    { 
      title: 'Active Goals', 
      value: '5', 
      change: '+2 from last week',
      icon: <FiTarget className="text-blue-500" size={24} />,
      color: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: 'Study Time Today', 
      value: '2h 45m', 
      change: '+35m from yesterday',
      icon: <FiClock className="text-purple-500" size={24} />,
      color: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      title: 'Weekly Streak', 
      value: '7 days', 
      change: 'Keep it up!',
      icon: <FiAward className="text-yellow-500" size={24} />,
      color: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    { 
      title: 'Productivity', 
      value: '87%', 
      change: '+5% from last week',
      icon: <FiTrendingUp className="text-green-500" size={24} />,
      color: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
  ];

  const recentActivities = [
    { id: 1, title: 'Completed Machine Learning chapter', time: '2 hours ago', icon: <FiBookOpen /> },
    { id: 2, title: 'New study session: 45 minutes', time: '5 hours ago', icon: <FiClock /> },
    { id: 3, title: 'Goal set: Complete Python course', time: '1 day ago', icon: <FiTarget /> },
    { id: 4, title: 'Productivity streak: 7 days', time: '1 day ago', icon: <FiAward /> },
  ];

  const upcomingSessions = [
    { id: 1, title: 'Mathematics Revision', time: 'Tomorrow, 10:00 AM', subject: 'Calculus' },
    { id: 2, title: 'Coding Practice', time: 'Tomorrow, 2:00 PM', subject: 'React' },
    { id: 3, title: 'Language Learning', time: 'In 2 days, 4:00 PM', subject: 'Spanish' },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Alex</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your learning today</p>
        </div>
        <button className="mt-4 md:mt-0 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
          + New Task
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            variants={item}
            className={`p-5 rounded-xl ${stat.color} dark:bg-opacity-30`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color.replace('100', '200')} dark:bg-opacity-50`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div 
                key={activity.id}
                variants={item}
                className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mr-4">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <motion.div 
                key={session.id}
                variants={item}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg mr-3">
                    <FiCalendar />
                  </div>
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{session.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{session.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 text-center text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            + Add New Session
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { icon: <FiBookOpen size={20} />, label: 'New Note' },
            { icon: <FiTarget size={20} />, label: 'Set Goal' },
            { icon: <FiClock size={20} />, label: 'Start Timer' },
            { icon: <FiCalendar size={20} />, label: 'Schedule' },
            { icon: <FiTrendingUp size={20} />, label: 'Analytics' },
          ].map((action, index) => (
            <motion.button
              key={index}
              variants={item}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-purple-600 dark:text-purple-400 mb-2">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
