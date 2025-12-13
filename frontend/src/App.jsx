import { useState, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import DashboardPage from './components/DashboardPage';

const API_BASE_URL = 'http://localhost:8080/api/auth';

function useAuthState() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const updateAuth = (newToken, userData) => {
    setToken(newToken);
    setCurrentUser(userData);
    if (newToken && userData) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return { 
    token, 
    setToken, 
    currentUser, 
    setCurrentUser, 
    loading, 
    setLoading, 
    error, 
    setError, 
    message, 
    setMessage,
    updateAuth 
  };
}

function AuthPage({ token, updateAuth, currentUser, setCurrentUser }) {
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [mode, setMode] = useState('signup');
  const navigate = useNavigate();
  const { loading, setLoading, setError, setMessage } = useAuthState();

  const motivationalQuote = useMemo(() => {
    const quotes = [
      'Small consistent steps with the right guidance create massive change.',
      'Your future self is already grateful you showed up today.',
      'Clarity comes from action, not from waiting for the perfect moment.',
      'Every question you ask is a step closer to the answer you need.',
      "You don't need to be perfect, you just need to keep improving.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  const motivationalImage = useMemo(() => {
    const images = [
      {
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
        alt: 'Sunrise over mountains symbolizing a fresh start',
      },
      {
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        alt: 'People collaborating and learning together',
      },
      {
        url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
        alt: 'Focused person studying at a desk with a laptop',
      },
      {
        url: 'https://images.unsplash.com/photo-1515165562835-c4c9e0737eaa?auto=format&fit=crop&w=900&q=80',
        alt: 'Pathway through a forest symbolizing a learning journey',
      },
    ];
    return images[Math.floor(Math.random() * images.length)];
  }, []);

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  async function callApi(path, options = {}, useAuth = false) {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };
      if (useAuth && token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('Content-Type') || '';
      const isJson = contentType.includes('application/json');
      const body = isJson ? await response.json().catch(() => null) : null;

      if (!response.ok) {
        const msg = (body && (body.message || body.error)) || `Request failed with status ${response.status}`;
        throw new Error(msg);
      }

      return body;
    } catch (err) {
      setError(err.message || 'Unexpected error');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const body = await callApi('/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
    if (body) {
      setMessage('Signup successful');
      if (body.token) {
        updateAuth(body.token, body.user);
      }
      setCurrentUser(body);
      navigate('/dashboard');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const body = await callApi('/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
    if (body) {
      setMessage('Login successful');
      if (body.token) {
        updateAuth(body.token, body.user);
      }
      setCurrentUser(body);
      navigate('/dashboard');
    }
  }

  return (
    <div className="app-container">
      <div className="app-shell">
        <div className="app-left">
          <h1>MindMentor</h1>
          <p className="subtitle">Secure sign up and login for your AI mentor.</p>
          <div className="auth-card-wrapper">
            {mode === 'signup' ? (
              <div className="panel auth-card">
                <h2>Create your account</h2>
                <form onSubmit={handleSignup} className="form">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={signupData.name}
                    onChange={handleChange(setSignupData)}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={signupData.email}
                    onChange={handleChange(setSignupData)}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={handleChange(setSignupData)}
                    required
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? 'Working...' : 'Sign up'}
                  </button>
                </form>

                <div className="divider">
                  <span>or continue with</span>
                </div>

                <div className="social-buttons">
                  <button type="button" className="social-button google" disabled>
                    Google
                  </button>
                  <button type="button" className="social-button telegram" disabled>
                    Telegram
                  </button>
                  <button type="button" className="social-button yahoo" disabled>
                    Yahoo
                  </button>
                  <button type="button" className="social-button microsoft" disabled>
                    Microsoft
                  </button>
                  <button type="button" className="social-button facebook" disabled>
                    Facebook
                  </button>
                  <button type="button" className="social-button instagram" disabled>
                    Instagram
                  </button>
                </div>

                <p className="switch-text">
                  Already have an account?{' '}
                  <button type="button" className="link-button" onClick={() => setMode('login')}>
                    Log in
                  </button>
                </p>
              </div>
            ) : (
              <div className="panel auth-card">
                <h2>Log in</h2>
                <form onSubmit={handleLogin} className="form">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={handleChange(setLoginData)}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleChange(setLoginData)}
                    required
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? 'Working...' : 'Log in'}
                  </button>
                </form>

                <p className="switch-text">
                  New to MindMentor?{' '}
                  <button type="button" className="link-button" onClick={() => setMode('signup')}>
                    Sign up
                  </button>
                </p>
              </div>
            )}
          </div>

          {error && <div className="alert error">Error: {error}</div>}
          {message && <div className="alert success">{message}</div>}
        </div>

        <div className="app-right">
          <div className="hero-gradient" />
          <div className="hero-content">
            <h2>Welcome to MindMentor</h2>
            <p>
              MindMentor is your focused space for growth: a safe place to ask questions, explore ideas, and plan your
              next steps with an AI mentor that remembers you.
            </p>
            <ul>
              <li>Turn vague goals into clear, actionable learning paths.</li>
              <li>Break big challenges into tiny, achievable tasks.</li>
              <li>Reflect on progress with structured check-ins and prompts.</li>
              <li>Keep your notes, insights, and next actions in one place.</li>
            </ul>
            <p className="hero-footnote">Start by creating an account on the left, then come back whenever you need direction.</p>

            <div className="quote-card">
              <p className="quote-text">"{motivationalQuote}"</p>
              <p className="quote-caption">Your session, your pace. MindMentor is here whenever you are ready.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { 
    token, 
    updateAuth, 
    currentUser, 
    setCurrentUser,
    loading,
    setLoading,
    error,
    setError,
    message,
    setMessage
  } = useAuthState();

  const handleLogout = () => {
    updateAuth('', null);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage
              token={token}
              updateAuth={updateAuth}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )
        }
      />
      <Route
        path="/dashboard/*"
        element={
          token ? (
            <DashboardPage 
              token={token} 
              currentUser={currentUser} 
              onLogout={handleLogout} 
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;