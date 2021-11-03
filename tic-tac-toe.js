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
    return {getName, getSymbol, introduceSelf}
}



const GameBoard = (() => {
    let board = Array.apply(null, Array(8)).map(function () { })

    const clearBoard = () => {
        board = Array.apply(null, Array(8)).map(function () { })
    }

    const makeMove = (marker, position) => {
        if (checkValidMove(position)) {
            board[position] = marker;
            console.log(printBoard());
            return true;
        }
        return false;
    }

    const checkValidMove = (position) => {
        if (!board[position]) {
            return true
        } else return false;
    }

    const checkForWinner = () => {
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

    return { clearBoard, makeMove, checkValidMove, printBoard };
})();

const GameLogic = (() => {
    //Variables to hold player objects
    let player1 = PlayerFactory('P1', 'X');
    let player2 = PlayerFactory('P2', 'O');
    let currentPlayer = player1;

    //Variables for user input
    const cellContainer = document.querySelector('#cellContainer');
    cellContainer.addEventListener('click', (event) => {
        takeInput(event);
    });

    //****CODE TO HANDLE USER INPUT******/
    function takeInput(event) {
        

        event.target.textContent = currentPlayer.getSymbol();

    }

    /*
    initialise game
        clear  board
        create player1 object
        create player2 object

    when player makes move
        exec Gameboard.makeMove         //make the move
        if response = true
            exec DisplayController          //update the screen
            exec Gameboard.checkForWinner   //check if someone has won
                if someone has won
                    display winning message
                    reset the game

    */
})();



