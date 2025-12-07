class FifteenPuzzle {
    constructor() {
        this.size = 4;
        this.tiles = [];
        this.emptyPos = { row: 3, col: 3 };
        this.moves = 0;
        this.isShuffled = false;
        this.timer = 0;
        this.timerInterval = null;

        this.initializeBoard();
        this.renderBoard();
        this.setupEventListeners();
    }

    initializeBoard() {
        // Create solved board: 1-15 with empty space at bottom right
        this.tiles = [];
        let num = 1;
        for (let row = 0; row < this.size; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < this.size; col++) {
                if (row === this.size - 1 && col === this.size - 1) {
                    this.tiles[row][col] = 0; // Empty space
                } else {
                    this.tiles[row][col] = num++;
                }
            }
        }
        this.emptyPos = { row: this.size - 1, col: this.size - 1 };
    }

    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.row = row;
                tile.dataset.col = col;

                const value = this.tiles[row][col];

                if (value === 0) {
                    tile.classList.add('empty');
                } else {
                    tile.textContent = value;

                    // Check if this tile can move
                    if (this.canMove(row, col)) {
                        tile.classList.add('movable');
                    }
                }

                gameBoard.appendChild(tile);
            }
        }

        this.updateMoveCounter();
        this.checkWin();
    }

    setupEventListeners() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.addEventListener('click', (e) => this.handleTileClick(e));
        gameBoard.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleTileClick(e);
        });

        document.getElementById('shuffleBtn').addEventListener('click', () => this.shuffle());
        document.getElementById('solveBtn').addEventListener('click', () => this.showSolution());
    }

    handleTileClick(event) {
        const tile = event.target.closest('.tile');
        if (!tile || tile.classList.contains('empty')) return;

        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);

        if (this.canMove(row, col)) {
            this.moveTile(row, col);
        }
    }

    canMove(row, col) {
        // Check if tile is adjacent to empty space
        const rowDiff = Math.abs(row - this.emptyPos.row);
        const colDiff = Math.abs(col - this.emptyPos.col);

        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    moveTile(row, col) {
        if (!this.canMove(row, col)) return;

        // Start timer on first move
        if (this.moves === 0 && this.isShuffled) {
            this.startTimer();
        }

        // Swap tile with empty space
        this.tiles[this.emptyPos.row][this.emptyPos.col] = this.tiles[row][col];
        this.tiles[row][col] = 0;
        this.emptyPos = { row, col };

        this.moves++;
        this.renderBoard();
    }

    shuffle() {
        this.initializeBoard();
        this.moves = 0;
        this.isShuffled = false;
        this.stopTimer();

        // Perform random valid moves to ensure solvability
        const numShuffles = 100 + Math.floor(Math.random() * 100);

        for (let i = 0; i < numShuffles; i++) {
            const movableTiles = this.getMovableTiles();
            const randomTile = movableTiles[Math.floor(Math.random() * movableTiles.length)];
            this.tiles[this.emptyPos.row][this.emptyPos.col] = this.tiles[randomTile.row][randomTile.col];
            this.tiles[randomTile.row][randomTile.col] = 0;
            this.emptyPos = { row: randomTile.row, col: randomTile.col };
        }

        this.moves = 0;
        this.isShuffled = true;
        this.renderBoard();
    }

    getMovableTiles() {
        const movable = [];
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        for (const [dRow, dCol] of directions) {
            const newRow = this.emptyPos.row + dRow;
            const newCol = this.emptyPos.col + dCol;

            if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size) {
                movable.push({ row: newRow, col: newCol });
            }
        }

        return movable;
    }

    isSolved() {
        let expected = 1;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (row === this.size - 1 && col === this.size - 1) {
                    return this.tiles[row][col] === 0;
                }
                if (this.tiles[row][col] !== expected) {
                    return false;
                }
                expected++;
            }
        }
        return true;
    }

    checkWin() {
        if (this.isSolved() && this.isShuffled) {
            this.stopTimer();
            setTimeout(() => {
                const minutes = Math.floor(this.timer / 60);
                const seconds = this.timer % 60;
                alert(`🎉 ¡Felicidades! 🎉\n\n¡Has resuelto el puzzle!\n\nMovimientos: ${this.moves}\nTiempo: ${minutes}:${seconds.toString().padStart(2, '0')}`);
            }, 300);
        }
    }

    updateMoveCounter() {
        document.getElementById('moveCounter').textContent = `Movimientos: ${this.moves}`;
    }

    startTimer() {
        this.timer = 0;
        this.updateTimer();
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        document.getElementById('timer').textContent = `Tiempo: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    showSolution() {
        alert('💡 Consejos para resolver el puzzle:\n\n' +
              '1. Resuelve las primeras dos filas primero\n' +
              '2. Luego trabaja en las dos primeras columnas\n' +
              '3. Finalmente, resuelve el cuadrado 2x2 restante\n' +
              '4. Practica moviendo grupos de fichas en lugar de una a la vez\n\n' +
              '¡La práctica hace al maestro!');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.puzzle = new FifteenPuzzle();
    console.log('¡15-Puzzle cargado!');
});
