const gameBoard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const resetBoard = () => board.fill("");

    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };
    return { getBoard, resetBoard, placeMarker };
})();

const createPlayer = (name, marker) => {
    return { name, marker };
};

const gameController = (function () {
    let players = [createPlayer("player_X", "X"), createPlayer("player_O", "O")];
    let currentPlayerIndex = 0;
    let isGameOver = false;

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const checkWinner = () => {
        const board = gameBoard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return board.includes("") ? null : "tie";
    };

    const playTurn = (index) => {
        if (isGameOver) return;

        let currentPlayer = players[currentPlayerIndex];

        if (gameBoard.placeMarker(index, currentPlayer.marker)) {
            let winner = checkWinner();

            if (winner) {
                displayController.displayMessage(
                    winner === "tie" ? "It's a tie!" : `${currentPlayer.name} wins!`
                );
                isGameOver = true;
            } else {
                switchPlayer();
                displayController.displayMessage(`${players[currentPlayerIndex].name}'s turn`);
            }

            displayController.renderBoard();
        }
    };

    const restartGame = () => {
        gameBoard.resetBoard();
        currentPlayerIndex = 0;
        isGameOver = false;
        displayController.displayMessage("Player X's Turn");
        displayController.renderBoard();
    };

    return { playTurn, restartGame };
})();

const displayController = (function () {
    const cells = document.querySelectorAll(".cell");
    const messageElement = document.querySelector(".message");
    const restartButton = document.querySelector(".restart");

    const renderBoard = () => {
        const board = gameBoard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const displayMessage = (message) => {
        messageElement.textContent = message;
    };

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            let index = parseInt(cell.dataset.index);
            gameController.playTurn(index);
        });
    });

    restartButton.addEventListener("click", gameController.restartGame);

    return { renderBoard, displayMessage };
})();

displayController.renderBoard();
