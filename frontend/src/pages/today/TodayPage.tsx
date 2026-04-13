import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiArrowLeft, FiPlay, FiPause, FiRotateCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: number;
  text: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
}

const motivationalQuotes = [
  "The secret of getting ahead is getting started.",
  "You don't have to be great to start, but you have to start to be great.",
  "The future depends on what you do today.",
  "Success is the sum of small efforts repeated day in and day out.",
  "You're never too old to set another goal or to dream a new dream.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "It always seems impossible until it's done.",
];

const TodayPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentQuote] = useState(
    () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  // Mock tasks - in a real app, this would come from your state management or API
  const [tasks, setTasks] = useState<Task[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    return [
      { 
        id: 1, 
        text: 'Complete React components', 
        description: 'Finish building the dashboard components',
        completed: false, 
        priority: 'high', 
        dueDate: today,
        startTime: '14:00',
        endTime: '15:00',
        duration: 60
      },
      { 
        id: 2, 
        text: 'Review project documentation', 
        description: 'Go through the API documentation',
        completed: false, 
        priority: 'medium', 
        dueDate: today,
        startTime: '15:30',
        endTime: '16:00',
        duration: 30
      },
    ];
  });

  // Filter tasks for today
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(task => task.dueDate === today);

  // Timer functions
  const toggleTimer = (taskId: number) => {
    if (activeTaskId === taskId && isTimerRunning) {
      setIsTimerRunning(false);
    } else {
      setActiveTaskId(taskId);
      setIsTimerRunning(true);
    }
  };

  const resetTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setTimeLeft(25 * 60);
    setIsTimerRunning(false);
  };

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(timer);
    } else if (!isTimerRunning && timerInterval) {
      clearInterval(timerInterval);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerRunning, timeLeft]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Tasks</h1>
          <div className="w-8"></div> {/* For alignment */}
        </div>

        {/* Motivational Quote */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="text-center">
            <FiClock className="mx-auto h-8 w-8 mb-3 opacity-75" />
            <p className="text-lg font-medium italic">"{currentQuote}"</p>
            <p className="mt-2 text-sm opacity-80">You've got {todaysTasks.filter(t => !t.completed).length} tasks to complete today</p>
          </div>
        </motion.div>

        {/* Tasks List */}
        <div className="space-y-3">
          {todaysTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No tasks for today. Enjoy your day!</p>
            </div>
          ) : (
            todaysTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border ${
                  task.completed 
                    ? 'border-green-200 dark:border-green-900/50' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500 flex items-center justify-center'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {task.completed && <FiCheckCircle className="w-3 h-3 text-white" />}
                  </button>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          task.completed 
                            ? 'line-through text-gray-400 dark:text-gray-500' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.text}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                          {task.startTime && (
                            <span className="flex items-center">
                              <FiClock className="mr-1 flex-shrink-0" />
                              {formatTime(task.startTime)}
                              {task.endTime && ` - ${formatTime(task.endTime)}`}
                            </span>
                          )}
                          <span className={`ml-2 px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority} priority
                          </span>
                          {task.duration && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              {Math.floor(task.duration / 60)}h {task.duration % 60}m
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {activeTaskId === task.id && (
                        <div className="flex items-center ml-2">
                          <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                            {String(timeLeft % 60).padStart(2, '0')}
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <button 
                              onClick={() => toggleTimer(task.id)}
                              className="p-1.5 text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30 rounded-full"
                            >
                              {isTimerRunning && activeTaskId === task.id ? (
                                <FiPause size={16} />
                              ) : (
                                <FiPlay size={16} />
                              )}
                            </button>
                            <button 
                              onClick={resetTimer}
                              className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full"
                            >
                              <FiRotateCw size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayPage;
