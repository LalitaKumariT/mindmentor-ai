import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  FiBookOpen, 
  FiTarget, 
  FiClock, 
  FiAward, 
  FiTrendingUp, 
  FiCalendar, 
  FiPlus,
  FiUser,
  FiMail,
  FiSettings,
  FiPieChart,
  FiBookmark,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ProfileSection from '../../components/ProfileSection';

interface User {
  name: string;
  email: string;
  joinDate: string;
  coursesEnrolled: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}
interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
}
interface Activity {
  id: number;
  title: string;
  time: string;
  icon: React.ReactNode;
}
interface Session {
  id: number;
  title: string;
  time: string;
  subject: string;
}
interface QuickAction {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab] = useState<'today' | 'upcoming'>('today');
  
  // Mock user data - in a real app, this would come from your auth context or API
  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2023-01-15',
    coursesEnrolled: 5,
  });
  const stats: StatCard[] = [
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
  const recentActivities: Activity[] = [
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
  const quickActions: QuickAction[] = [
    { 
      icon: <FiBookOpen size={20} />, 
      label: 'Notes', 
      color: 'text-purple-500',
      onClick: () => navigate('/notes')
    },
    { 
      icon: <FiTarget size={20} />, 
      label: 'Goals', 
      color: 'text-blue-500',
      onClick: () => navigate('/goals')
    },
    { 
      icon: <FiPieChart size={20} />, 
      label: 'Analytics', 
      color: 'text-green-500',
      onClick: () => {}
    },
    { 
      icon: <FiCalendar size={20} />, 
      label: 'Schedule', 
      color: 'text-yellow-500',
      onClick: () => navigate('/schedule')
    },
    { 
      icon: <FiUser size={20} />, 
      label: 'Profile', 
      color: 'text-red-500',
      onClick: () => navigate('/profile')
    },
  ];
  const fadeInUp: Variants = {
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
  const item: Variants = {
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

  const handleUpdateProfile = async (updates: { name: string; email: string }) => {
    // In a real app, you would make an API call here
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(prev => ({
          ...prev,
          ...updates
        }));
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Section 
        <ProfileSection user={user} onUpdateProfile={handleUpdateProfile} />*/}
        
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your learning today</p>
          </div>
          <button 
            onClick={() => navigate('/today')}
            className="mt-4 md:mt-0 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
          >
            <FiPlus className="mr-2" />
            Today's Tasks
          </button>
        </motion.div>
        <div className="space-y-6">
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

          {/* Recent Activities and Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
              <ul>
                {recentActivities.map((activity, index) => (
                  <li key={index} className="flex items-center mb-4">
                    <div className="mr-4">{activity.icon}</div>
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Upcoming Sessions */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
              <ul>
                {upcomingSessions.map((session, index) => (
                  <li key={index} className="flex items-center mb-4">
                    <div className="mr-4">
                      <div className="w-4 h-4 rounded-full bg-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{session.title}</p>
                      <p className="text-xs text-gray-500">{session.time}</p>
                      <p className="text-xs text-gray-500">{session.subject}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="w-full"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 w-full">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-3 gap-4 w-full" style={{ gridTemplateRows: 'auto auto' }}>
                {/* First row with 3 items */}
                {quickActions.slice(0, 3).map((action, index) => (
                  <motion.button
                    key={index}
                    variants={item}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
                    style={{ gridColumn: 'auto / span 1' }}
                  >
                    <span className={`${action.color} mb-2`}>{action.icon}</span>
                    <span className="text-sm font-medium text-center">{action.label}</span>
                  </motion.button>
                ))}
                {/* Second row with 2 items, centered */}
                <div className="col-span-3 flex justify-center gap-8">
                {quickActions.slice(3).map((action, index) => (
                  <motion.button
                    key={index + 3}
                    variants={item}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-32"
                  >
                    <span className={`${action.color} mb-2`}>{action.icon}</span>
                    <span className="text-sm font-medium text-center">{action.label}</span>
                  </motion.button>
                ))}
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
