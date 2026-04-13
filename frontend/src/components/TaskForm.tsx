import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiX, FiPlay, FiPause, FiRotateCw } from 'react-icons/fi';

interface TaskFormProps {
  onClose: () => void;
  onAddTask: (task: { 
    title: string; 
    description: string; 
    dueDate: string; 
    priority: 'low' | 'medium' | 'high';
    startTime?: string;
    endTime?: string;
    duration?: number; // in minutes
  }) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onAddTask }) => {
  interface TaskState {
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    startTime: string;
    endTime: string;
    duration: number;
  }

  const [task, setTask] = useState<TaskState>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    startTime: '',
    endTime: '',
    duration: 25, // Default Pomodoro duration in minutes
  });

  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(task.duration * 60); // in seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Update timer display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Handle timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    } else if (!isTimerRunning && timerInterval) {
      clearInterval(timerInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  const toggleTimer = useCallback(() => {
    setIsTimerRunning(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    setTimeLeft(task.duration * 60);
    setIsTimerRunning(false);
  }, [task.duration, timerInterval]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    
    // Calculate duration in minutes if start and end times are provided
    let duration = task.duration;
    if (task.startTime && task.endTime) {
      const [startHour, startMinute] = task.startTime.split(':').map(Number);
      const [endHour, endMinute] = task.endTime.split(':').map(Number);
      
      // Validate time values
      if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
        console.error('Invalid time format');
        return;
      }
      
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      duration = Math.max(0, (endTotal - startTotal + 1440) % 1440); // Ensure non-negative duration
    }

    onAddTask({
      ...task,
      title: task.title.trim(),
      description: task.description.trim(),
      duration,
      startTime: task.startTime || undefined,
      endTime: task.endTime || undefined
    });
    onClose();
  }, [task, onAddTask, onClose]);

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Task</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={task.title}
                onChange={(e) => setTask({...task, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={task.description}
                onChange={(e) => setTask({...task, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add details about the task"
              />
            </div>

            {/* Time Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={task.startTime}
                    onChange={(e) => setTask({...task, startTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <FiClock className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={task.endTime}
                    onChange={(e) => setTask({...task, endTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <FiClock className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Pomodoro Timer */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pomodoro Timer</h3>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleTimer}
                    className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors"
                  >
                    {isTimerRunning ? <FiPause size={16} /> : <FiPlay size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={resetTimer}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    <FiRotateCw size={16} />
                  </button>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {isTimerRunning ? 'Time remaining' : 'Ready to start'}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[15, 25, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setTask(prev => ({ ...prev, duration: mins }));
                      setTimeLeft(mins * 60);
                    }}
                    className={`text-xs py-1 px-2 rounded ${
                      task.duration === mins
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                        : 'bg-gray-100 dark:bg-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500/50'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dueDate"
                  value={task.dueDate}
                  onChange={(e) => setTask({...task, dueDate: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={task.priority}
                onChange={(e) => setTask({...task, priority: e.target.value as 'low' | 'medium' | 'high'})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <FiPlus className="mr-2" />
              Add Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TaskForm;
