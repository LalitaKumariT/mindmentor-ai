import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiCalendar, FiClock, FiCheckCircle, FiList } from 'react-icons/fi';

const PlannerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete React components', completed: false, priority: 'high', due: 'Today, 2:00 PM' },
    { id: 2, text: 'Review project documentation', completed: true, priority: 'medium', due: 'Today, 3:30 PM' },
    { id: 3, text: 'Team standup meeting', completed: false, priority: 'high', due: 'Tomorrow, 10:00 AM' },
  ]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const newTaskItem = {
      id: Date.now(),
      text: newTask,
      completed: false,
      priority: 'medium',
      due: 'Today, 6:00 PM'
    };
    
    setTasks([...tasks, newTaskItem]);
    setNewTask('');
    setShowAddTask(false);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
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
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
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
                <p className={`text-sm font-medium ${
                  task.completed 
                    ? 'line-through text-gray-400 dark:text-gray-500' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {task.text}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <FiClock className="mr-1" />
                  <span>{task.due}</span>
                  <span className={`ml-3 px-2 py-0.5 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority} priority
                  </span>
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
