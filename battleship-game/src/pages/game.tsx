import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../app/globals.css';

export default function Game() {
  const [winner, setWinner] = useState<string | null>(null);
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
    computerShips: {
      carrier: 1,
      battleship: 1,
      cruiser: 1,
      submarine: 1,
      destroyer: 1,
    },
    currentPlayer: "player",
    gameOver: false,
    playerScore: 0,
    computerScore: 0,
    round: 1,
  });

  interface GameState {
    currentPlayer: 'player' | 'computer';
    gameOver: boolean;
    playerScore: number;
    computerScore: number;
    round: number;
    playerBoard: number[][];
    computerBoard: number[][];
    availableShips: { 
      carrier: number;
      battleship: number;
      cruiser: number;
      submarine: number;
      destroyer: number;
    };
    computerShips: { 
      carrier: number;
      battleship: number;
      cruiser: number;
      submarine: number;
      destroyer: number;
    };
  }

  const initialGameState: GameState = {
    playerBoard: Array(10).fill(null).map(() => Array(10).fill(0)),
    computerBoard: Array(10).fill(null).map(() => Array(10).fill(0)),
    availableShips: {
      carrier: 1,
      battleship: 1,
      cruiser: 1,
      submarine: 1,
      destroyer: 1,
    },
    computerShips: {
      carrier: 1,
      battleship: 1,
      cruiser: 1,
      submarine: 1,
      destroyer: 1,
    },
    currentPlayer: "player",
    gameOver: false,
    playerScore: 0,
    computerScore: 0,
    round: 1,
  };  

  const [currentShip, setCurrentShip] = useState<keyof typeof ships | null>(null);

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

  // Ship definitions with their sizes
  const ships = useMemo(() => ({
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  }), []);

  const placeShip = useCallback((board: number[][], ship: keyof typeof ships, row: number, col: number, isVertical: boolean) => {
    const shipSize = ships[ship];
    const newBoard = board.map(row => [...row]);

    if (isVertical && row + shipSize <= 10) {
        for (let i = 0; i < shipSize; i++) {
            if (board[row + i][col] !== 0) {
                return null;
            }
        }

        for (let i = 0; i < shipSize; i++) {
            newBoard[row + i][col] = 1;
        }
    } else if (!isVertical && col + shipSize <= 10) {
        for (let i = 0; i < shipSize; i++) {
            if (board[row][col + i] !== 0) {
                return null;
            }
        }

        for (let i = 0; i < shipSize; i++) {
            newBoard[row][col + i] = 1;
        }
    } else {
        return null;
    }

    return newBoard;
}, [ships]);



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

  // Function for placing computer ships
  const placeComputerShips = useCallback(() => {
    setGameState((prevState) => {
      let newComputerBoard = [...prevState.computerBoard];
      let newComputerShips = { ...prevState.computerShips };
  
      while (Object.values(newComputerShips).some(count => count > 0)) {
        const shipTypes = Object.keys(newComputerShips).filter(ship => newComputerShips[ship as keyof typeof newComputerShips] > 0);
        const ship = shipTypes[Math.floor(Math.random() * shipTypes.length)] as keyof typeof ships;
        const isVertical = Math.random() > 0.5;
        const row = Math.floor(Math.random() * (isVertical ? 10 - ships[ship] + 1 : 10));
        const col = Math.floor(Math.random() * (isVertical ? 10 : 10 - ships[ship] + 1));
  
        const newBoard = placeShip(newComputerBoard, ship, row, col, isVertical);
  
        if (newBoard !== null) {
          newComputerBoard = newBoard;
          newComputerShips[ship] -= 1;
        }
      }
  
      return {
        ...prevState,
        computerBoard: newComputerBoard,
        computerShips: newComputerShips,
      };
    });
  }, [placeShip, ships]);  

  useEffect(() => {
    placeComputerShips();
}, [placeComputerShips]);
  


  // Intro messages
  const [countdownMessageVisible, setCountdownMessageVisible] = useState(false);
  const [shipsPlacedMessageVisible, setShipsPlacedMessageVisible] = useState(false);
  const [dummyState, setDummyState] = useState(false);


  const startGame = () => {
    setGameStarted(true);
    setShipsPlacedMessageVisible(true);
    
    setTimeout(() => {
      setShipsPlacedMessageVisible(false);
    }, 5000); // 5 seconds
  }

  useEffect(() => {
    // Check if all ships have been placed
    const allShipsPlaced = Object.values(gameState.availableShips).every(count => count === 0);

    if (allShipsPlaced) {
        setShipsPlaced(true);
        setShipsPlacedMessageVisible(false); // Hide the "Place your ships!" message
        setCountdownMessageVisible(true); // Show the countdown message
    }
  }, [gameState.availableShips]);

  useEffect(() => {
    if (shipsPlaced) {
        setShipsPlacedMessageVisible(false); 

        setTimeout(() => {
            setCountdown(3);
            setCountdownMessageVisible(true); 

            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown !== null && prevCountdown > 1 ? prevCountdown - 1 : null);
            }, 1000);

            setTimeout(() => {
                clearInterval(countdownInterval);
                setCountdownMessageVisible(false); 
            }, 3000);
        }, 500); // Add delay to allow for fade out
    }
  }, [shipsPlaced]);

    // Starting the countdown
    useEffect(() => {
      if (countdown !== null && countdown > 0) {
          const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
          return () => clearTimeout(timerId); // Clearing the timeout if the component unmounts
      } else if (countdown !== null && countdown === 0) {
          setGameStarted(true);
          setCountdownMessageVisible(false); // Hide the countdown message
      }
  }, [countdown]);
  





  // Function to handle player attack
  const handlePlayerAttack = (row: number, col: number) => {
    if (gameState.currentPlayer !== "player" || gameState.gameOver || gameState.computerBoard[row][col] > 1 || countdown !== null && countdown > 0) {
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

    if (allShipsSunk(gameState.computerBoard)) {
      setGameState(prevState => ({
        ...prevState,
        gameOver: true,
      }));
    }

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

    if (allShipsSunk(gameState.playerBoard)) {
      setGameState(prevState => ({
        ...prevState,
        gameOver: true,
      }));
    }

    newState.currentPlayer = "player";
    setGameState(newState);

  }, [gameState]);

  useEffect(() => {
    if (gameState.currentPlayer === "computer" && !gameState.gameOver) {
      setTimeout(handleComputerAttack, 1000);
    }
  }, [gameState, handleComputerAttack]);


  // Function for checking if a side has won
  const allShipsSunk = (board: number[][]) => {
    return !board.some(row => row.includes(1));  // Returns true if no cell contains 1 (a ship)
  };

  // Checking who actually won
  useEffect(() => {
    const playerShipsRemaining = Object.values(gameState.availableShips).some(val => val > 0);
    const computerShipsRemaining = Object.values(gameState.computerShips).some(val => val > 0);
    
    if (!computerShipsRemaining) {
      setWinner('Player');
    } else if (!playerShipsRemaining) {
      setWinner('Computer');
    }
  }, [gameState.availableShips, gameState.computerShips]);  

  // Following for animations n stuff
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    if (!gameStarted || (!shipsPlaced && countdown === null)) {
      const timeoutId = setTimeout(() => setHeaderVisible(false), 3000);
      return () => clearTimeout(timeoutId); 
    }
  }, [gameStarted, shipsPlaced, countdown]);
  
  
  return (
    <main style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh', backdropFilter: shipsPlacedMessageVisible || countdownMessageVisible ? 'blur(8px)' : 'none' }}>
        {!gameStarted && <h1>Welcome to the Battleship game!</h1>}
        {!gameStarted ? (
          <button onClick={startGame} style={{ fontSize: '2em' }}>Get Started</button>
        ) : (
          <>
            {!shipsPlaced && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: shipsPlacedMessageVisible ? 1 : 0, transition: 'opacity 0.5s' }}>
                <h2 style={{ fontSize: '3em', zIndex: 9999, color: '#000000' }}>Place your ships!</h2>
              </div>            
            )}
            {shipsPlaced && countdown !== null && countdown > 0 && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ fontSize: '5em', zIndex: 9999, color: '#fc0303' }}>Game starts in: {countdown}</h2>
              </div>
            )}
          </>
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
                    border: '1px solid grey', // Add a border to the cells
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
                      (currentShip && (placedShips[currentShip as keyof typeof placedShips] || gameState.availableShips[currentShip] <= 0))
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
                  onClick={() => {
                    if (currentShip && !shipsPlaced) {
                      const newBoard = placeShip(gameState.playerBoard, currentShip, i, j, isVertical);
                      if (newBoard) {
                        setGameState(prevState => ({
                          ...prevState,
                          playerBoard: newBoard,
                          availableShips: {
                            ...prevState.availableShips,
                            [currentShip]: prevState.availableShips[currentShip] - 1
                          }
                        }));
                      }
                      
                      // Check if all ships have been placed
                      if (Object.values(gameState.availableShips).every(val => val === 0)) {
                        setShipsPlaced(true);
                      }
                    }
                  }}
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
                          border: '1px solid grey',
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
    {gameStarted && !shipsPlaced &&
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
    {gameState.gameOver && (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(8px)'
  }}>
    <h2 style={{ fontSize: '3em', color: '#333' }}>{winner === 'Player' ? 'You won!' : 'You lost!'}</h2>
  </div>
)}


  </main>
  );
}