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
  const ChevronUpIcon = getIcon('ChevronUp');
  const ChevronDownIcon = getIcon('ChevronDown');
  const GamepadIcon = getIcon('Gamepad');
  const BarChart2Icon = getIcon('BarChart2');

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
        icon: () => <XIcon className="w-5 h-5 text-primary" />
      });
    } else if (result === 'O') {
      toast.success('Player O wins the game!', {
        icon: () => <CircleIcon className="w-5 h-5 text-secondary" />
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
        <div className="inline-flex items-center justify-center space-x-2 mb-2">
          <GamepadIcon className="w-8 h-8 text-primary" />
          <h1 className="gradient-heading text-shadow font-bold">
            Tic Tac Toe
          </h1>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto"
        >
          Play the classic game of X's and O's. Take turns to mark spaces on the 3x3 grid and be the first to get three in a row!
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
            className="glass-card card-hover"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart2Icon className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Game Statistics</h3>
              </div>
              <TrophyIcon className="w-6 h-6 text-accent" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="stat-card bg-primary/10 dark:bg-primary/20">
                <XIcon className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm text-surface-600 dark:text-surface-300">X Wins</span>
                <div className="text-2xl font-bold text-primary">{gameStats.xWins}</div>
                <div className="text-xs mt-1">{xWinPercentage}%</div>
                <div className="w-full h-1 bg-surface-200 dark:bg-surface-700 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${xWinPercentage}%` }}
                  />
                </div>
              </div>
              
              <div className="stat-card bg-secondary/10 dark:bg-secondary/20">
                <CircleIcon className="w-8 h-8 text-secondary mb-2" />
                <span className="text-sm text-surface-600 dark:text-surface-300">O Wins</span>
                <div className="text-2xl font-bold text-secondary">{gameStats.oWins}</div>
                <div className="text-xs mt-1">{oWinPercentage}%</div>
                <div className="w-full h-1 bg-surface-200 dark:bg-surface-700 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary rounded-full transition-all duration-500" 
                    style={{ width: `${oWinPercentage}%` }}
                  />
                </div>
              </div>
              
              <div className="stat-card bg-surface-100 dark:bg-surface-700/70">
                <MinusIcon className="w-8 h-8 text-surface-500 mb-2" />
                <span className="text-sm text-surface-600 dark:text-surface-300">Draws</span>
                <div className="text-2xl font-bold text-surface-600">{gameStats.draws}</div>
                <div className="text-xs mt-1">{drawPercentage}%</div>
                <div className="w-full h-1 bg-surface-200 dark:bg-surface-700 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-surface-500 rounded-full transition-all duration-500" 
                    style={{ width: `${drawPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-center items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-accent" />
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
            className="glass-card card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <InfoIcon className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">How to Play</h3>
              </div>
            </div>
            
            <div className="mb-4">
              <button 
                onClick={() => setShowInstructions(!showInstructions)}
                className="btn btn-outline w-full flex justify-between items-center"
              >
                <span>{showInstructions ? "Hide Instructions" : "Show Instructions"}</span>
                <motion.div
                  animate={{ rotate: showInstructions ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDownIcon className="w-5 h-5" />
                </motion.div>
              </button>
            </div>
            
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-surface-700 dark:text-surface-300 space-y-3 text-sm bg-surface-50 dark:bg-surface-800 p-4 rounded-lg"
              >
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
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}