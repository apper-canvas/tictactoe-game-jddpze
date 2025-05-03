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
  const [highlightedCell, setHighlightedCell] = useState(null);
  // Added player selection state
  const [gameStarted, setGameStarted] = useState(false);
  const [playerSelected, setPlayerSelected] = useState(null);

  // Icon components
  const XIcon = getIcon('X');
  const CircleIcon = getIcon('Circle');
  const RotateCcwIcon = getIcon('RotateCcw');
  const ClockIcon = getIcon('Clock');
  const PanelRightCloseIcon = getIcon('PanelRightClose');
  const PanelRightOpenIcon = getIcon('PanelRightOpen');
  const HistoryIcon = getIcon('History');
  const SparklesIcon = getIcon('Sparkles');
  const GamepadIcon = getIcon('Gamepad');
  const PlayIcon = getIcon('Play');

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

  // Handle player selection
  const handlePlayerSelect = (player) => {
    setPlayerSelected(player);
    setIsXNext(player === 'X');
    
    toast.success(`You selected Player ${player}!`, {
      icon: player === 'X' 
        ? () => <XIcon className="w-5 h-5 text-primary x-shadow" />
        : () => <CircleIcon className="w-5 h-5 text-secondary o-shadow" />
    });
    
    setTimeout(() => {
      setGameStarted(true);
    }, 500);
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
    
    // Highlight the last played cell
    setHighlightedCell(index);
    setTimeout(() => setHighlightedCell(null), 1000);
    
    // Switch turn
    setIsXNext(!isXNext);
    
    // Play sound effect
    playMoveSound(isXNext ? 'X' : 'O');
  };

  // Play sound effect for moves
  const playMoveSound = (player) => {
    // This is a placeholder for sound effect implementation
    // In a real implementation, you would use Audio API
    // const sound = new Audio(player === 'X' ? '/sounds/x-move.mp3' : '/sounds/o-move.mp3');
    // sound.play();
  };

  // Start a new game
  const handleNewGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine(null);
    setGameHistory([]);
    setIsConfettiFalling(false);
    setHighlightedCell(null);
    
    // Reset to selection screen
    setGameStarted(false);
    setPlayerSelected(null);
    
    toast.info('Starting a new game!', {
      icon: () => <SparklesIcon className="w-5 h-5 text-yellow-500 star-glow" />
    });
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
    let cellClass = "game-cell relative ";
    
    if (board[index] === 'X') {
      content = (
        <div className="flex items-center justify-center w-full h-full">
          <XIcon className="w-14 h-14 md:w-20 md:h-20 text-primary x-shadow" />
        </div>
      );
      cellClass += "game-cell-x ";
    } else if (board[index] === 'O') {
      content = (
        <div className="flex items-center justify-center w-full h-full">
          <CircleIcon className="w-14 h-14 md:w-20 md:h-20 text-secondary o-shadow" />
        </div>
      );
      cellClass += "game-cell-o ";
    } else {
      cellClass += "game-cell-default ";
    }
    
    const isWinningSquare = winningLine?.includes(index);
    if (isWinningSquare) {
      cellClass += "game-cell-win pulse-win ";
    }
    
    const isHighlighted = highlightedCell === index;
    
    return (
      <motion.button 
        whileHover={{ scale: board[index] || winner ? 1 : 1.05 }}
        whileTap={{ scale: board[index] || winner ? 1 : 0.95 }}
        onClick={() => handleClick(index)}
        disabled={!!board[index] || !!winner}
        className={cellClass}
        aria-label={`Square ${index + 1}`}
        animate={isHighlighted ? { 
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 0 rgba(0,0,0,0)",
            "0 0 20px rgba(99,102,241,0.6)",
            "0 0 0 rgba(0,0,0,0)"
          ]
        } : {}}
        transition={isHighlighted ? { duration: 0.5 } : {}}
      >
        <AnimatePresence mode="wait">
          {content && (
            <motion.div
              key={board[index]}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="w-full h-full flex items-center justify-center"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  // Player selection UI
  const renderPlayerSelection = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="player-selection-container p-8 rounded-2xl bg-white/90 dark:bg-surface-800/90 shadow-xl border-2 border-surface-200/50 dark:border-surface-700/50"
      >
        <h2 className="text-2xl font-bold gradient-heading text-center mb-8">Choose Your Player</h2>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`player-select-btn ${playerSelected === 'X' ? 'selected-x' : ''}`}
            onClick={() => handlePlayerSelect('X')}
          >
            <div className="relative">
              <div className="player-icon-bg player-x-bg"></div>
              <XIcon className="w-20 h-20 text-primary x-shadow relative z-10" />
            </div>
            <span className="player-label text-primary font-bold mt-4">Player X</span>
          </motion.button>
          
          <div className="text-2xl font-bold text-surface-400 dark:text-surface-500">VS</div>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`player-select-btn ${playerSelected === 'O' ? 'selected-o' : ''}`}
            onClick={() => handlePlayerSelect('O')}
          >
            <div className="relative">
              <div className="player-icon-bg player-o-bg"></div>
              <CircleIcon className="w-20 h-20 text-secondary o-shadow relative z-10" />
            </div>
            <span className="player-label text-secondary font-bold mt-4">Player O</span>
          </motion.button>
        </div>
        
        {playerSelected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameStarted(true)}
              className="btn flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white"
            >
              <PlayIcon className="w-5 h-5" />
              Start Game
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Confetti effect component for winners
  const Confetti = () => (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {Array.from({ length: 150 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: -20, 
            x: Math.random() * window.innerWidth,
            rotate: Math.random() * 360,
            opacity: 1,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: window.innerHeight + 100,
            rotate: Math.random() * 360 + 360,
            opacity: 0
          }}
          transition={{ 
            duration: Math.random() * 3 + 2,
            ease: "linear",
            delay: Math.random() * 3
          }}
          className={`absolute w-3 h-3 ${
            Math.random() > 0.7 ? 'rounded-full' : 'rounded-sm rotate-45'
          } ${
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

  // Status message styling
  const getStatusClass = () => {
    if (winner === 'X') {
      return 'border-primary text-primary bg-primary/10';
    } else if (winner === 'O') {
      return 'border-secondary text-secondary bg-secondary/10';
    } else if (winner === 'draw') {
      return 'border-surface-400 dark:border-surface-500 bg-surface-200 dark:bg-surface-700';
    } else {
      return isXNext 
        ? 'border-primary text-primary bg-primary/5' 
        : 'border-secondary text-secondary bg-secondary/5';
    }
  };

  return (
    <div className="relative">
      {isConfettiFalling && <Confetti />}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card shadow-lg backdrop-blur-sm relative overflow-hidden border-2 border-surface-200/50 dark:border-surface-700/50 rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-surface-700/40 dark:to-transparent opacity-50 pointer-events-none"></div>
        
        <AnimatePresence mode="wait">
          {!gameStarted ? (
            <motion.div
              key="player-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderPlayerSelection()}
            </motion.div>
          ) : (
            <motion.div
              key="game-board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:flex md:justify-between md:items-start gap-6"
            >
              <div className="md:flex-1">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
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
                    >
                      <GamepadIcon className="w-8 h-8 text-primary icon-glow" />
                    </motion.div>
                    <h2 className="text-2xl font-bold gradient-heading">Game Board</h2>
                  </div>
                  <button
                    onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                    className="btn btn-outline p-2 md:hidden rounded-full"
                    aria-label="Toggle history panel"
                  >
                    {showHistoryPanel ? <PanelRightCloseIcon className="w-5 h-5" /> : <PanelRightOpenIcon className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className={`game-status ${getStatusClass()} shadow-lg mb-6`}>
                  <div className="flex items-center justify-center gap-2">
                    {winner === 'X' ? (
                      <XIcon className="w-6 h-6 text-primary x-shadow" />
                    ) : winner === 'O' ? (
                      <CircleIcon className="w-6 h-6 text-secondary o-shadow" />
                    ) : isXNext ? (
                      <XIcon className="w-6 h-6 text-primary x-shadow" />
                    ) : (
                      <CircleIcon className="w-6 h-6 text-secondary o-shadow" />
                    )}
                    <span className="font-bold">{getStatusMessage()}</span>
                    {winner && winner !== 'draw' && 
                      <SparklesIcon className="w-5 h-5 text-yellow-500 star-glow" />
                    }
                  </div>
                </div>
                
                {/* Current Player Display */}
                <div className="flex justify-center mb-6">
                  <div className="current-player-display p-3 rounded-xl bg-white/80 dark:bg-surface-800/80 shadow-md border border-surface-200 dark:border-surface-700 flex items-center gap-3">
                    <div className="text-sm font-medium">You are playing as:</div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-700">
                      {playerSelected === 'X' ? (
                        <XIcon className="w-5 h-5 text-primary x-shadow" />
                      ) : (
                        <CircleIcon className="w-5 h-5 text-secondary o-shadow" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Game grid */}
                <div className="game-board mb-8 relative p-4">
                  {/* Grid lines for visual enhancement */}
                  <div className="game-board-lines">
                    {/* Horizontal lines */}
                    <div className="grid-line horizontal-line" style={{ top: '33.33%' }}></div>
                    <div className="grid-line horizontal-line" style={{ top: '66.66%' }}></div>
                    
                    {/* Vertical lines */}
                    <div className="grid-line vertical-line" style={{ left: '33.33%' }}></div>
                    <div className="grid-line vertical-line" style={{ left: '66.66%' }}></div>
                  </div>
                  
                  {Array(9).fill(null).map((_, i) => (
                    <div key={i}>
                      {renderSquare(i)}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNewGame}
                    className="btn flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-primary to-primary-dark text-white"
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
                    className="mt-8 md:mt-0 md:w-64 bg-gradient-to-br from-surface-50/90 to-surface-100/80 dark:from-surface-800/90 dark:to-surface-700/80 rounded-xl p-4 shadow-inner border border-surface-200/50 dark:border-surface-700/50 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <HistoryIcon className="w-5 h-5 text-primary icon-glow" />
                      <h3 className="text-lg font-semibold">Move History</h3>
                    </div>
                    
                    {gameHistory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <motion.div
                          animate={{ 
                            y: [0, -5, 0],
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            repeatType: "loop", 
                            duration: 2,
                            ease: "easeInOut"
                          }}
                        >
                          <ClockIcon className="w-10 h-10 text-surface-400 mb-2 opacity-50" />
                        </motion.div>
                        <p className="text-surface-500 dark:text-surface-400 text-sm">
                          No moves yet. Start playing!
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto scrollbar-hide space-y-2 pr-1">
                        {gameHistory.map((historyItem, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="text-sm p-3 rounded-lg border border-surface-200 dark:border-surface-600 bg-white/90 dark:bg-surface-800/90 shadow-sm hover:shadow-md transition-shadow"
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
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}