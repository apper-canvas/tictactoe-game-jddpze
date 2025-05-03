import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function Home() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameStats, setGameStats] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0,
    totalGames: 0
  });

  // Icon components
  const InfoIcon = getIcon('Info');
  const XIcon = getIcon('X');
  const CircleIcon = getIcon('Circle');
  const MinusIcon = getIcon('Minus');
  const TrophyIcon = getIcon('Trophy');
  const ChevronDownIcon = getIcon('ChevronDown');
  const GamepadIcon = getIcon('Gamepad');
  const BarChart2Icon = getIcon('BarChart2');
  const SparklesIcon = getIcon('Sparkles');
  const AwardIcon = getIcon('Award');

  // Update game stats when game ends
  const updateGameStats = (result) => {
    setGameStats(prev => {
      const newStats = {
        xWins: prev.xWins + (result === 'X' ? 1 : 0),
        oWins: prev.oWins + (result === 'O' ? 1 : 0),
        draws: prev.draws + (result === 'draw' ? 1 : 0),
        totalGames: prev.totalGames + 1
      };
      
      // Save to localStorage
      localStorage.setItem('tictactoe_stats', JSON.stringify(newStats));
      return newStats;
    });
    
    // Show a toast message for the result
    if (result === 'X') {
      toast.success('Player X wins the game!', {
        icon: () => <XIcon className="w-5 h-5 text-primary x-shadow" />
      });
    } else if (result === 'O') {
      toast.success('Player O wins the game!', {
        icon: () => <CircleIcon className="w-5 h-5 text-secondary o-shadow" />
      });
    } else if (result === 'draw') {
      toast.info('The game ended in a draw!', {
        icon: () => <MinusIcon className="w-5 h-5" />
      });
    }
  };
  
  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('tictactoe_stats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);
  
  // Calculate win percentages for the charts
  const totalGamesPlayed = gameStats.totalGames || 1; // Avoid division by zero
  const xWinPercentage = Math.round((gameStats.xWins / totalGamesPlayed) * 100);
  const oWinPercentage = Math.round((gameStats.oWins / totalGamesPlayed) * 100);
  const drawPercentage = Math.round((gameStats.draws / totalGamesPlayed) * 100);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center mb-4">
          <motion.div
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "loop", 
              duration: 5,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <SparklesIcon className="absolute text-yellow-400 w-12 h-12 star-glow -top-6 -right-6" />
            <GamepadIcon className="w-16 h-16 text-primary icon-glow" />
          </motion.div>
        </div>
        <h1 className="gradient-heading text-shadow font-bold text-5xl md:text-6xl mb-4">
          Tic Tac Toe
        </h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto"
        >
          The classic game of X's and O's, reimagined. Take turns, mark spaces, and be the first to get three in a row!
        </motion.p>
      </motion.div>
      
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        <div className="lg:w-2/3">
          <MainFeature onGameEnd={updateGameStats} />
        </div>
        
        <div className="lg:w-1/3 flex flex-col gap-6">
          {/* Game Stats Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card card-hover shadow-lg overflow-hidden relative rounded-2xl border-2 border-surface-200/50 dark:border-surface-700/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-surface-700/40 dark:to-transparent opacity-50 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart2Icon className="w-6 h-6 text-primary icon-glow" />
                <h3 className="text-xl font-bold">Game Statistics</h3>
              </div>
              <motion.div
                animate={{ 
                  y: [0, -5, 0, -5, 0],
                  rotate: [0, 10, 0, -10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <TrophyIcon className="w-7 h-7 text-yellow-500 icon-glow" />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="stat-card from-primary/5 to-primary/20 dark:from-primary/10 dark:to-primary/30 border-2 border-primary/20">
                <XIcon className="w-9 h-9 text-primary x-shadow mb-2" />
                <span className="text-sm text-surface-600 dark:text-surface-300">X Wins</span>
                <div className="text-2xl font-bold text-primary">{gameStats.xWins}</div>
                <div className="text-xs mt-1 text-primary/80">{xWinPercentage}%</div>
                <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 mt-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xWinPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-primary rounded-full" 
                  />
                </div>
              </div>
              
              <div className="stat-card from-secondary/5 to-secondary/20 dark:from-secondary/10 dark:to-secondary/30 border-2 border-secondary/20">
                <CircleIcon className="w-9 h-9 text-secondary o-shadow mb-2" />
                <span className="text-sm text-surface-600 dark:text-surface-300">O Wins</span>
                <div className="text-2xl font-bold text-secondary">{gameStats.oWins}</div>
                <div className="text-xs mt-1 text-secondary/80">{oWinPercentage}%</div>
                <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 mt-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${oWinPercentage}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-secondary rounded-full" 
                  />
                </div>
              </div>
              
              <div className="stat-card from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-800 border-2 border-surface-300/30 dark:border-surface-600/30">
                <MinusIcon className="w-9 h-9 text-surface-500 mb-2" />
                <span className="text-sm text-surface-600 dark:text-surface-300">Draws</span>
                <div className="text-2xl font-bold text-surface-600">{gameStats.draws}</div>
                <div className="text-xs mt-1 text-surface-500">{drawPercentage}%</div>
                <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 mt-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${drawPercentage}%` }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className="h-full bg-surface-500 rounded-full" 
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-center items-center gap-2">
              <AwardIcon className="w-5 h-5 text-yellow-500" />
              <p className="text-surface-600 dark:text-surface-400">
                Total Games: <span className="font-bold">{gameStats.totalGames}</span>
              </p>
            </div>
          </motion.div>
          
          {/* How to Play Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card card-hover shadow-lg relative rounded-2xl border-2 border-surface-200/50 dark:border-surface-700/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-surface-700/40 dark:to-transparent opacity-50 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <InfoIcon className="w-6 h-6 text-primary icon-glow" />
                <h3 className="text-xl font-bold">How to Play</h3>
              </div>
            </div>
            
            <div className="mb-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInstructions(!showInstructions)}
                className="btn w-full flex justify-between items-center py-3 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 border-2 border-surface-200/70 dark:border-surface-600/50 rounded-xl shadow-md"
              >
                <span className="font-medium">{showInstructions ? "Hide Instructions" : "Show Instructions"}</span>
                <motion.div
                  animate={{ rotate: showInstructions ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDownIcon className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </div>
            
            <motion.div
              initial={false}
              animate={{
                height: showInstructions ? "auto" : 0,
                opacity: showInstructions ? 1 : 0
              }}
              transition={{
                height: { duration: 0.3 },
                opacity: { duration: 0.2, delay: showInstructions ? 0.1 : 0 }
              }}
              className="overflow-hidden"
            >
              <div className="text-surface-700 dark:text-surface-300 space-y-3 text-sm bg-gradient-to-br from-surface-50/90 to-surface-100/80 dark:from-surface-800/90 dark:to-surface-700/80 p-4 rounded-xl border border-surface-200/50 dark:border-surface-600/50 backdrop-blur-sm">
                <p className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-medium">1</span>
                  The game is played on a 3x3 grid.
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-medium">2</span>
                  Players take turns placing X or O in empty cells.
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-medium">3</span>
                  The first player to get 3 of their marks in a row (horizontally, vertically, or diagonally) wins.
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-medium">4</span>
                  If all cells are filled and no player has 3 in a row, the game ends in a draw.
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-medium">5</span>
                  Click "New Game" to start over at any time.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}