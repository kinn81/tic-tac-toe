console.log = function() {};

const PlayerFactory = (n, s) => {
    let name = n;
    let symbol = s;

    const getName = () => {
        return name;
    };

    const getSymbol = () => {
        return symbol;
    };

    return { getName, getSymbol };
};



/*************
    GameBoard
    The GameBoard object holds an array representing the current state of the game
    It exposes methods to clearBoard, makeMove, checkValidMove, printBoard, and checkForWinner 
**************/
const GameBoard = (() => {
    let board = Array.apply(null, Array(9)).map(function () { });
    let movesMade = 0;
    let winner = undefined;
    let lastMove;

    const reverseMove = () => {
        board[lastMove] = null;
        movesMade--;
        winner = undefined;
    }

    const clearBoard = () => {
        board = Array.apply(null, Array(9)).map(function () { });
        winner = undefined;
        movesMade = 0;
    };

    const makeMove = (symbol, position) => {
        if (winner) return;
        if (checkValidMove(position)) {
            board[position] = symbol;
            movesMade++;
            lastMove = position;
            checkForWinner(symbol, position);
            return true;
        };
        return false;
    };

    const getNumMoves = () => {
        return moves;
    }

    const checkValidMove = (position) => {
        if (!board[position]) {
            return true
        } else return false;
    };

    const checkForWinner = (symbol, position) => {
        if (checkRow(symbol, position) || checkCol(symbol, position) || checkDiag(symbol, position)) {
            winner = symbol;
        };
    };

    const getWinner = () => {
        return winner;
    };
    /*******CODE TO CHECK FOR WINNING ROWS*********/
    const checkRow = (symbol, position) => {
        rowVar = Math.trunc(position / 3);
        for (i = rowVar * 3; i <= (rowVar * 3) + 2; i++) {
            if (board[i] != symbol) {
                return false;
            };
        };
        return true;
    };

    const checkCol = (symbol, position) => {
        colVar = position % 3;
        for (let i = colVar; i <= colVar + 6; i = (i + 3)) {
            if (board[i] != symbol) {
                return false;
            };
        };
        return true;
    };

    const checkDiag = (symbol, position) => {
        if ('246'.includes(position)) {
            if ([board[2], board[4], board[6]].every(v => v == board[2])) return true;
        };
        if ('048'.includes(position)) {
            if ([board[0], board[4], board[8]].every(v => v == board[0])) return true;
        };
        return false;
    };
    /******************************************** */
    const hasSomeoneWon = () => {
        if (winner) return true;
        return false;
    };

    const isDraw = () => {
        if (!winner && movesMade == 9) return true;
        return false;
    };

    const printBoard = () => {
        let boardString = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[(i * 3) + j] != undefined) {
                    boardString += (board[(i * 3) + j])
                } else {
                    boardString += '_';
                };
                if (j != 2) {
                    boardString += ' | '
                } else {
                    boardString += '\n'
                };
            };
        };
        boardString += '\n';
        console.log(boardString);
    };

    const getBoard = () => {
        return board.slice();
    };

    const getAvailableSpaces = () => {
        let spaces = [];
        for (i = 0; i < board.length; i++) {
            if (board[i] == undefined) spaces.push(i);
        }
        return spaces;
    }

    return { clearBoard, makeMove, checkValidMove, printBoard, getWinner, hasSomeoneWon, isDraw, getBoard, getNumMoves, reverseMove, getAvailableSpaces };
})();

