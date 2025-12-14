import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiClock, FiAward, FiTrendingUp, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for charts
  const studyTimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Study Time (hours)',
        data: [3.5, 2.8, 4.2, 3.1, 5.0, 2.0, 1.5],
        borderColor: 'rgb(124, 58, 237)',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const subjectDistributionData = {
    labels: ['Mathematics', 'Science', 'History', 'Languages', 'Programming'],
    datasets: [
      {
        label: 'Study Time (hours)',
        data: [12, 8, 5, 7, 15],
        backgroundColor: [
          'rgba(124, 58, 237, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(124, 58, 237, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const productivityData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Productivity Score',
        data: [65, 72, 68, 81],
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 2,
      },
    ],
  };

  const stats = [
    {
      title: 'Total Study Time',
      value: '24.1',
      unit: 'hours',
      change: '+12%',
      icon: <FiClock className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Productivity',
      value: '78',
      unit: '%',
      change: '+5%',
      icon: <FiTrendingUp className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Goals Achieved',
      value: '12',
      unit: '/15',
      change: '+3',
      icon: <FiAward className="w-6 h-6 text-green-500" />,
      color: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Study Streak',
      value: '7',
      unit: 'days',
      change: '🔥',
      icon: <FiActivity className="w-6 h-6 text-yellow-500" />,
      color: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your learning progress and insights</p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                timeRange === range
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-xl ${stat.color}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{stat.unit}</span>
                </div>
                <p className="text-xs mt-1">
                  <span className="text-green-500 dark:text-green-400 font-medium">{stat.change}</span> from last period
                </p>
              </div>
              <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        {['overview', 'subjects', 'productivity', 'goals'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Weekly Study Time</h3>
                <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                  <FiCalendar className="mr-1 w-4 h-4" />
                  <span>This Week</span>
                </div>
              </div>
              <div className="h-64">
                <Line data={studyTimeData} options={chartOptions} />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Subject Distribution</h3>
                <div className="h-64">
                  <Pie data={subjectDistributionData} options={chartOptions} />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Monthly Productivity</h3>
                <div className="h-64">
                  <Bar data={productivityData} options={chartOptions} />
                </div>
              </motion.div>
            </div>
          </>
        )}

        {activeTab === 'subjects' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
            <div className="h-96">
              <Bar data={subjectDistributionData} options={chartOptions} />
            </div>
          </motion.div>
        )}

        {activeTab === 'productivity' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Productivity Trends</h3>
            <div className="h-96">
              <Line data={productivityData} options={chartOptions} />
            </div>
          </motion.div>
        )}

        {activeTab === 'goals' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Goal Progress</h3>
              <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                View All Goals
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Complete React Course', progress: 75, color: 'bg-purple-500' },
                { name: 'Study Calculus', progress: 45, color: 'bg-blue-500' },
                { name: 'Learn Spanish', progress: 30, color: 'bg-green-500' },
                { name: 'Read Research Papers', progress: 60, color: 'bg-yellow-500' },
              ].map((goal, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-gray-500">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className={`h-2 rounded-full ${goal.color}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-6 mt-6"
      >
        <div className="flex items-start">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 mr-4">
            <FiBarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Weekly Insights</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              You're most productive on Tuesdays and Thursdays. Try scheduling your most challenging tasks on these days.
              Your focus time has increased by 15% compared to last week. Keep it up!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
