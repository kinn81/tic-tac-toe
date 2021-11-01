const GameBoard = (() => {
    let board = Array.apply(null, Array(8)).map(function () {})
    const clearBoard = () => {
        a = []
    }

    const makeMove = (marker, position) => {
        if(checkValidMove(position)) {
            board[position] = marker;
        }
    }
    
    const checkValidMove = (position) => {
        if (!board[position]) {
            return true
        } else return false;
    }

    const checkForWinner = () => {
    }

    const printBoard = () => {
        console.log('Board length: ' + board.length)
        for (i = 0; i < board.length; i++) {
            console.log(board[i]);
        }
    }

    return {clearBoard, makeMove, printBoard};
})();

const GameLogic = () => {


}

const DisplayController = () => {


}

const PlayerFactory = (name, marker) => {
    
}

