class ChessboardPuzzle {
    constructor() {
        this.boardSize = 8;
        this.currentBoard = 1;
        this.selectedSquare = null;
        this.dominoes = [];
        
        this.boards = {
            1: { blocked: [[1, 1], [2, 1]], maxDominoes: 31 },
            2: { blocked: [[4, 4], [6, 6]], maxDominoes: 31 },
            3: { blocked: [[1, 1], [2, 2], [4,5], [5,4]], maxDominoes: 30 },
            4: { blocked: [[1, 1], [8, 8]], maxDominoes: 31 },
            5: { blocked: [[4, 4], [5, 5]], maxDominoes: 31 }
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

                if ((row + col) % 2 === 0) {
                    square.classList.add('white');
                } else {
                    square.classList.add('black');
                }

                const isBlocked = blocked.some(([r, c]) => r - 1 === row && c - 1 === col);
                if (isBlocked) {
                    square.classList.add('blocked');
                }

                gameBoard.appendChild(square);
            }
        }

        this.dominoes.forEach((domino, index) => {
            this.renderDomino(domino, index);
        });
    }

    renderDomino(domino, index) {
        const gameBoard = document.getElementById('gameBoard');

        const firstSquare = gameBoard.querySelector('.square');
        if (!firstSquare) return;
        const squareSize = firstSquare.offsetWidth; // This is 52px (50px + 2px borders)

        const styles = getComputedStyle(gameBoard);
        const padLeft = parseFloat(styles.paddingLeft) || 0;
        const padTop = parseFloat(styles.paddingTop) || 0;

        // Adjust positioning - grid has overlapping borders between squares
        const effectiveSize = squareSize - 2; // 50px effective spacing
        const top = padTop + domino.row * effectiveSize;
        const left = padLeft + domino.col * effectiveSize;

        const div = document.createElement('div');
        div.className = `domino ${domino.orientation}`;
        div.dataset.index = index;
        div.style.position = 'absolute';
        div.style.top = `${top}px`;
        div.style.left = `${left}px`;
        // Dominoes sized to fit exactly within squares
        div.style.width = domino.orientation === 'horizontal' ? `${effectiveSize * 2}px` : `${effectiveSize}px`;
        div.style.height = domino.orientation === 'vertical' ? `${effectiveSize * 2}px` : `${effectiveSize}px`;
        div.style.zIndex = '10';

        div.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeDomino(index);
        });

        gameBoard.appendChild(div);

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

        if (this.selectedSquare === null) {
            this.selectedSquare = { row, col };
            square.classList.add('selected');
        } else {
            const firstRow = this.selectedSquare.row;
            const firstCol = this.selectedSquare.col;

            if (this.areAdjacent(firstRow, firstCol, row, col)) {
                const orientation = (firstRow === row) ? 'horizontal' : 'vertical';
                const startRow = Math.min(firstRow, row);
                const startCol = Math.min(firstCol, col);
                this.placeDomino(startRow, startCol, orientation);
            }

            document.querySelectorAll('.square.selected').forEach(s => s.classList.remove('selected'));
            this.selectedSquare = null;
        }
    }

    areAdjacent(row1, col1, row2, col2) {
        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
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
        this.selectedSquare = null;
        
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
        this.selectedSquare = null;
        document.querySelectorAll('.square.selected').forEach(s => s.classList.remove('selected'));
        this.renderBoard();
        this.updateTileCounter();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.puzzle = new ChessboardPuzzle();
    console.log('¡Mutilated Chessboard Puzzle cargado!');
});
