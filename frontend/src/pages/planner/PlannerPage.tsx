import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiCalendar, FiClock, FiCheckCircle, FiList, FiPlay, FiPause, FiRotateCw } from 'react-icons/fi';

interface Task {
  id: number;
  text: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  startTime?: string;
  endTime?: string;
  duration?: number; // in minutes
}

const PlannerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed'>>({ 
    text: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    duration: 25
  });
  
  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      text: 'Complete React components', 
      description: 'Finish building the dashboard components',
      completed: false, 
      priority: 'high', 
      dueDate: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      duration: 60
    },
    { 
      id: 2, 
      text: 'Review project documentation', 
      description: 'Go through the API documentation',
      completed: true, 
      priority: 'medium', 
      dueDate: new Date().toISOString().split('T')[0],
      startTime: '15:30',
      endTime: '16:00',
      duration: 30
    },
  ]);

  // Timer functions
  const toggleTimer = (taskId?: number) => {
    if (taskId !== undefined) {
      setActiveTaskId(taskId === activeTaskId ? null : taskId);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setTimeLeft(newTask.duration ? newTask.duration * 60 : 25 * 60);
    setIsTimerRunning(false);
  };

  // Handle timer logic
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

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.text.trim()) return;
    
    // Calculate duration in minutes if start and end times are provided
    let duration = newTask.duration;
    if (newTask.startTime && newTask.endTime) {
      const [startHour, startMinute] = newTask.startTime.split(':').map(Number);
      const [endHour, endMinute] = newTask.endTime.split(':').map(Number);
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      duration = (endTotal - startTotal + 1440) % 1440; // Handle midnight wrap-around
    }

    const newTaskItem: Task = {
      id: Date.now(),
      text: newTask.text.trim(),
      description: newTask.description.trim(),
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      duration
    };
    
    setTasks([...tasks, newTaskItem]);
    setNewTask({ 
      text: '',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      duration: 25
    });
    setShowAddTask(false);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const formatTime = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return '';
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(dateStr);
    date.setHours(hours, minutes);
    
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const formatDueDate = (dateStr: string) => {
    const today = new Date().toDateString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const taskDate = new Date(dateStr).toDateString();
    
    if (today === taskDate) return 'Today';
    if (tomorrow.toDateString() === taskDate) return 'Tomorrow';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Smart Planner</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize your tasks and boost productivity</p>
        </div>
        <button 
          onClick={() => setShowAddTask(true)}
          className="mt-4 md:mt-0 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        {['today', 'upcoming', 'completed', 'all'].map((tab) => (
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

      {/* Add Task Form */}
      {showAddTask && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6"
        >
          <form onSubmit={addTask} className="space-y-4">
            <div>
              <input
                type="text"
                value={newTask.text}
                onChange={(e) => setNewTask({...newTask, text: e.target.value})}
                placeholder="Task title"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                autoFocus
                required
              />
            </div>
            
            <div>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Task description"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Time Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={newTask.startTime}
                    onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
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
                    value={newTask.endTime}
                    onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
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
                    onClick={() => toggleTimer()}
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
                  {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
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
                      setNewTask(prev => ({ ...prev, duration: mins }));
                      setTimeLeft(mins * 60);
                    }}
                    className={`text-xs py-1 px-2 rounded ${
                      newTask.duration === mins
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                        : 'bg-gray-100 dark:bg-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500/50'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center"
              >
                <FiPlus className="mr-1.5" />
                Add Task
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <FiList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new task.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${
                  task.completed 
                    ? 'bg-purple-600 border-purple-600 flex items-center justify-center'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {task.completed && <FiCheckCircle className="w-3.5 h-3.5 text-white" />}
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
                      <FiClock className="mr-1 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        {formatDueDate(task.dueDate)}
                        {task.startTime && `, ${formatTime(task.dueDate, task.startTime)}`}
                        {task.endTime && ` - ${formatTime(task.dueDate, task.endTime)}`}
                      </span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
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
                      <button 
                        onClick={() => toggleTimer(task.id)}
                        className="ml-2 p-1.5 text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30 rounded-full"
                      >
                        {isTimerRunning && activeTaskId === task.id ? 
                          <FiPause size={16} /> : 
                          <FiPlay size={16} />
                        }
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <FiCalendar className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlannerPage;
