import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature({ onGameEnd }) {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [isConfettiFalling, setIsConfettiFalling] = useState(false);

  // Icon components
  const XIcon = getIcon('X');
  const CircleIcon = getIcon('Circle');
  const RotateCcwIcon = getIcon('RotateCcw');
  const ClockIcon = getIcon('Clock');
  const PanelRightCloseIcon = getIcon('PanelRightClose');
  const PanelRightOpenIcon = getIcon('PanelRightOpen');

  // Check for winner
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]            // diagonals
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    
    // Check for draw (all squares filled)
    if (squares.every(square => square !== null)) {
      return { winner: 'draw', line: null };
    }
    
    return { winner: null, line: null };
  };

  // Handle click on a square
  const handleClick = (index) => {
    // Do nothing if square is filled or game is over
    if (board[index] || winner) return;
    
    // Create a copy of the board
    const newBoard = [...board];
    // Mark the square with X or O
    newBoard[index] = isXNext ? 'X' : 'O';
    
    // Update board state
    setBoard(newBoard);
    
    // Add to game history
    const moveDescription = `Player ${isXNext ? 'X' : 'O'} marked square ${index + 1}`;
    setGameHistory(prev => [...prev, { 
      board: [...newBoard], 
      move: moveDescription,
      player: isXNext ? 'X' : 'O',
      position: index
    }]);
    
    // Switch turn
    setIsXNext(!isXNext);
  };

  // Start a new game
  const handleNewGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
    setGameHistory([]);
    setIsConfettiFalling(false);
  };

  // Check for winner after each move
  useEffect(() => {
    const result = calculateWinner(board);
    
    if (result.winner && !winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      
      // Notify parent component about game end
      if (onGameEnd && typeof onGameEnd === 'function') {
        onGameEnd(result.winner);
      }
      
      // Show confetti for win (not for draw)
      if (result.winner !== 'draw') {
        setIsConfettiFalling(true);
        setTimeout(() => setIsConfettiFalling(false), 4000);
      }
    }
  }, [board, winner, onGameEnd]);

  // Function to determine what to render in each square
  const renderSquare = (index) => {
    let content = null;
    
    if (board[index] === 'X') {
      content = <XIcon className="w-8 h-8 md:w-12 md:h-12 text-primary" />;
    } else if (board[index] === 'O') {
      content = <CircleIcon className="w-8 h-8 md:w-12 md:h-12 text-secondary" />;
    }
    
    const isWinningSquare = winningLine?.includes(index);
    
    return (
      <motion.button 
        whileHover={{ scale: board[index] ? 1 : 1.05 }}
        whileTap={{ scale: board[index] ? 1 : 0.95 }}
        onClick={() => handleClick(index)}
        disabled={!!board[index] || !!winner}
        className={`
          aspect-square flex items-center justify-center 
          border-2 border-surface-300 dark:border-surface-600
          ${isWinningSquare ? 'bg-green-100 dark:bg-green-900' : 'bg-white dark:bg-surface-800'}
          ${!board[index] && !winner ? 'hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer' : ''}
          text-4xl font-bold transition-colors duration-200
        `}
        aria-label={`Square ${index + 1}`}
      >
        {content}
      </motion.button>
    );
  };

  // Confetti effect component for winners
  const Confetti = () => (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: -20, 
            x: Math.random() * window.innerWidth,
            rotate: Math.random() * 360,
            opacity: 1
          }}
          animate={{ 
            y: window.innerHeight + 100,
            rotate: Math.random() * 360 + 360,
            opacity: 0
          }}
          transition={{ 
            duration: Math.random() * 2 + 2,
            ease: "linear",
            delay: Math.random() * 3
          }}
          className={`absolute w-3 h-3 rounded-full ${
            Math.random() > 0.5 
              ? (Math.random() > 0.5 ? 'bg-primary' : 'bg-primary-light')
              : (Math.random() > 0.5 ? 'bg-secondary' : 'bg-secondary-light')
          }`}
        />
      ))}
    </div>
  );

  // Status message
  const getStatusMessage = () => {
    if (winner === 'draw') {
      return "It's a draw!";
    } else if (winner) {
      return `Player ${winner} wins!`;
    } else {
      return `Next player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div className="relative">
      {isConfettiFalling && <Confetti />}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden"
      >
        <div className="md:flex md:justify-between md:items-start gap-6">
          <div className="md:flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Game Board</h2>
              <button
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                className="btn btn-outline p-2 md:hidden"
                aria-label="Toggle history panel"
              >
                {showHistoryPanel ? <PanelRightCloseIcon className="w-5 h-5" /> : <PanelRightOpenIcon className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="mb-6">
              <div className={`text-lg font-medium p-3 rounded-lg text-center ${
                winner === 'X' ? 'bg-primary/10 text-primary' :
                winner === 'O' ? 'bg-secondary/10 text-secondary' :
                winner === 'draw' ? 'bg-surface-200 dark:bg-surface-700' :
                isXNext ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
              }`}>
                {getStatusMessage()}
              </div>
            </div>
            
            {/* Game grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-md mx-auto">
              {Array(9).fill(null).map((_, i) => (
                <div key={i}>
                  {renderSquare(i)}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewGame}
                className="btn btn-primary flex items-center gap-2"
              >
                <RotateCcwIcon className="w-5 h-5" />
                New Game
              </motion.button>
            </div>
          </div>
          
          {/* Game History Panel - Hidden on mobile unless toggled */}
          <AnimatePresence>
            {(showHistoryPanel || window.innerWidth >= 768) && (
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="mt-8 md:mt-0 md:w-64 bg-surface-100 dark:bg-surface-700/50 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ClockIcon className="w-5 h-5 text-surface-500" />
                  <h3 className="text-lg font-semibold">Move History</h3>
                </div>
                
                {gameHistory.length === 0 ? (
                  <p className="text-surface-500 dark:text-surface-400 text-sm text-center py-4">
                    No moves yet. Start playing!
                  </p>
                ) : (
                  <div className="max-h-80 overflow-y-auto scrollbar-hide space-y-2">
                    {gameHistory.map((historyItem, idx) => (
                      <div 
                        key={idx}
                        className="text-sm p-2 rounded border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800"
                      >
                        <div className="flex items-center gap-2">
                          {historyItem.player === 'X' ? (
                            <XIcon className="w-4 h-4 text-primary" />
                          ) : (
                            <CircleIcon className="w-4 h-4 text-secondary" />
                          )}
                          <span>
                            Move {idx + 1}: Position {historyItem.position + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}