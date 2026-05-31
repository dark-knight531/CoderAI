import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  // Default to dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check localStorage to persist user's choice
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white font-mono shadow-md">
            {'</>'}
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">CoderAI</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          <button 
            onClick={() => navigate('/home')}
            className="text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-5 py-2.5 rounded-full transition-all shadow-sm"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 lg:flex lg:items-center lg:gap-12">
        
        {/* Left Side: Copy & CTA */}
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-2 transition-colors">
            🚀 Powered by Groq & Llama-3.3
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight transition-colors">
            Fix bugs faster. <br className="hidden md:block" />
            <span className="text-blue-600 dark:text-blue-500">Write cleaner code.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-colors">
            Stop wrestling with cryptic syntax errors. CoderAI reviews your logic instantly, suggests optimized approaches, and explains algorithmic complexity while you build.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={() => navigate('/home')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 dark:shadow-blue-900/40 transition-all transform hover:-translate-y-0.5"
            >
              Get Started for Free
            </button>
            {/* <div className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">
              No credit card required.
            </div> */}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-slate-100 dark:border-slate-800 max-w-md mx-auto lg:mx-0 text-left transition-colors">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">10+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-1">Languages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">&lt; 2s</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-1">Response</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">24/7</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-1">AI Assistant</div>
            </div>
          </div>
        </div>

        {/* Right Side: Code Mockup */}
        <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl -z-10 opacity-70 transition-colors"></div>
          
          <div className="bg-slate-900 dark:bg-[#0d1117] rounded-2xl shadow-2xl border border-slate-800 dark:border-slate-700/50 overflow-hidden transform rotate-1 hover:rotate-0 transition-all duration-500">
            <div className="bg-slate-950 px-4 py-3 flex items-center gap-2 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mx-auto text-xs font-mono text-slate-400">target_sum.cpp</div>
            </div>
            
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-slate-300">
              <div><span className="text-pink-400">int</span> <span className="text-blue-400">twoSum</span>(vector&lt;<span className="text-pink-400">int</span>&gt;&amp; nums, <span className="text-pink-400">int</span> target) {'{'}</div>
              <div className="text-slate-500 pl-4">// O(n^2) Brute Force Approach</div>
              <div className="pl-4"><span className="text-pink-400">for</span> (<span className="text-pink-400">int</span> i = <span className="text-orange-400">0</span>; i &lt; nums.<span className="text-blue-300">size</span>(); i++) {'{'}</div>
              <div className="pl-8 relative">
                <span className="text-pink-400">for</span> (<span className="text-pink-400">int</span> j = <span className="text-orange-400">1</span>; j &lt; nums.<span className="text-blue-300">size</span>(); j++) {'{'}
                
                <div className="absolute top-8 left-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 w-64 z-20 animate-bounce font-sans transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-xl">💡</div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Optimization Found</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 transition-colors">Starting 'j' at 1 causes redundant checks. Use an unordered_map to achieve O(n) time complexity.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pl-12 mt-20"><span className="text-pink-400">if</span> (nums[i] + nums[j] == target) {'{'}</div>
              <div className="pl-16"><span className="text-pink-400">return</span> {'{'}i, j{'}'};</div>
              <div className="pl-12">{'}'}</div>
              <div className="pl-8">{'}'}</div>
              <div className="pl-4">{'}'}</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Landing;