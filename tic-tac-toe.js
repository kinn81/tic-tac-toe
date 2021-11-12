const PlayerFactory = (name, symbol) => {
    name = name;
    symbol = symbol;
    getName = () => {
        return name;
    }

    getSymbol = () => {
        return symbol;
    }

    introduceSelf = () => {
        console.log('Hi, my name is ' + name + ' and my symbol is ' + symbol);
    }
    return { getName, getSymbol, introduceSelf }
}

/*************
    GameBoard
    The GameBoard object holds an array representing the current state of the game
    It exposes methods to clearBoard, makeMove, checkValidMove, printBoard, and checkForWinner 
**************/
const GameBoard = (() => {
    let board = Array.apply(null, Array(8)).map(function () { })
    let movesMade = 0;
    let winner = undefined;

    const clearBoard = () => {
        board = Array.apply(null, Array(8)).map(function () { });
        winner = undefined;
        movesMade = 0;
    }

    const makeMove = (symbol, position) => {
        if (winner) return;
        if (checkValidMove(position)) {
            board[position] = symbol;
            movesMade++;
            checkForWinner(symbol, position);
            return true;
        }
        return false;
    }

    const checkValidMove = (position) => {
        if (!board[position]) {
            return true
        } else return false;
    }

    const checkForWinner = (symbol, position) => {
        if (checkRow(symbol, position) || checkCol(symbol, position) || checkDiag(symbol, position)) {
            winner = symbol;
        }
    }

    const getWinner = () => {
        return winner;
    }
    /*******CODE TO CHECK FOR WINNING ROWS*********/
    const checkRow = (symbol, position) => {
        rowVar = Math.trunc(position / 3);
        for (i = rowVar * 3; i <= (rowVar * 3) + 2; i++) {
            if (board[i] != symbol) {
                return false;
            }
        }
        return true;
    }

    const checkCol = (symbol, position) => {
        colVar = position % 3;
        for (i = colVar; i <= colVar + 6; i = (i + 3)) {
            if (board[i] != symbol) {
                return false;
            }
        }
        return true;
    }

    const checkDiag = (symbol, position) => {
        if ('246'.includes(position)) {
            if ([board[2], board[4], board[6]].every(v => v === board[2])) return true;;
        }
        if ('048'.includes(position)) {
            if ([board[0], board[4], board[8]].every(v => v === board[0])) return true;;
        }
        return false;
    }
    /******************************************** */
    const hasSomeoneWon = () => {
        if (winner) return true;
        return false;
    }

    const isDraw = () => {
        if (!winner && movesMade === 9) return true;
        return false;
    }

    const printBoard = () => {
        let boardString = '';
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                if (board[(i * 3) + j] != undefined) {
                    boardString += (board[(i * 3) + j])
                } else {
                    boardString += '_';
                }
                if (j != 2) {
                    boardString += ' | '
                } else {
                    boardString += '\n'
                }
            }
        }
        boardString += '\n'
        return boardString;
    }

    const getBoard = () => {
        return board.slice();
    }

    return { clearBoard, makeMove, checkValidMove, printBoard, getWinner, hasSomeoneWon, isDraw, getBoard };
})();

/*************  
    GameLogic
    The GameLogic object handles player input, communicates with the GameBoard, and updates the screen
**************/
const GameLogic = (() => {

    //VARIABLES TO HANDLE AN AI PLAYER
    let computerAI = false;
    const aiSwitch = document.getElementById('aiSwitch');
    const aiText = document.getElementById('aiText');
    aiSwitch.onclick = () => {
        computerAI = !computerAI;
        if(computerAI === true) {
            aiText.style.color = '#2196F3';
        } else {
            aiText.style.color = 'darkgray';
        }
        if(currentPlayer.getName() === 'P2') makeComputerMove();
    }

    /******VARIABLES FOR PLAYER OBJECTS******/
    let tempPlayer;
    let currentPlayer = PlayerFactory('P1', 'X');
    let nextPlayer = PlayerFactory('P2', 'O');


    //******VARIABLES FOR USER INPUT******/
    const cellContainer = document.getElementById('cellContainer');
    const resetButton = document.getElementById('resetButton');
    const cells = document.querySelectorAll('.cell');
    const gameOverDialog = document.getElementById('gameOver');

    cellContainer.addEventListener('click', (event) => {
        takeInput(event);
    });
    resetButton.addEventListener('click', (event) => {
        resetGame();
    });

    //******CODE TO HANDLE USER INPUT******/
    function takeInput(event) {
        if (GameBoard.makeMove(currentPlayer.getSymbol(), event.target.dataset.id)) {
            event.target.textContent = currentPlayer.getSymbol();
            nextPlayerTurn();
            if (checkGameOver()) {
                return;
            }
            if (computerAI && currentPlayer.getName() === 'P2') makeComputerMove();
        }
    }

    //AFTER A TURN IS TAKEN SWAP THE CURRENT/NEXT PLAYERS
    const nextPlayerTurn = () => {
        tempPlayer = currentPlayer;
        currentPlayer = nextPlayer;
        nextPlayer = tempPlayer;
    }

    /**********LOGIC FOR RANDOM COMPUTER PLAYER******* */
    const makeComputerMove = () => {
        const tempBoard = GameBoard.getBoard();
        while (true) {
            const move = Math.floor(Math.random() * 9);
            if (GameBoard.makeMove(currentPlayer.getSymbol(), move)) {
                cellContainer.querySelector(`[data-id='${move}']`).textContent = currentPlayer.getSymbol();
                nextPlayerTurn();
                checkGameOver();
                return;
            }
        }
    }

    //CHECK FOR A WINNER OR DRAW
    const checkGameOver = () => {
        if (GameBoard.getWinner()) {
            gameIsFinished(`${GameBoard.getWinner()} WINS THE GAME!!`);
            return true;
        }
        if (GameBoard.isDraw()) {
            gameIsFinished(`IT'S A DRAW!!`);
            return true;
        }
        return false;
    }

    //WHEN THE RESET BUTTON IS PRESSED
    const resetGame = () => {
        GameBoard.clearBoard();
        clearUIBoard();
        gameOverDialog.textContent = ``
        gameOverDialog.style.display = 'none';
        tempPlayer = undefined;
        currentPlayer = PlayerFactory('P1', 'X');
        nextPlayer = PlayerFactory('P2', 'O');
        console.log(computerAI);
    }

    //RESET THE HTML UI
    const clearUIBoard = () => {
        for (i = 0; i < cells.length; i++) {
            cells[i].textContent = '';
        }
    }

    //DISPLAY A MESSAGE WHEN THE GAME IS OVER
    const gameIsFinished = (m) => {
        gameOver.textContent = m;
        gameOver.style.display = 'block';
    }

})();



