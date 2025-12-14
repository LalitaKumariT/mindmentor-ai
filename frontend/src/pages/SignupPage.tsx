import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRippleEffect } from '../hooks/useRippleEffect';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '' });
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { onClick: rippleClick, RippleEffect } = useRippleEffect();
  const formRef = useRef<HTMLFormElement>(null);

  const validateField = (name: string, value: string | boolean) => {
    switch (name) {
      case 'name':
        if (!value) return 'Full name is required';
        if (typeof value === 'string' && value.length < 2) return 'Name is too short';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) 
          return 'Please enter a valid email';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (typeof value === 'string' && value.length < 8) 
          return 'Password must be at least 8 characters';
        return '';
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      case 'terms':
        if (!value) return 'You must accept the terms and conditions';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    // Fade in animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 50);
  }, []);

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let label = '';
    
    // Length check
    if (password.length > 0) score += 1;
    if (password.length >= 8) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Set label based on score
    if (password.length === 0) {
      label = '';
    } else if (score <= 2) {
      label = 'Weak';
    } else if (score <= 4) {
      label = 'Good';
    } else {
      label = 'Strong';
    }
    
    return { score: Math.min(score, 5), label };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    const error = validateField(name, fieldValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { name, email, password } = formData;
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -right-4 w-72 h-72 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-10 border border-white/10 transform transition-all duration-300 hover:shadow-purple-500/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                MindMentor AI
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white text-center">
              Create your MindMentor AI account
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Start planning smarter and learning better with AI.
            </p>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-300 text-center">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`peer h-14 w-full px-4 pt-4 pb-2 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                  placeholder=" "  
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label 
                  htmlFor="name" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`peer h-14 w-full px-4 pt-4 pb-2 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`peer h-14 w-full px-4 pt-4 pb-2 pr-12 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label 
                    htmlFor="password" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">Minimum 8 characters</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`peer h-14 w-full px-4 pt-4 pb-2 pr-12 bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    placeholder=" "
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label 
                    htmlFor="confirmPassword" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Password Strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.label === 'Weak' ? 'text-red-400' : 
                      passwordStrength.label === 'Good' ? 'text-yellow-400' : 
                      passwordStrength.label === 'Strong' ? 'text-green-400' : ''
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        passwordStrength.score <= 2 ? 'bg-red-500' : 
                        passwordStrength.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Terms and Privacy */}
              <div className="pt-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <div className="relative">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.terms as boolean}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="w-4 h-4 flex items-center justify-center rounded bg-white/5 border border-white/20 peer-checked:bg-purple-500 peer-checked:border-purple-500 peer-focus:ring-2 peer-focus:ring-purple-500/50 transition-colors">
                        <CheckCircleIcon className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                  <div className="ml-3">
                    <label htmlFor="terms" className="text-sm text-gray-300">
                      I agree to the{' '}
                      <a href="/terms" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                        Privacy Policy
                      </a>
                      <span className="text-red-500">*</span>
                    </label>
                    {errors.terms && (
                      <p className="mt-1 text-xs text-red-400">{errors.terms}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center text-xs text-gray-400">
                <LockClosedIcon className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                <span>Your data is secure and encrypted</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                onClick={rippleClick}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <RippleEffect />
                <span className="relative z-10">
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : 'Create Account'}
                </span>
              </button>

              <div className="mt-4 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                  onClick={rippleClick}
                >
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
