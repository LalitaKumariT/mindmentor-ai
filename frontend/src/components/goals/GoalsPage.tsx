import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiCalendar, FiPlus, FiClock, FiCheckCircle, FiCalendar as FiCalendarIcon, FiClock as FiClockIcon, FiX } from 'react-icons/fi';

interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
  estimatedHours: number;
}

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id' | 'completed' | 'createdAt'>>({ 
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    estimatedHours: 1
  });
  const [showAIScheduler, setShowAIScheduler] = useState(false);
  const [aiScheduleResult, setAiScheduleResult] = useState<string>('');

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const goal: Goal = {
      ...newGoal,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setGoals([...goals, goal]);
    setNewGoal({ 
      title: '',
      description: '',
      deadline: '',
      priority: 'medium',
      estimatedHours: 1
    });
    setIsAddModalOpen(false);
  };

  const toggleComplete = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleAISchedule = async () => {
    // In a real app, this would call an AI API to schedule the goals
    // For now, we'll simulate an AI response
    const schedule = goals
      .filter(goal => !goal.completed)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .map((goal, index) => {
        const deadline = new Date(goal.deadline);
        const daysUntilDeadline = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return `• ${goal.title}: ${daysUntilDeadline > 0 ? `Start ${Math.floor(daysUntilDeadline / 2)} days before deadline` : 'Overdue!'}`;
      });

    setAiScheduleResult(schedule.length > 0 
      ? `Here's your suggested schedule:\n${schedule.join('\n')}`
      : 'No pending goals to schedule.');
    setShowAIScheduler(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Goals</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" /> Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <FiTarget className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No goals yet</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by adding your first goal.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiPlus className="mr-2" /> Add Goal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleAISchedule}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiClock className="mr-2" /> AI Schedule Assistant
            </button>
          </div>

          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-xl shadow-md ${
                goal.completed 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => toggleComplete(goal.id)}
                    className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      goal.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {goal.completed && <FiCheckCircle className="h-3 w-3" />}
                  </button>
                  <div>
                    <h3 className={`text-lg font-medium ${
                      goal.completed 
                        ? 'text-gray-500 dark:text-gray-400 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="mt-1 text-gray-600 dark:text-gray-300">{goal.description}</p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FiCalendarIcon className="mr-1.5 h-4 w-4" />
                        <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClockIcon className="mr-1.5 h-4 w-4" />
                        <span>{goal.estimatedHours} hours</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        goal.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                          : goal.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {goal.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeGoal(goal.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Goal</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={addGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="E.g., Complete React Course"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your goal in detail..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newGoal.estimatedHours}
                    onChange={(e) => setNewGoal({...newGoal, estimatedHours: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* AI Scheduler Modal */}
      {showAIScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Schedule Assistant</h2>
              <button
                onClick={() => setShowAIScheduler(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Suggested Schedule</h3>
              <div className="whitespace-pre-line text-blue-700 dark:text-blue-300">
                {aiScheduleResult || 'Analyzing your goals...'}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <p>Based on your goals' deadlines and priorities, here's a suggested schedule to help you stay on track.</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAIScheduler(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
