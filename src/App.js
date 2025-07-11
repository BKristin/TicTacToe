import React, { useState } from 'react';
import './App.css';

// Gzhel-style SVG background (simple blue floral pattern)
const GZHEL_BG = `
  <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <pattern id='gzhel' patternUnits='userSpaceOnUse' width='120' height='120'>
        <circle cx='60' cy='60' r='50' fill='none' stroke='#1a4fa3' stroke-width='8'/>
        <ellipse cx='60' cy='60' rx='30' ry='50' fill='none' stroke='#1a4fa3' stroke-width='4'/>
        <ellipse cx='60' cy='60' rx='50' ry='30' fill='none' stroke='#1a4fa3' stroke-width='4'/>
        <circle cx='60' cy='60' r='10' fill='#1a4fa3'/>
        <circle cx='30' cy='30' r='8' fill='none' stroke='#1a4fa3' stroke-width='3'/>
        <circle cx='90' cy='90' r='8' fill='none' stroke='#1a4fa3' stroke-width='3'/>
      </pattern>
    </defs>
    <rect width='100%' height='100%' fill='url(#gzhel)'/>
  </svg>
`;

const EMPTY_BOARD = Array(9).fill(null);

function getWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell)) return 'draw';
  return null;
}

function getRandomMove(board) {
  const empty = board.map((v, i) => v ? null : i).filter(v => v !== null);
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

function App() {
  const [screen, setScreen] = useState('start'); // 'start' | 'game'
  const [board, setBoard] = useState([...EMPTY_BOARD]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Start game
  const handleStart = () => {
    setScreen('game');
    setBoard([...EMPTY_BOARD]);
    setIsPlayerTurn(true);
    setWinner(null);
    setModalOpen(false);
  };

  // Player move
  const handleCellClick = idx => {
    if (!isPlayerTurn || board[idx] || winner) return;
    const newBoard = [...board];
    newBoard[idx] = 'X';
    const win = getWinner(newBoard);
    setBoard(newBoard);
    if (win) {
      setWinner(win);
      setModalOpen(true);
      return;
    }
    setIsPlayerTurn(false);
    setTimeout(() => {
      // Computer move
      const move = getRandomMove(newBoard);
      if (move !== null) {
        newBoard[move] = 'O';
      }
      const win2 = getWinner(newBoard);
      setBoard([...newBoard]);
      if (win2) {
        setWinner(win2);
        setModalOpen(true);
        return;
      }
      setIsPlayerTurn(true);
    }, 500);
  };

  // Try again
  const handleTryAgain = () => {
    setBoard([...EMPTY_BOARD]);
    setIsPlayerTurn(true);
    setWinner(null);
    setModalOpen(false);
  };

  // Exit to start
  const handleExit = () => {
    setScreen('start');
    setBoard([...EMPTY_BOARD]);
    setIsPlayerTurn(true);
    setWinner(null);
    setModalOpen(false);
  };

  // Gzhel background as data URL
  const gzhelBg = `url('data:image/svg+xml;utf8,${encodeURIComponent(GZHEL_BG)}')`;

  return (
    <div className="App" style={{ minHeight: '100vh', backgroundImage: gzhelBg, backgroundSize: 'cover', fontFamily: 'Roboto, sans-serif' }}>
      {screen === 'start' && (
        <div className="start-screen">
          <h1 className="tic-tac-toe-title">Tic Tac Toe</h1>
          <button className="main-btn" onClick={handleStart}>Start Game</button>
        </div>
      )}
      {screen === 'game' && (
        <div className="game-screen">
          <h2 style={{ color: '#1a4fa3', textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>Player vs Computer</h2>
          <div className="board">
            {board.map((cell, idx) => (
              <button
                key={idx}
                className="cell-btn"
                onClick={() => handleCellClick(idx)}
                disabled={!!cell || !isPlayerTurn || winner}
                data-value={cell || ''}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
      )}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{ color: '#1a4fa3' }}>
              {winner === 'draw' ? 'Draw!' : winner === 'X' ? 'You Win!' : 'You Lose!'}
            </h2>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button className="main-btn" onClick={handleTryAgain}>Try Again</button>
              <button className="main-btn" onClick={handleExit}>Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
