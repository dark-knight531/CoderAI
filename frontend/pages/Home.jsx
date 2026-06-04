import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../src/api/api.js';

const Home = () => {
  const navigate = useNavigate();
  
  // UI State
  const [isLogin, setIsLogin] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // 1. Initial Setup (Animation & Theme)
  useEffect(() => {
    // Trigger slide-in animation
    const timer = setTimeout(() => setAnimate(true), 50);
    
    // Sync theme with localStorage (Defaulting to Dark Mode)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }

    return () => clearTimeout(timer);
  }, []);

  // 2. Theme Toggle Handler
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 3. Form Input Handler
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. API Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Clear previous errors
    
    try {
      if (isLogin) {
        // --- REAL LOGIN API CALL ---
        await axios.post('/api/v1/users/login', {
          email: formData.email,
          password: formData.password
        }, {
          withCredentials: true // Crucial for receiving the HTTP-only JWT cookie
        });
        
        // Silently redirect to Dashboard
        navigate('/dashboard'); 
        
      } else {
        // --- REAL REGISTER API CALL ---
        await axios.post('/api/v1/users/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        
        // Silently switch UI to Login form
        setIsLogin(true); 
        // Clear password so they have to type it to log in
        setFormData({ ...formData, password: '' });
      }
    } catch (error) {
      // Display error silently in the UI instead of a browser alert
      setErrorMsg(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative">
      
      {/* Floating Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={() => navigate('/')}
          className="text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 font-medium bg-white/50 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg transition-colors border border-slate-200 dark:border-white/10 shadow-sm"
        >
          ← Back
        </button>
      </div>

      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
         <button 
            onClick={toggleTheme} 
            className="p-3 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
            title="Toggle Theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
      </div>

      {/* LEFT SIDE: Branding Panel */}
      <div 
        className={`w-full md:w-1/2 flex flex-col justify-center items-center p-12 text-center border-r border-slate-950/50 transform transition-all duration-700 ease-out 
          bg-gradient-to-br from-slate-200 to-slate-300 dark:from-black dark:to-zinc-950
          ${animate ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
        `}
      >
        <div className="max-w-lg space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-wider text-slate-900 dark:text-slate-100 drop-shadow-sm transition-colors">
            CODER<span className="text-blue-600 dark:text-blue-400">AI</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed max-w-md mx-auto transition-colors">
            Your Personal AI Code Reviewer – Debug, Analyze & Optimize your code. Turn your bugs into clean, scalable software.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form Panel */}
      <div 
        className={`w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 transform transition-all duration-700 ease-out
          bg-slate-50 dark:bg-slate-900
          ${animate ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        
        {/* The Card */}
        <div className="w-full max-w-md p-8 md:p-10 rounded-2xl shadow-2xl z-10 transition-colors duration-300
          bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/50
        ">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white transition-colors">
              {isLogin ? 'Login' : 'Register'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 transition-colors">
              {isLogin 
                ? 'Login using your registered credentials to access your dashboard.' 
                : 'Create a new account to start reviewing and optimizing your code.'}
            </p>
          </div>

          {/* UI Error Box - Replaces the alert() */}
          {errorMsg && (
            <div className="mb-6 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm font-medium text-red-600 dark:text-red-400 text-center animate-pulse">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-zinc-300 transition-colors">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                    bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500
                  "
                  placeholder="Enter your username"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-zinc-300 transition-colors">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                    bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500
                  "
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-zinc-300 transition-colors">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                    bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500
                  "
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full font-bold py-3 rounded-lg transition-colors mt-4 shadow-lg tracking-wide
                bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 dark:shadow-blue-900/20
              "
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Button */}
          <div className="mt-6 text-center border-t pt-6 border-slate-200 dark:border-zinc-700 transition-colors">
            <p className="text-sm text-slate-500 dark:text-zinc-400 transition-colors">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg(''); // Clear errors when switching views
                }}
                className="font-semibold transition-colors text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {isLogin ? 'Register now' : 'Sign in here'}
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;