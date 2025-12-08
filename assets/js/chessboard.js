class ChessboardPuzzle {
    constructor() {
        this.boardSize = 8;
        this.currentBoard = 1;
        this.orientation = 'horizontal'; // 'horizontal' or 'vertical'
        this.dominoes = []; // Array of placed dominoes
        
        // Board configurations - 1-indexed for display, will convert to 0-indexed internally
        this.boards = {
            1: { blocked: [[1, 1], [8, 8]], maxDominoes: 31 }, // Opposite corners - SOLVABLE
            2: { blocked: [[1, 1], [1, 2]], maxDominoes: 31 }, // Adjacent corners - SOLVABLE
            3: { blocked: [[4, 4], [5, 5]], maxDominoes: 31 }, // Center diagonal - SOLVABLE
            4: { blocked: [[1, 1], [2, 1]], maxDominoes: 31 }  // Same color corners - IMPOSSIBLE
        };

        this.initializeBoard();
        this.setupEventListeners();
    }

    initializeBoard() {
        this.renderBoard();
        this.updateTileCounter();
    }

    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        const blocked = this.boards[this.currentBoard].blocked;

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.dataset.row = row;
                square.dataset.col = col;

                // Chess coloring
                if ((row + col) % 2 === 0) {
                    square.classList.add('white');
                } else {
                    square.classList.add('black');
                }

                // Check if blocked (convert from 1-indexed to 0-indexed)
                const isBlocked = blocked.some(([r, c]) => r - 1 === row && c - 1 === col);
                if (isBlocked) {
                    square.classList.add('blocked');
                }

                gameBoard.appendChild(square);
            }
        }

        // Render existing dominoes
        this.dominoes.forEach((domino, index) => {
            this.renderDomino(domino, index);
        });
    }

    renderDomino(domino, index) {
        const gameBoard = document.getElementById('gameBoard');
        const div = document.createElement('div');
        div.className = `domino ${domino.orientation}`;
        div.dataset.index = index;

        const squareSize = gameBoard.querySelector('.square').offsetWidth;
        const row = domino.row;
        const col = domino.col;

        div.style.left = `${col * squareSize + 10}px`;
        div.style.top = `${row * squareSize + 10}px`;

        div.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeDomino(index);
        });

        gameBoard.appendChild(div);

        // Mark squares as covered
        const squares = this.getDominoSquares(domino);
        squares.forEach(([r, c]) => {
            const square = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            if (square) square.classList.add('covered');
        });
    }

    setupEventListeners() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.addEventListener('click', (e) => this.handleSquareClick(e));

        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('orientationBtn').addEventListener('click', () => this.toggleOrientation());

        document.querySelectorAll('.board-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchBoard(parseInt(e.target.dataset.board)));
        });
    }

    handleSquareClick(event) {
        const square = event.target.closest('.square');
        if (!square || square.classList.contains('blocked') || square.classList.contains('covered')) {
            return;
        }

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (this.canPlaceDomino(row, col, this.orientation)) {
            this.placeDomino(row, col, this.orientation);
        }
    }

    canPlaceDomino(row, col, orientation) {
        if (orientation === 'horizontal') {
            if (col + 1 >= this.boardSize) return false;
            return !this.isSquareOccupied(row, col) && !this.isSquareOccupied(row, col + 1);
        } else {
            if (row + 1 >= this.boardSize) return false;
            return !this.isSquareOccupied(row, col) && !this.isSquareOccupied(row + 1, col);
        }
    }

    isSquareOccupied(row, col) {
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        return square && (square.classList.contains('blocked') || square.classList.contains('covered'));
    }

    placeDomino(row, col, orientation) {
        this.dominoes.push({ row, col, orientation });
        this.renderBoard();
        this.updateTileCounter();
        this.checkWin();
    }

    getDominoSquares(domino) {
        const squares = [[domino.row, domino.col]];
        if (domino.orientation === 'horizontal') {
            squares.push([domino.row, domino.col + 1]);
        } else {
            squares.push([domino.row + 1, domino.col]);
        }
        return squares;
    }

    removeDomino(index) {
        this.dominoes.splice(index, 1);
        this.renderBoard();
        this.updateTileCounter();
    }

    toggleOrientation() {
        this.orientation = this.orientation === 'horizontal' ? 'vertical' : 'horizontal';
        const btn = document.getElementById('orientationBtn');
        btn.textContent = `Rotar: ${this.orientation === 'horizontal' ? '⬌' : '⬍'}`;
    }

    updateTileCounter() {
        const max = this.boards[this.currentBoard].maxDominoes;
        document.getElementById('tileCounter').textContent = `Fichas: ${this.dominoes.length}/${max}`;
    }

    checkWin() {
        const max = this.boards[this.currentBoard].maxDominoes;
        if (this.dominoes.length === max) {
            setTimeout(() => {
                alert(`🎉 ¡Felicidades! 🎉\n\n¡Has completado el tablero ${this.currentBoard}!\n\nColocaste ${this.dominoes.length} fichas de dominó.`);
            }, 300);
        }
    }

    switchBoard(boardNum) {
        this.currentBoard = boardNum;
        this.dominoes = [];
        
        // Update button states
        document.querySelectorAll('.board-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.board) === boardNum) {
                btn.classList.add('active');
            }
        });

        this.renderBoard();
        this.updateTileCounter();
    }

    reset() {
        this.dominoes = [];
        this.renderBoard();
        this.updateTileCounter();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.puzzle = new ChessboardPuzzle();
    console.log('¡Mutilated Chessboard Puzzle cargado!');
});
