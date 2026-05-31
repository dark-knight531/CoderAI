import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from '@monaco-editor/react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Theme & UI State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // App Data State
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [userPrompt, setUserPrompt] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');
  
  // History State
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // 1. Initial Setup (Theme & Fetch History)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    fetchHistory();
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

  const handleLogout = () => {
    navigate('/auth');
  };

  // --- API CALLS ---

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/ai/history', { 
        withCredentials: true 
      });
      
      let rawHistory = [];
      if (Array.isArray(response.data?.data)) {
        rawHistory = response.data.data;
      } else if (Array.isArray(response.data?.data?.history)) {
        rawHistory = response.data.data.history;
      }
      
      const formattedHistory = rawHistory.map(item => ({
        _id: item._id,
        language: item.language,
        code: item.promptCode,
        review: item.aiResponse,
        createdAt: item.createdAt
      }));
      
      setHistory(formattedHistory); 
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleReviewRequest = async () => {
    if (!codeSnippet.trim()) return;
    
    setIsLoading(true);
    setError('');
    setAiResponse('');

    try {
      const response = await axios.post('http://localhost:8000/api/v1/ai/review', 
        { 
          code: codeSnippet, 
          language: language,
          prompt: userPrompt
        }, 
        { withCredentials: true }
      );

      // Safe extraction to prevent SyntaxHighlighter crashes
      const newReview = response.data?.data?.review || "No feedback generated.";
      setAiResponse(newReview);

      const newHistoryItem = {
        _id: Date.now().toString(),
        language,
        code: codeSnippet,
        review: newReview,
        createdAt: new Date().toISOString()
      };
      setHistory([newHistoryItem, ...history]);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze code. Make sure you are logged in!");
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoryItem = (item) => {
    setCodeSnippet(item.code);
    setLanguage(item.language);
    setAiResponse(item.review);
    setUserPrompt(''); 
    setIsHistoryOpen(false); 
  };

  // --- MONACO EDITOR CUSTOM THEMES ---
  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('coderai-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C586C0', fontStyle: 'bold' }, 
        { token: 'type', foreground: '4EC9B0' }, 
        { token: 'string', foreground: 'CE9178' }, 
        { token: 'number', foreground: 'B5CEA8' }, 
        { token: 'identifier', foreground: '9CDCFE' }, 
        { token: 'function', foreground: 'DCDCAA' } 
      ],
      colors: {
        'editor.background': '#0d1117', 
        'editor.foreground': '#c9d1d9',
        'editorLineNumber.foreground': '#6e7681',
        'editor.lineHighlightBackground': '#161b22', 
        'editor.selectionBackground': '#264f78',
        'editorIndentGuide.background': '#21262d',
      }
    });

    monaco.editor.defineTheme('coderai-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0000ff', fontStyle: 'bold' },
        { token: 'string', foreground: 'a31515' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.lineHighlightBackground': '#f1f5f9', 
        'editorLineNumber.foreground': '#94a3b8',
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 flex flex-col relative overflow-hidden">
      
      {/* --- SLIDING HISTORY SIDEBAR --- */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-[#0d1117] border-l border-slate-300 dark:border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Review History</h2>
          <button 
            onClick={() => setIsHistoryOpen(false)}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-2xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {isLoadingHistory ? (
            <div className="text-center text-slate-500 dark:text-slate-400 mt-10 animate-pulse">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 mt-10 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              No past reviews found.<br/> Start analyzing some code!
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item._id} 
                onClick={() => loadHistoryItem(item)}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900/50 dark:hover:bg-slate-800 cursor-pointer transition-all shadow-sm group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-wider">
                    {item.language}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 font-mono bg-slate-50 dark:bg-black/50 p-2 rounded border border-slate-100 dark:border-transparent">
                  {item.code}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isHistoryOpen && (
        <div 
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* --- NAVBAR --- */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 px-6 py-4 flex justify-between items-center transition-colors relative z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white font-mono shadow-sm">
            {'</>'}
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">CoderAI</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="text-sm font-semibold bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-slate-300 dark:border-slate-700 shadow-sm"
          >
            <span>📜</span> History
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-transparent"
            title="Toggle Theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden h-[calc(100vh-73px)] relative z-10">
        
        {/* LEFT PANEL: Code & Input */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-[#0d1117] rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          
          <div className="bg-slate-100 dark:bg-slate-900/50 px-4 py-3 border-b border-slate-300 dark:border-slate-800 flex justify-between items-center transition-colors z-10">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Source Code</span>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="react">React/JSX</option>
            </select>
          </div>
          
          {/* MONACO EDITOR */}
          <div className="flex-1 w-full overflow-hidden pt-2">
            <Editor
              height="100%"
              language={language === 'react' ? 'javascript' : language === 'cpp' ? 'cpp' : language}
              theme={isDarkMode ? 'coderai-dark' : 'coderai-light'}
              beforeMount={handleEditorWillMount}
              value={codeSnippet}
              onChange={(value) => setCodeSnippet(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                fontFamily: "'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
                fontLigatures: true,
                smoothScrolling: true,
                cursorBlinking: 'smooth'
              }}
            />
          </div>
          
          <div className="bg-slate-50 dark:bg-[#0a0d12] border-t border-slate-300 dark:border-slate-800 p-3 px-4 transition-colors z-10">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ask a specific question... (optional)"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors shadow-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading && codeSnippet.trim()) {
                  handleReviewRequest();
                }
              }}
            />
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-300 dark:border-slate-800 transition-colors z-10">
            <button 
              onClick={handleReviewRequest}
              disabled={isLoading || !codeSnippet.trim()}
              className={`w-full py-3 rounded-lg font-bold tracking-wide transition-all ${
                isLoading || !codeSnippet.trim() 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
              }`}
            >
              {isLoading ? 'Analyzing Code...' : 'Analyze Code'}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: AI Output */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-[#0d1117] rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          
          <div className="bg-slate-100 dark:bg-slate-900/50 px-4 py-3 border-b border-slate-300 dark:border-slate-800 flex justify-between items-center transition-colors">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">AI Feedback</span>
            {isLoading && (
              <span className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                Thinking...
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {error ? (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm font-medium">
                ⚠️ {error}
              </div>
            ) : aiResponse ? (
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm">
                <SyntaxHighlighter 
                  language="markdown" 
                  style={isDarkMode ? vscDarkPlus : vs}
                  customStyle={{ background: 'transparent', padding: 0, margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {aiResponse}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-500 text-center px-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl border border-slate-200 dark:border-transparent">🤖</div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Paste your code and hit analyze to get instant feedback on logic, performance, and best practices.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;