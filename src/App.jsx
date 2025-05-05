import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import getIcon from './utils/iconUtils';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Icon components
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const GamepadIcon = getIcon('Gamepad');

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
      <header className="py-4 px-4 md:px-6 lg:px-8 flex justify-between items-center shadow-md bg-white dark:bg-surface-800 backdrop-blur-sm bg-white/90 dark:bg-surface-800/90 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <GamepadIcon className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold gradient-heading">Ultimate Tic Tac Toe</h1>
        </div>
        <motion.button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <SunIcon className="w-6 h-6 text-amber-400" /> : <MoonIcon className="w-6 h-6 text-primary" />}
        </motion.button>
      </header>
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="py-4 px-4 md:px-6 text-center text-sm text-surface-500 dark:text-surface-400 border-t border-surface-200 dark:border-surface-700 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} Ultimate Tic Tac Toe - A simple board game
      </footer>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
        toastClassName="font-sans text-sm backdrop-blur-sm bg-white/90 dark:bg-surface-800/90 border border-surface-200 dark:border-surface-700 shadow-lg"
      />
    </div>
  );
}

export default App;