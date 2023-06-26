import React, { useState } from 'react';

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
  const placeShip = (isPlayerBoard: boolean, ship: keyof typeof ships, row: number, col: number) => {
    // Check if ship can be placed (assuming horizontal placement)
    const shipSize = ships[ship];
    if (gameState.availableShips[ship] <= 0) {
      alert('No more ships of this type available.');
      return;
    }
    if (col + shipSize <= 10) {
      // Check if the spot is empty
      const board = isPlayerBoard ? gameState.playerBoard : gameState.computerBoard;
      for (let i = 0; i < shipSize; i++) {
        if (board[row][col + i] !== 0) {
          alert('Ship cannot be placed here.');
          return;
        }
      }
      // Place ship
      const newBoard = isPlayerBoard ? [...gameState.playerBoard] : [...gameState.computerBoard];
      for (let i = 0; i < shipSize; i++) {
        newBoard[row][col + i] = 1;
      }
      // Decrease available ships count
      const newAvailableShips = { ...gameState.availableShips };
      newAvailableShips[ship] -= 1;
      setGameState(prevState => ({
        ...prevState,
        playerBoard: isPlayerBoard ? newBoard : prevState.playerBoard,
        computerBoard: isPlayerBoard ? prevState.computerBoard : newBoard,
        availableShips: newAvailableShips,
      }));
    } else {
      alert('Ship cannot be placed here.');
    }
  }

  return (
<main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>

  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '90%' }}>
  
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h1>Welcome to the Battleship game!</h1>
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
              style={{ width: '30px', height: '30px' }}
              key={j}
              onClick={() => currentShip && placeShip(true, currentShip, i, j)}
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
              onClick={() => currentShip && placeShip(false, currentShip, i, j)}
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


<div style={{ marginLeft: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'center', textAlign: 'center' }}>
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
