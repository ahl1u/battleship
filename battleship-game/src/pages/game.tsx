import React, { useState, useEffect, useCallback } from 'react';

export default function Game() {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>({
    playerBoard: Array(10).fill(null).map(() => Array(10).fill(0)),
    computerBoard: Array(10).fill(null).map(() => Array(10).fill(0)),
    availableShips: {
      carrier: 1,
      battleship: 1,
      cruiser: 1,
      submarine: 1,
      destroyer: 1,
    },
    currentPlayer: "player",
    gameOver: false,
  });

  interface GameState {
    playerBoard: number[][];
    computerBoard: number[][];
    availableShips: Record<string, number>;
    currentPlayer: string;
    gameOver: boolean;
  }

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

    // After placing ship, mark it as placed
    setPlacedShips(prevState => ({ ...prevState, [ship]: true }));
  
    setGameState((prevState) => ({
      ...prevState,
      playerBoard: isPlayerBoard ? newBoard : prevState.playerBoard,
      computerBoard: isPlayerBoard ? prevState.computerBoard : newBoard,
      availableShips: newAvailableShips,
    }));
    };

  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [shipsPlaced, setShipsPlaced] = useState(false);
  const [placedShips, setPlacedShips] = useState({
    Carrier: false,
    Battleship: false,
    Cruiser: false,
    Submarine: false,
    Destroyer: false,
  });  

  // Checking if all ships have been placed
  useEffect(() => {
    const allShipsPlaced = Object.values(gameState.availableShips).every(count => count === 0);
    if (allShipsPlaced) {
      setCountdown(3);
    }
  }, [gameState.availableShips]);

  // Starting the countdown
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId); // Clearing the timeout if the component unmounts
    } else if (countdown !== null && countdown === 0) {
      setGameStarted(true);
    }
  }, [countdown]);
  

  function startGame() {
    setGameStarted(true);
  }

  useEffect(() => {
    // Check if all ships have been placed
    const allShipsPlaced = Object.values(gameState.availableShips).every(count => count === 0);

    if (allShipsPlaced) {
      setShipsPlaced(true);

      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown !== null && prevCountdown > 1 ? prevCountdown - 1 : null);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
      }, 3000);
    }
  }, [gameState.availableShips]);

// Function to handle player attack
const handlePlayerAttack = (row: number, col: number) => {
  if (gameState.currentPlayer !== "player" || gameState.gameOver || gameState.computerBoard[row][col] > 1) {
    return;
  }
  
  const newComputerBoard = [...gameState.computerBoard];
  const newState = { ...gameState };
  if (newComputerBoard[row][col] === 1) { // Hit
    newComputerBoard[row][col] = 2;
  } else if (newComputerBoard[row][col] === 0) { // Miss
    newComputerBoard[row][col] = 3;
  }

  newState.computerBoard = newComputerBoard;
  newState.currentPlayer = "computer";
  
  setGameState(newState);

  setTimeout(() => handleComputerAttack(), 1000);
};




// Function to handle computer attack
const handleComputerAttack = useCallback(() => {
  console.log('Computer is taking its turn.');

  let newState = {...gameState};
  if (newState.currentPlayer !== "computer" || newState.gameOver) return;

  let newPlayerBoard = [...newState.playerBoard];
  let row, col, hit;
  do {
    row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
    hit = newPlayerBoard[row][col];
  } while (hit > 1); // Keeps finding if the cell has already been attacked

  if (hit === 1) { // Hit
    newPlayerBoard[row][col] = 2;
  } else if (hit === 0) { // Miss
    newPlayerBoard[row][col] = 3;
  }

  newState.playerBoard = newPlayerBoard;
  newState.currentPlayer = "player";
  setGameState(newState);

}, [gameState]);

  useEffect(() => {
    if (gameState.currentPlayer === "computer" && !gameState.gameOver) {
      setTimeout(handleComputerAttack, 1000);
    }
  }, [gameState, handleComputerAttack]);




  return (
    <main style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      {!gameStarted && <h1>Welcome to the Battleship game!</h1>}
      {!gameStarted ? (
        <button onClick={startGame}>Get Started</button>
      ) : (
        !shipsPlaced ? <h2>Place your ships!</h2> : countdown !== null && countdown > 0 && <h2>Game starts in: {countdown}</h2>
      )}

      {gameStarted && 
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
                    cell === 1 ? 'gray' : // Ship
                    cell === 2 ? 'red' : // Hit ship
                    cell === 3 ? 'blue' : // Missed hit
                    currentShip &&
                    hoveredCell.row !== -1 &&
                    hoveredCell.col !== -1 &&
                    ((isVertical && hoveredCell.row <= i && hoveredCell.row > i - ships[currentShip] && hoveredCell.col === j)
                    || (!isVertical && hoveredCell.row === i && hoveredCell.col <= j && hoveredCell.col > j - ships[currentShip]))
                      ? 'grey'
                      : 'white', // Sea
                }}
                key={j}
                onMouseEnter={() => {
                  if (
                    Object.values(placedShips).every(val => val) ||
                    (currentShip && placedShips[currentShip as keyof typeof placedShips])
                  ) {
                    setHoveredCell({ row: -1, col: -1 });
                  } else {
                    setHoveredCell({ row: i, col: j });
                  }
                }}
                onMouseLeave={() => {
                  if (
                    !Object.values(placedShips).every(val => val) &&
                    !(currentShip && placedShips[currentShip as keyof typeof placedShips])
                  ) {
                    setHoveredCell({ row: -1, col: -1 });
                  }
                }}                
                onClick={() => currentShip && placeShip(true, currentShip, i, j, isVertical)}
              >
                {cell === 2 ? 'X' : ''}
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
                      style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor:
                          cell === 2 ? 'red' : // Hit ship
                          cell === 3 ? 'blue' : // Missed hit
                          'white', // Sea
                      }}
                      key={j}
                      onClick={() => handlePlayerAttack(i, j)}
                    >
                      {cell === 2 ? 'X' : ''}
                    </button>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
      </div>
    </div>
  }
  {gameStarted && 
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
}
    </main>
  );
    }
