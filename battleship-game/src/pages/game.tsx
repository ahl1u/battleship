import React, { useState, useEffect, useCallback } from 'react';

export default function Game() {
  // Initialize game state
  const [gameState, setGameState] = useState<{
    
    playerBoard: number[][];
    computerBoard: number[][];
    availableShips: Record<string, number>;
  }>({
    playerBoard: Array(10).fill(null).map(() => Array(10).fill(0)),
    computerBoard: Array(10).fill(null).map(() => Array(10).fill(0)),
    availableShips: {
      carrier: 1,
      battleship: 1,
      cruiser: 1,
      submarine: 1,
      destroyer: 1,
    },
  });

  // Functionality for rotating ships
  const [isVertical, setIsVertical] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'r' || event.key === 'R') {
      setIsVertical(prevIsVertical => !prevIsVertical);
      console.log(isVertical);
    }
  }, [isVertical]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const [hoveredCell, setHoveredCell] = useState({ row: -1, col: -1 });

  type hoveredCell = {
    row: number;
    col: number;
  };

  const [currentShip, setCurrentShip] = useState<keyof typeof ships | null>(null);

  // Ship definitions with their sizes
  const ships = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  };

  // Function to place a ship
  const placeShip = (isPlayerBoard: boolean, ship: keyof typeof ships, row: number, col: number, isVertical: boolean) => {
    // Check if ship can be placed
    const shipSize = ships[ship];
    if (gameState.availableShips[ship] <= 0) {
      alert('No more ships of this type available.');
      return;
    }
  
    const board = isPlayerBoard ? gameState.playerBoard : gameState.computerBoard;
    const newBoard = isPlayerBoard ? [...gameState.playerBoard] : [...gameState.computerBoard];
  
    // Check if the ship can be placed vertically
    if (isVertical && row + shipSize <= 10) {
      for (let i = 0; i < shipSize; i++) {
        if (board[row + i][col] !== 0) {
          alert('Ship cannot be placed here.');
          return;
        }
      }
  
      // Place the ship vertically
      for (let i = 0; i < shipSize; i++) {
        newBoard[row + i][col] = 1;
      }
    }
    // Check if the ship can be placed horizontally
    else if (!isVertical && col + shipSize <= 10) {
      for (let i = 0; i < shipSize; i++) {
        if (board[row][col + i] !== 0) {
          alert('Ship cannot be placed here.');
          return;
        }
      }
  
      // Place the ship horizontally
      for (let i = 0; i < shipSize; i++) {
        newBoard[row][col + i] = 1;
      }
    } else {
      alert('Ship cannot be placed here.');
      return;
    }
  
    // Decrease available ships count
    const newAvailableShips = { ...gameState.availableShips };
    newAvailableShips[ship] -= 1;
  
    setGameState((prevState) => ({
      ...prevState,
      playerBoard: isPlayerBoard ? newBoard : prevState.playerBoard,
      computerBoard: isPlayerBoard ? prevState.computerBoard : newBoard,
      availableShips: newAvailableShips,
    }));
  };
  
  

  return (
    <main style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <h1>Welcome to the Battleship game!</h1>
  
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
  
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>Player Board</div>
          <div style={{ display: 'grid', gridTemplate: 'repeat(11, 1fr) / repeat(11, 1fr)' }}>
            {/* Labels */}
            <div></div>
            {Array.from({ length: 10 }, (_, i) => String.fromCharCode(i + 65)).map((letter, i) => (
              <div key={i}>{letter}</div>
            ))}
            {gameState.playerBoard.map((row, i) => (
              <React.Fragment key={i}>
                <div>{i + 1}</div>
                {row.map((cell, j) => (
                  <button
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor:
                      currentShip &&
                      hoveredCell.row !== -1 &&
                      hoveredCell.col !== -1 &&
                      ((isVertical && hoveredCell.row <= i && hoveredCell.row > i - ships[currentShip] && hoveredCell.col === j)
                      || (!isVertical && hoveredCell.row === i && hoveredCell.col <= j && hoveredCell.col > j - ships[currentShip]))
                        ? 'grey'
                        : 'white',
                  }}
                  key={j}
                  onMouseEnter={() => setHoveredCell({ row: i, col: j })}
                  onMouseLeave={() => setHoveredCell({ row: -1, col: -1 })}
                  onClick={() => currentShip && placeShip(true, currentShip, i, j, isVertical)}
                >
                  {cell === 1 ? 'X' : ''}
              </button>
                ))}
              </React.Fragment>
            ))}
          </div>
  
          <div style={{ height: '50px' }} />
  
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>Computer Board</div>
          <div style={{ display: 'grid', gridTemplate: 'repeat(11, 1fr) / repeat(11, 1fr)' }}>
            {/* Labels */}
            <div></div>
            {Array.from({ length: 10 }, (_, i) => String.fromCharCode(i + 65)).map((letter, i) => (
              <div key={i}>{letter}</div>
            ))}
            {gameState.computerBoard.map((row, i) => (
              <React.Fragment key={i}>
                <div>{i + 1}</div>
                {row.map((cell, j) => (
                  <button
                  style={{ width: '30px', height: '30px' }}
                  key={j}
                  onClick={() => currentShip && placeShip(false, currentShip, i, j, isVertical)}
                >
                  {cell === 1 ? 'X' : ''}
                </button>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  
      <div style={{ position: 'absolute', right: 25, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h2>Available Ships:</h2>
        {Object.entries(gameState.availableShips).map(([ship, count]) => (
          <div key={ship}>
            <button
              onClick={() => setCurrentShip(ship as keyof typeof ships)}
              disabled={count <= 0}
            >
              {ship} ({count})
            </button>
          </div>
        ))}
      </div>
    </main>
  );
    }
