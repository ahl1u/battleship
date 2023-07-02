# Battleship

This is a Battleship game implemented using TypeScript, CSS, React, and Next.js. The game features a player-vs-computer mode. The player is able to place their ships, while the computer places its ships randomly. The gameplay follows the classic rules of Battleship for a 10x10 grid.

This project was inspired by the work of Nick Berry, a data scientist who has done extensive research and analysis on the optimal strategies for the game of Battleship. While our version doesn't incorporate every aspect of Berry's approach (like his detailed use of probability densities and a sophisticated 'Hunt and Attack' algorithm), it does employ a simplified version of the 'Hunt and Attack' algorithm. 

You can read more about Nick Berry's work on Battleship [here](http://www.datagenetics.com/blog/december32011/).

## How to Run Locally

Follow these steps to get the game running on your local machine:

1. Clone this repository to your local machine using Git. In your terminal, navigate to the directory where you want the project to live and run:

    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:

    ```bash
    cd battleship-game
    ```

3. Install the project dependencies using npm:

    ```bash
    npm install
    ```

4. Start the Next.js development server:

    ```bash
    npm run dev
    ```

    After running this command, your terminal should output a message indicating the server is running and providing a local URL, usually `http://localhost:3000/`.

5. Open your web browser and navigate to `http://localhost:3000/` to view and interact with the app.

## How to Play

Once you've navigated to `http://localhost:3000/` in your web browser, you can begin playing the game:

1. Click the "Play" button to start a new game.
2. Place your ships on your board. You can choose which ship to place by clicking on its name under "Available Ships".
3. Once all ships are placed, the game begins. Click on the computer's board to take shots at the computer's ships.
4. The game continues until all of one player's ships are sunk. A message will then display declaring the winner.
5. To play again, click the "Reset Game" button.