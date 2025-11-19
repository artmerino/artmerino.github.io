class ConwaysSoldierGame {
    constructor() {
        this.boardWidth = 15;
        this.boardHeight = 14; // Reduced from 20 to 14
        this.shorelineRow = 6; // Row 6 is the shoreline (0-indexed) - 6 rows above
        this.board = [];
        this.initialSetup = []; // Store the initial setup for reset
        this.selectedCell = null;
        this.bestHeight = 0;
        this.gameMode = 'setup'; // 'setup' or 'playing'
        
        this.initializeBoard();
        this.renderBoard();
        this.setupEventListeners();
    }
    
    initializeBoard() {
        // Initialize empty board
        this.board = Array(this.boardHeight).fill(null).map(() => 
            Array(this.boardWidth).fill(false)
        );
        
        // Start in setup mode with empty board for custom placement
        this.gameMode = 'setup';
        this.updateGameModeUI();
    }
    
    setupInitialSoldiers() {
        // Place soldiers in a strategic initial configuration
        // This gives players a good starting position to try reaching row 4
        
        // Fill bottom rows more densely
        for (let row = this.shorelineRow + 1; row < this.boardHeight; row++) {
            for (let col = 2; col < this.boardWidth - 2; col++) {
                if (Math.random() < 0.8) { // 80% chance for denser packing
                    this.board[row][col] = true;
                }
            }
        }
        
        // Add some soldiers right at the shoreline
        for (let col = 4; col < this.boardWidth - 4; col++) {
            if (Math.random() < 0.6) {
                this.board[this.shorelineRow][col] = true;
            }
        }
        
        // Ensure we have a central cluster for good moves
        const centerCol = Math.floor(this.boardWidth / 2);
        this.board[this.shorelineRow + 1][centerCol] = true;
        this.board[this.shorelineRow + 1][centerCol - 1] = true;
        this.board[this.shorelineRow + 1][centerCol + 1] = true;
        this.board[this.shorelineRow + 2][centerCol] = true;
    }
    
    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        for (let row = 0; row < this.boardHeight; row++) {
            for (let col = 0; col < this.boardWidth; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add game mode class
                if (this.gameMode === 'setup') {
                    cell.classList.add('setup-mode');
                    // Mark invalid placement areas
                    if (row < this.shorelineRow) {
                        cell.classList.add('invalid-placement');
                    }
                } else {
                    cell.classList.add('playing-mode');
                }
                
                // Add special styling for different regions
                if (row === this.shorelineRow) {
                    cell.classList.add('shoreline');
                } else if (row > this.shorelineRow) {
                    cell.classList.add('water');
                }
                
                // Add height indicator for rows above shoreline
                if (row < this.shorelineRow && col === this.boardWidth - 1) {
                    const heightSpan = document.createElement('span');
                    heightSpan.className = 'height-indicator';
                    heightSpan.textContent = `+${this.shorelineRow - row}`;
                    cell.appendChild(heightSpan);
                }
                
                // Add soldier if present
                if (this.board[row][col]) {
                    const soldier = document.createElement('div');
                    soldier.className = 'soldier';
                    cell.appendChild(soldier);
                }
                
                gameBoard.appendChild(cell);
            }
        }
        
        this.updateBestHeight();
    }
    
    setupEventListeners() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.addEventListener('click', (e) => this.handleCellClick(e));
        
        document.getElementById('setupBtn').addEventListener('click', () => this.enterSetupMode());
        document.getElementById('playBtn').addEventListener('click', () => this.startPlaying());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }
    
    handleCellClick(event) {
        const cell = event.target.closest('.cell');
        if (!cell) return;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (this.gameMode === 'setup') {
            this.handleSetupClick(row, col);
        } else {
            this.handlePlayingClick(row, col);
        }
    }
    
    handleSetupClick(row, col) {
        // Only allow placement on or below the shoreline
        if (row < this.shorelineRow) {
            return; // Can't place soldiers above shoreline
        }
        
        // Toggle soldier at this position
        this.board[row][col] = !this.board[row][col];
        this.renderBoard();
        this.updateGameModeUI(); // Update UI after each placement
    }
    
    handlePlayingClick(row, col) {
        // Clear previous highlights
        document.querySelectorAll('.cell').forEach(c => {
            c.classList.remove('selected', 'valid-move');
        });
        
        // If clicking on a soldier, select it
        if (this.board[row][col]) {
            this.selectedCell = { row, col };
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add('selected');
            this.highlightValidMoves(row, col);
        } 
        // If we have a selected soldier and clicked on a valid move
        else if (this.selectedCell && this.isValidMove(this.selectedCell.row, this.selectedCell.col, row, col)) {
            this.makeMove(this.selectedCell.row, this.selectedCell.col, row, col);
            this.selectedCell = null;
        }
        // Otherwise, clear selection
        else {
            this.selectedCell = null;
        }
    }
    
    highlightValidMoves(fromRow, fromCol) {
        const directions = [
            [-2, 0], [2, 0], [0, -2], [0, 2] // Up, Down, Left, Right (2 squares away)
        ];
        
        directions.forEach(([dRow, dCol]) => {
            const toRow = fromRow + dRow;
            const toCol = fromCol + dCol;
            
            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                const targetCell = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
                if (targetCell) {
                    targetCell.classList.add('valid-move');
                }
            }
        });
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Check bounds
        if (toRow < 0 || toRow >= this.boardHeight || toCol < 0 || toCol >= this.boardWidth) {
            return false;
        }
        
        // Check if destination is empty
        if (this.board[toRow][toCol]) {
            return false;
        }
        
        // Check if it's exactly 2 squares away in a cardinal direction
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        
        if (!((Math.abs(rowDiff) === 2 && colDiff === 0) || (Math.abs(colDiff) === 2 && rowDiff === 0))) {
            return false;
        }
        
        // Check if there's a soldier to jump over
        const midRow = fromRow + rowDiff / 2;
        const midCol = fromCol + colDiff / 2;
        
        return this.board[midRow][midCol];
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        // Calculate middle position
        const midRow = fromRow + (toRow - fromRow) / 2;
        const midCol = fromCol + (toCol - fromCol) / 2;
        
        // Animate the jump
        const fromCell = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
        const soldier = fromCell.querySelector('.soldier');
        if (soldier) {
            soldier.classList.add('jumping');
            
            setTimeout(() => {
                // Move the soldier
                this.board[fromRow][fromCol] = false;
                this.board[midRow][midCol] = false; // Remove jumped soldier
                this.board[toRow][toCol] = true;
                
                // Re-render board
                this.renderBoard();
            }, 250);
        }
    }
    
    updateBestHeight() {
        let currentBest = 0;
        
        // Find the highest soldier above the shoreline
        for (let row = 0; row < this.shorelineRow; row++) {
            for (let col = 0; col < this.boardWidth; col++) {
                if (this.board[row][col]) {
                    const height = this.shorelineRow - row;
                    currentBest = Math.max(currentBest, height);
                }
            }
        }
        
        this.bestHeight = Math.max(this.bestHeight, currentBest);
        document.getElementById('bestHeight').textContent = `Mejor altura: ${this.bestHeight}`;
        
        // Celebrate if they reach row 4!
        if (currentBest === 4) {
            setTimeout(() => {
                alert('🎉 ¡Felicidades! Has alcanzado la fila 4 - ¡el máximo teórico! 🎉\n\nHas logrado el límite matemático del problema del soldado de Conway!');
            }, 500);
        }
    }
    
    resetGame() {
        this.selectedCell = null;
        
        // Restore the initial setup if we were playing
        if (this.gameMode === 'playing' && this.initialSetup.length > 0) {
            this.restoreInitialSetup();
            this.gameMode = 'playing'; // Stay in playing mode
        } else {
            // If we're in setup mode or no initial setup exists, go to empty setup
            this.gameMode = 'setup';
            this.initializeBoard();
        }
        
        this.updateGameModeUI();
        this.renderBoard();
    }
    
    enterSetupMode() {
        this.gameMode = 'setup';
        this.selectedCell = null;
        
        // Restore the initial setup if we have one
        if (this.initialSetup.length > 0) {
            this.restoreInitialSetup();
        }
        
        this.updateGameModeUI();
        this.renderBoard();
    }
    
    startPlaying() {
        if (!this.hasSoldiers()) {
            alert('¡Coloca algunos soldados primero!');
            return;
        }
        
        // Save the current setup as initial setup for reset functionality
        this.saveInitialSetup();
        
        this.gameMode = 'playing';
        this.selectedCell = null;
        this.updateGameModeUI();
        this.renderBoard();
    }
    
    updateGameModeUI() {
        const setupBtn = document.getElementById('setupBtn');
        const playBtn = document.getElementById('playBtn');
        const resetBtn = document.getElementById('resetBtn');
        const setupInstructions = document.getElementById('setupInstructions');
        
        // Remove active class from all buttons first
        setupBtn.classList.remove('button-active');
        playBtn.classList.remove('button-active');
        
        if (this.gameMode === 'setup') {
            setupBtn.disabled = true;
            setupBtn.classList.add('button-active'); // Highlight setup mode button
            resetBtn.disabled = true; // Gray out reset in setup mode
            playBtn.disabled = !this.hasSoldiers(); // Enable when there are soldiers
            setupInstructions.style.display = 'none'; // Hide setup instructions
        } else {
            setupBtn.disabled = false;
            resetBtn.disabled = false; // Enable reset in play mode
            playBtn.disabled = true;
            playBtn.classList.add('button-active'); // Highlight play mode (conceptually active)
            setupInstructions.style.display = 'none';
        }
    }
    
    hasSoldiers() {
        for (let row = 0; row < this.boardHeight; row++) {
            for (let col = 0; col < this.boardWidth; col++) {
                if (this.board[row][col]) {
                    return true;
                }
            }
        }
        return false;
    }
    
    clearAllSoldiers() {
        this.board = Array(this.boardHeight).fill(null).map(() => 
            Array(this.boardWidth).fill(false)
        );
        this.renderBoard();
        this.updateGameModeUI(); // Update UI after clearing
    }
    
    saveInitialSetup() {
        // Deep copy the current board state
        this.initialSetup = this.board.map(row => [...row]);
    }
    
    restoreInitialSetup() {
        // Restore the board from the saved initial setup
        this.board = this.initialSetup.map(row => [...row]);
    }
    
    // Utility method to get a specific optimal setup for demonstration
    setOptimalSetup() {
        // Clear board
        this.clearAllSoldiers();
        
        const center = Math.floor(this.boardWidth / 2);
        
        // Minimal setup that can reach row 4 (this is one known configuration)
        const soldiers = [
            [this.shorelineRow + 1, center],
            [this.shorelineRow + 2, center - 1],
            [this.shorelineRow + 2, center],
            [this.shorelineRow + 2, center + 1],
            [this.shorelineRow + 3, center - 2],
            [this.shorelineRow + 3, center - 1],
            [this.shorelineRow + 3, center],
            [this.shorelineRow + 3, center + 1],
            [this.shorelineRow + 3, center + 2],
            [this.shorelineRow + 4, center - 1],
            [this.shorelineRow + 4, center],
            [this.shorelineRow + 4, center + 1],
            [this.shorelineRow + 5, center],
            [this.shorelineRow + 6, center],
            [this.shorelineRow + 7, center]
        ];
        
        soldiers.forEach(([row, col]) => {
            if (row < this.boardHeight && col >= 0 && col < this.boardWidth) {
                this.board[row][col] = true;
            }
        });
        
        this.renderBoard();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new ConwaysSoldierGame();
    
    // Add a secret command to set up optimal configuration
    window.setOptimal = () => {
        window.game.setOptimalSetup();
        window.game.renderBoard();
        console.log('¡Configuración óptima cargada! Intenta alcanzar la fila 4 sobre la línea de costa.');
    };
    
    console.log('¡Conway\'s Soldier Game cargado!');
    console.log('Escribe setOptimal() en la consola para obtener una configuración que pueda alcanzar la fila 4.');
});