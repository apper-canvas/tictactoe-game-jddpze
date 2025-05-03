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
      toast.success('Player X wins the game!');
    } else if (result === 'O') {
      toast.success('Player O wins the game!');
    } else if (result === 'draw') {
      toast.info('The game ended in a draw!');
    }
  };
  
  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('tictactoe_stats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary dark:text-primary-light"
        >
          Tic Tac Toe
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto"
        >
          Play the classic game of X's and O's. Take turns to mark spaces on the 3x3 grid and be the first to get three in a row!
        </motion.p>
      </div>
      
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
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Game Statistics</h3>
              <TrophyIcon className="w-6 h-6 text-accent" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg p-3 bg-surface-100 dark:bg-surface-700 flex flex-col items-center">
                <XIcon className="w-6 h-6 text-primary mb-1" />
                <span className="text-sm">X Wins</span>
                <span className="text-xl font-bold">{gameStats.xWins}</span>
              </div>
              
              <div className="rounded-lg p-3 bg-surface-100 dark:bg-surface-700 flex flex-col items-center">
                <CircleIcon className="w-6 h-6 text-secondary mb-1" />
                <span className="text-sm">O Wins</span>
                <span className="text-xl font-bold">{gameStats.oWins}</span>
              </div>
              
              <div className="rounded-lg p-3 bg-surface-100 dark:bg-surface-700 flex flex-col items-center">
                <MinusIcon className="w-6 h-6 text-surface-500 mb-1" />
                <span className="text-sm">Draws</span>
                <span className="text-xl font-bold">{gameStats.draws}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
              <p className="text-surface-600 dark:text-surface-400 text-center">
                Total Games: <span className="font-bold">{gameStats.totalGames}</span>
              </p>
            </div>
          </motion.div>
          
          {/* How to Play Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">How to Play</h3>
              <InfoIcon className="w-6 h-6 text-primary" />
            </div>
            
            <div className="mb-4">
              <button 
                onClick={() => setShowInstructions(!showInstructions)}
                className="btn btn-outline w-full flex justify-between items-center"
              >
                <span>{showInstructions ? "Hide Instructions" : "Show Instructions"}</span>
                {showInstructions ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-surface-700 dark:text-surface-300 space-y-3 text-sm"
              >
                <p>1. The game is played on a 3x3 grid.</p>
                <p>2. Players take turns placing X or O in empty cells.</p>
                <p>3. The first player to get 3 of their marks in a row (horizontally, vertically, or diagonally) wins.</p>
                <p>4. If all cells are filled and no player has 3 in a row, the game ends in a draw.</p>
                <p>5. Click "New Game" to start over at any time.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}