class FifteenPuzzle {
    constructor() {
        this.mode = 15; // 15 or 8
        this.size = 4;
        this.tiles = [];
        this.emptyPos = { row: 3, col: 3 };
        this.moves = 0;
        this.isShuffled = false;

        this.initializeBoard();
        this.renderBoard();
        this.setupEventListeners();
    }

    initializeBoard() {
        // Create solved board based on mode
        this.size = this.mode === 8 ? 3 : 4;
        this.tiles = [];
        let num = 1;
        const maxNum = this.mode === 8 ? 8 : 15;
        
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
        
        // Calculate tile size based on screen width and board size
        let tileSize = 100; // Desktop default
        const windowWidth = window.innerWidth;
        
        if (windowWidth <= 480) {
            // Mobile: maximize tile size for the available space
            const availableWidth = windowWidth - 14; // Minimal margins (5px padding + 4px on each side)
            tileSize = Math.floor((availableWidth - (this.size - 1) * 2) / this.size); // Account for gaps
            tileSize = Math.max(tileSize, 40); // Minimum tile size
        } else if (windowWidth <= 768) {
            // Tablet
            const availableWidth = Math.min(windowWidth - 24, 360);
            tileSize = Math.floor((availableWidth - (this.size - 1) * 3) / this.size);
            tileSize = Math.max(tileSize, 55);
        }
        
        // Set grid size based on mode
        gameBoard.style.gridTemplateColumns = `repeat(${this.size}, ${tileSize}px)`;
        gameBoard.style.gridTemplateRows = `repeat(${this.size}, ${tileSize}px)`;
        gameBoard.style.setProperty('--tile-size', `${tileSize}px`);

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
        document.getElementById('impossibleBtn').addEventListener('click', () => this.setImpossible());
        document.getElementById('modeToggle').addEventListener('click', () => this.toggleMode());
    }

    toggleMode() {
        this.mode = this.mode === 15 ? 8 : 15;
        document.getElementById('modeToggle').textContent = `Modo: ${this.mode}`;
        document.getElementById('impossibleBtn').textContent = this.mode === 8 ? '7-8' : '14-15';
        this.moves = 0;
        this.isShuffled = false;
        this.initializeBoard();
        this.renderBoard();
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
            setTimeout(() => {
                alert(`🎉 ¡Felicidades! 🎉\n\n¡Has resuelto el puzzle!\n\nMovimientos: ${this.moves}`);
            }, 300);
        }
    }

    updateMoveCounter() {
        document.getElementById('moveCounter').textContent = `Movimientos: ${this.moves}`;
    }

    setImpossible() {
        // Set up the classic impossible configuration with last two tiles swapped
        this.initializeBoard();
        this.moves = 0;
        this.isShuffled = false;

        const maxNum = this.mode === 8 ? 8 : 15;
        const secondLast = maxNum - 1;

        // Create the impossible configuration: all tiles in order except last two are swapped
        let num = 1;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (row === this.size - 1 && col === this.size - 1) {
                    this.tiles[row][col] = 0; // Empty space
                } else if (row === this.size - 1 && col === this.size - 3) {
                    this.tiles[row][col] = maxNum; // Swap: put last number here
                } else if (row === this.size - 1 && col === this.size - 2) {
                    this.tiles[row][col] = secondLast; // Swap: put second-to-last number here
                } else {
                    this.tiles[row][col] = num++;
                }
            }
        }

        this.emptyPos = { row: this.size - 1, col: this.size - 1 };
        this.moves = 0;
        this.isShuffled = true;
        this.renderBoard();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.puzzle = new FifteenPuzzle();
    console.log('¡15-Puzzle cargado!');
});
