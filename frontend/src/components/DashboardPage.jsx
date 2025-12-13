import { useState, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Notes from './Notes';
import Tasks from './Tasks';
import Calendar from './Calendar';

function DashboardPage({ token, currentUser, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studyPlan, setStudyPlan] = useState([
    { id: 1, subject: 'Mathematics', hours: 10, completed: 3 },
    { id: 2, subject: 'Physics', hours: 8, completed: 5 },
    { id: 3, subject: 'Chemistry', hours: 6, completed: 2 },
  ]);
  const [notes, setNotes] = useState([
    'Review yesterday\'s session summary.',
    'Save useful links from today\'s research.',
  ]);
  const [newNote, setNewNote] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Finish chapter 3 and take notes.', done: false },
    { id: 2, text: 'Summarize key concepts in your own words.', done: false },
  ]);
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [hourlyPlans, setHourlyPlans] = useState({});

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Rest of the component code...
  // [Previous implementation of DashboardPage component]

  return (
    <div className="dashboard-root">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 text-gray-300 hover:text-white lg:hidden"
          >
            ☰
          </button>
          <h2 className="text-xl font-bold">MindMentor AI</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-1 rounded-full text-gray-300 hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
          
          <div className="user-profile flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <span className="hidden md:inline text-sm">{currentUser?.name || 'User'}</span>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Dashboard</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'planner' ? 'active' : ''}`}
              onClick={() => setActiveTab('planner')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Study Planner</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Tasks & Goals</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Analytics</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'ai-mentor' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai-mentor')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>AI Mentor</span>
            </button>

            <div className="mt-auto">
              <button 
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </button>

              <button 
                className="nav-item text-red-400 hover:bg-red-900/20 hover:text-red-300"
                onClick={onLogout}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        <main className="dashboard-main">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name || 'Student'}!</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="dash-card">
                  <h3 className="text-lg font-medium mb-4">Study Plan Progress</h3>
                  <div className="space-y-4">
                    {studyPlan.map((subject) => (
                      <div key={subject.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{subject.subject}</span>
                          <span>{subject.completed}/{subject.hours} hours</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(subject.completed / subject.hours) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-card">
                  <h3 className="text-lg font-medium mb-4">Today's Schedule</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">10:00</div>
                      <div>
                        <p className="font-medium">Mathematics Practice</p>
                        <p className="text-sm text-gray-400">Chapter 5: Algebra</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">14:30</div>
                      <div>
                        <p className="font-medium">Physics Study Group</p>
                        <p className="text-sm text-gray-400">Newton's Laws</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dash-card">
                  <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors">
                      New Study Session
                    </button>
                    <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors">
                      Add Task
                    </button>
                    <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors">
                      View Calendar
                    </button>
                    <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors">
                      Ask AI Mentor
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="dash-card">
                  <h3 className="text-lg font-medium mb-4">Recent Notes</h3>
                  <Notes />
                </div>
                <div className="dash-card">
                  <h3 className="text-lg font-medium mb-4">Upcoming Tasks</h3>
                  <Tasks />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'planner' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Study Planner</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Calendar />
                </div>
                <div>
                  <div className="dash-card">
                    <h3 className="text-lg font-medium mb-4">Today's Tasks</h3>
                    <Tasks />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Tasks & Goals</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Tasks />
                </div>
                <div>
                  <div className="dash-card">
                    <h3 className="text-lg font-medium mb-4">Quick Notes</h3>
                    <Notes />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Study Analytics</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="dash-card">
                  <h3 className="text-lg font-medium mb-4">Study Time</h3>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Study time chart will be displayed here</p>
                  </div>
                </div>
                <div className="dash-card">
                  <h3 className="text-lg font-medium mb-4">Subject Distribution</h3>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Subject distribution chart will be displayed here</p>
                  </div>
                </div>
                <div className="dash-card md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">Productivity Trends</h3>
                  <div className="h-80 bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Productivity trends chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-mentor' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">AI Study Mentor</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="dash-card h-full">
                    <div className="h-96 overflow-y-auto mb-4 space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs lg:max-w-md">
                          <p>Hello! I'm your AI study mentor. How can I help you with your studies today?</p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="bg-gray-700 text-white rounded-lg p-3 max-w-xs lg:max-w-md">
                          <p>Hi! I'm having trouble understanding quadratic equations. Can you explain them?</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="dash-card">
                    <h3 className="text-lg font-medium mb-4">Suggested Questions</h3>
                    <div className="space-y-2">
                      <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                        Help me create a study plan for physics
                      </button>
                      <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                        Explain quantum mechanics in simple terms
                      </button>
                      <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                        Give me a quiz on calculus
                      </button>
                      <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                        Help me understand this week's lecture
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              
              <div className="dash-card">
                <h2 className="text-xl font-semibold mb-6">Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                        {currentUser?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{currentUser?.name || 'User'}</p>
                        <p className="text-sm text-gray-400">{currentUser?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                        <input
                          type="text"
                          id="name"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue={currentUser?.name || ''}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue={currentUser?.email || ''}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="timezone">Time Zone</label>
                        <select
                          id="timezone"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Select timezone...</option>
                          <option value="UTC-12:00">(UTC-12:00) International Date Line West</option>
                          <option value="UTC-08:00">(UTC-08:00) Pacific Time (US & Canada)</option>
                          <option value="UTC-07:00">(UTC-07:00) Mountain Time (US & Canada)</option>
                          <option value="UTC-06:00">(UTC-06:00) Central Time (US & Canada)</option>
                          <option value="UTC-05:00">(UTC-05:00) Eastern Time (US & Canada)</option>
                          <option value="UTC+00:00">(UTC+00:00) Dublin, Edinburgh, Lisbon, London</option>
                          <option value="UTC+01:00">(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                          <option value="UTC+02:00">(UTC+02:00) Athens, Bucharest, Istanbul</option>
                          <option value="UTC+05:30">(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                          <option value="UTC+08:00">(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                          <option value="UTC+09:00">(UTC+09:00) Osaka, Sapporo, Tokyo</option>
                          <option value="UTC+10:00">(UTC+10:00) Canberra, Melbourne, Sydney</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">
                        Update Profile
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="current-password">Current Password</label>
                        <input
                          type="password"
                          id="current-password"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="new-password">New Password</label>
                        <input
                          type="password"
                          id="new-password"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirm-password"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">
                          Update Password
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-700">
                      <h3 className="text-lg font-medium mb-4 text-red-400">Danger Zone</h3>
                      <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                        <p className="text-sm text-red-300 mb-3">
                          Deleting your account will permanently remove all your data, including study plans, notes, and progress. This action cannot be undone.
                        </p>
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium">
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
