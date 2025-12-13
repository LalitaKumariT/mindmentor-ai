import { useState } from 'react';

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete math assignment', completed: false, priority: 'high', dueDate: '2025-12-15' },
    { id: 2, text: 'Read React documentation', completed: true, priority: 'medium', dueDate: '2025-12-12' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      priority,
      dueDate: dueDate || null
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    setPriority('medium');
    setDueDate('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-900/50 border-red-500';
      case 'medium': return 'bg-yellow-900/50 border-yellow-500';
      case 'low': return 'bg-green-900/50 border-green-500';
      default: return 'bg-gray-700 border-gray-600';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  return (
    <div className="dash-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Tasks</h3>
        <div className="flex gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <form onSubmit={addTask} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-2 rounded bg-gray-700 border border-gray-600"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded px-2"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded px-2"
        />
        <button 
          type="submit" 
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Add
        </button>
      </form>

      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No tasks found</p>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center p-3 rounded-lg border ${getPriorityColor(task.priority)}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
              />
              <span 
                className={`ml-3 flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-200'}`}
              >
                {task.text}
                {task.dueDate && (
                  <span className="ml-2 text-xs text-gray-400">
                    (Due: {new Date(task.dueDate).toLocaleDateString()})
                  </span>
                )}
              </span>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-gray-700/50">
                  {task.priority}
                </span>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
