import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiCalendar, 
  FiMessageSquare, 
  FiBarChart2, 
  FiSettings, 
  FiPlus, 
  FiMoon, 
  FiSun,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { useRippleEffect } from '../../hooks/useRippleEffect';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();
  const { onClick: rippleClick, RippleEffect } = useRippleEffect();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const navItems = [
    { icon: <FiHome size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiCalendar size={20} />, label: 'Smart Planner', path: '/planner' },
    { icon: <FiMessageSquare size={20} />, label: 'AI Mentor', path: '/mentor' },
    { icon: <FiBarChart2 size={20} />, label: 'Analytics', path: '/analytics' },
    { icon: <FiSettings size={20} />, label: 'Settings', path: '/settings' },
  ];

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          MindMentor AI
        </h1>
        <div className="w-8"></div> {/* For balance */}
      </header>

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)] md:h-full">
        {/* Sidebar */}
        <motion.aside
          ref={sidebarRef}
          className={`fixed md:relative h-[calc(100vh-64px)] md:h-full top-16 md:top-0 z-40 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-200`}
          initial={false}
          animate={{
            width: isSidebarOpen ? (isCollapsed ? '4rem' : '16rem') : '0',
            x: isSidebarOpen ? 0 : '-100%',
            opacity: isSidebarOpen ? 1 : 0.9
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <div className="flex flex-col h-full">
            <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'px-3' : ''}`}>
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    MindMentor AI
                  </h1>
                )}
                {isCollapsed && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    MM
                  </div>
                )}
                {!isMobile && (
                  <button
                    onClick={toggleCollapse}
                    className="hidden md:flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  >
                    {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
                  </button>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex items-center mt-2 text-sm text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  AI Assistant Active
                </div>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                {navItems.map((item) => (
                  <motion.li 
                    key={item.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={(e) => {
                        rippleClick(e);
                        navigate(item.path);
                      }}
                      className={`w-full flex items-center ${
                        isCollapsed ? 'justify-center px-0' : 'justify-start px-4 space-x-3'
                      } py-3 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <span className="text-gray-600 dark:text-gray-300">{item.icon}</span>
                      {!isCollapsed && <span>{item.label}</span>}
                      {isCollapsed && <span className="sr-only">{item.label}</span>}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>

          </div>
        </motion.aside>

        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Collapse button */}
        {isSidebarOpen && (
          <motion.button
            onClick={toggleCollapse}
            className="hidden md:flex items-center justify-center w-6 h-10 absolute left-[calc(16rem-12px)] top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-r-lg shadow-md border border-l-0 border-gray-200 dark:border-gray-700 z-50 transition-all duration-200"
            style={{
              left: isCollapsed ? '4rem' : 'calc(16rem - 12px)',
              opacity: isCollapsed ? 1 : 1
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <FiChevronRight className="text-gray-600 dark:text-gray-300" />
            ) : (
              <FiChevronLeft className="text-gray-600 dark:text-gray-300" />
            )}
          </motion.button>
        )}

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top AppBar */}
          <header className="hidden md:flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiMenu size={20} />
              </button>
              <div className="flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                AI Assistant Ready
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium cursor-pointer hover:opacity-90 transition-opacity"
                aria-label="Go to profile"
              >
                U
              </button>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
            {/* Page Content */}
            <main className="p-4 md:p-6 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>

          </div>

          {/* Mobile Bottom Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50 flex-shrink-0">
            <div className="flex justify-around">
              {navItems.slice(0, 4).map((item, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    rippleClick(e);
                    navigate(item.path);
                  }}
                  className={`flex flex-col items-center justify-center p-3 flex-1 ${
                    location.pathname === item.path
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Floating Action Button */}
          <button
            onClick={() => navigate('/mentor')}
            className="fixed right-6 bottom-20 md:bottom-8 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-40"
          >
            <FiPlus size={24} />
          </button>
        </div>
      </div>
    
  );
};

export default DashboardLayout;