/*************  
    GameLogic
    The GameLogic object handles player input, communicates with the GameBoard, and updates the screen
**************/
const GameLogic = (() => {

    //VARIABLES TO HANDLE AN AI PLAYER
    const aiSwitch = document.getElementById('aiSwitch');
    let computerAI = aiSwitch.checked;
    const aiText = document.getElementById('aiText');
    aiSwitch.onclick = () => {
        computerAI = aiSwitch.checked;
        if (computerAI) {
            aiText.style.color = '#2196F3';
        } else {
            aiText.style.color = 'darkgray';
        };
        if (currentPlayer.getName() == 'P2' && (!GameBoard.getWinner() && !GameBoard.isDraw())) makeAIMove();
    };

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
            };
            //if (computerAI && currentPlayer.getName() == 'P2') makeComputerMoveRandom();
            if (computerAI && currentPlayer.getName() == 'P2') makeAIMove();
        };
    };

    //AFTER A TURN IS TAKEN SWAP THE CURRENT/NEXT PLAYERS
    const nextPlayerTurn = () => {
        tempPlayer = currentPlayer;
        currentPlayer = nextPlayer;
        nextPlayer = tempPlayer;
    };

    /**********LOGIC FOR RANDOM COMPUTER MOVE******* */
    const makeComputerMoveRandom = () => {
        const tempBoard = GameBoard.getBoard();
        while (true) {
            const move = Math.floor(Math.random() * 9);
            if (GameBoard.makeMove(currentPlayer.getSymbol(), move)) {
                cellContainer.querySelector(`[data-id='${move}']`).textContent = currentPlayer.getSymbol();
                nextPlayerTurn();
                checkGameOver();
                return;
            };
        };
    };

    /**********LOGIC FOR MINIMAX DETERMINED COMPUTER PLAYER******* */
    const makeAIMove = () => {
        let bestScore = -1;
        let bestMove;
        let availableMoves = GameBoard.getAvailableSpaces();

        console.log('Number of available moves: ' + availableMoves.length);
        for (let i = 0; i < availableMoves.length; i++) {

            let newState = GameBoard.getBoard();
            newState[availableMoves[i]] = 'O';

            console.log();
            console.log();
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>Loop ' + i + ', move: ' + availableMoves[i] + ', bestScore: ' + bestScore + ', bestMove: ' + bestMove);
            let score = miniMax(newState, false, 0);

            console.log('RETURN ********* i: ' + i + ', ' + 'move: ' + availableMoves[i] + ',score: ' + score);;

            if (score > bestScore) {
                bestScore = score;
                bestMove = availableMoves[i];
            }
            newState[availableMoves[i]] = undefined;
            //console.log('**************')
        }

        console.log('*********Tested all moves*********')
        console.log('bestMove: ' + bestMove);

        GameBoard.makeMove(currentPlayer.getSymbol(), bestMove);
        cellContainer.querySelector(`[data-id='${bestMove}']`).textContent = currentPlayer.getSymbol();
        nextPlayerTurn();
        checkGameOver();
    };

    const miniMax = (board, isMax, level) => {
        /*
        console.log();
        console.log('**** miniMx debug *****')
        console.log('isMax: ' + isMax);
        console.log('board: ' + board);
        */

        console.log('*********************');
        console.log('Inside miniMax level ' + level);
        console.log(board);
        if (checkArrWinner(board) == 'O') {
            console.log('O is the winner');
            return 1; //O is the maximising player
        }

        if (checkArrWinner(board) == 'X') {
            console.log('X is the winner');
            return -1; //X is the minimising player
        }
        if (checkArrDraw(board)) return 0

        let player = isMax ? 'O' : 'X';
        let value;

        if (isMax) {
            console.log('in MAX....');
            console.log('Player: ' + player);
            let value = -1;
            for (let i = 0; i < board.length; i++) {
                if (board[i] == undefined) {
                    console.log('Setting position ' + i + " to " + player)
                    board[i] = player;
                    let tempVal = miniMax(board.slice(), false, level + 1);
                    board[i] = undefined;
                    console.log('Back in MAX level ' + level + ', Returned Value: ' + tempVal + ', previous value: ' + value + ', loop value ' + i);
                    console.log(board);
                    if (value < tempVal) {
                        console.log('Stored value is LESS than the returned value. Settomg Stored = returned');
                        value = tempVal;
                    }
                    
                }
            }
            console.log('returning from level: ' + level + ', value: ' + value);
            console.log('*********************');
            return value;
        } else {
            console.log('in MIN...');
            console.log('Player: ' + player);
            let value = 1;
            for (let i = 0; i < board.length; i++) {
                if (board[i] == undefined) {
                    console.log('Setting position ' + i + " to " + player)
                    board[i] = player;
                    let tempVal = miniMax(board.slice(), true, level + 1);
                    board[i] = undefined;
                    console.log('Back in MIN level ' + level + ', Returned Value: ' + tempVal + ', previous value: ' + value + ', loop value ' + i);
                    console.log(board);
                    if (value > tempVal) {
                        console.log('Stored value is GREATER than the returned value. Setting Stored = returned');
                        value = tempVal;
                    }
                    
                }
            }
            console.log('returning from level: ' + level + ', value: ' + value);
            console.log('*********************');
            return value;
        }
    };

    const checkArrDraw = (board) => {
        let result = board.every(e => e != undefined);
        console.log('IsDraw = ' + result);
        return result;

    }
    const checkArrWinner = (board) => {
        if (board[0] == board[1] && board[1] == board[2]) return board[0];
        if (board[3] == board[4] && board[4] == board[5]) return board[3];
        if (board[6] == board[7] && board[7] == board[8]) return board[6];

        if (board[0] == board[3] && board[3] == board[6]) return board[0];
        if (board[1] == board[4] && board[4] == board[7]) return board[1];
        if (board[2] == board[5] && board[5] == board[8]) return board[2];

        if (board[0] == board[4] && board[4] == board[8]) return board[0];
        if (board[2] == board[4] && board[4] == board[6]) return board[2];
    }

    //CHECK FOR A WINNER OR DRAW
    const checkGameOver = () => {
        if (GameBoard.getWinner()) {
            gameIsFinished(`${GameBoard.getWinner()} WINS THE GAME!!`);
            return true;
        };
        if (GameBoard.isDraw()) {
            gameIsFinished(`IT'S A DRAW!!`);
            return true;
        };
        return false;
    };

    //WHEN THE RESET BUTTON IS PRESSED
    const resetGame = () => {
        GameBoard.clearBoard();
        clearUIBoard();
        gameOverDialog.textContent = ``;
        gameOverDialog.style.display = 'none';
        tempPlayer = undefined;
        currentPlayer = PlayerFactory('P1', 'X');
        nextPlayer = PlayerFactory('P2', 'O');
    };

    //RESET THE HTML UI
    const clearUIBoard = () => {
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = '';
        };
    };

    //DISPLAY A MESSAGE WHEN THE GAME IS OVER
    const gameIsFinished = (m) => {
        gameOver.textContent = m;
        gameOver.style.display = 'block';
    };

})();



