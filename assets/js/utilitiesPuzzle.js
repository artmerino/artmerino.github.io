class UtilitiesPuzzle {
    constructor() {
        this.houses = [
            { id: 'h1', label: 'Casa 1', x: 50, y: 80 },
            { id: 'h2', label: 'Casa 2', x: 50, y: 180 },
            { id: 'h3', label: 'Casa 3', x: 50, y: 280 }
        ];

        this.utilities = [
            { id: 'u1', label: '💧', name: 'Agua', x: 450, y: 80 },
            { id: 'u2', label: '⚡', name: 'Electricidad', x: 450, y: 180 },
            { id: 'u3', label: '🔥', name: 'Gas', x: 450, y: 280 }
        ];

        this.connections = []; // Array of {from, to} connections
        this.selectedNode = null;
        this.lineRadius = 20;

        this.initializeSVG();
        this.renderBoard();
        this.setupEventListeners();
    }

    initializeSVG() {
        const canvas = document.getElementById('canvas');
        canvas.setAttribute('width', '500');
        canvas.setAttribute('height', '360');
        canvas.setAttribute('viewBox', '0 0 500 360');
    }

    renderBoard() {
        const canvas = document.getElementById('canvas');
        canvas.innerHTML = '';

        // Draw connections first (so they appear behind nodes)
        this.connections.forEach((conn, index) => {
            this.drawConnection(conn, index);
        });

        // Draw houses
        this.houses.forEach(house => {
            this.drawNode(house, 'house');
        });

        // Draw utilities
        this.utilities.forEach(utility => {
            this.drawNode(utility, 'utility');
        });

        this.updateConnectionCounter();
    }

    drawNode(node, type) {
        const canvas = document.getElementById('canvas');
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', `${type}${this.selectedNode?.id === node.id ? ' selected' : ''}`);
        group.setAttribute('data-id', node.id);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', this.lineRadius);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y);
        text.setAttribute('fill', 'white');

        if (type === 'utility') {
            text.textContent = node.label;
        } else {
            text.textContent = node.label.replace('Casa ', '');
        }

        group.appendChild(circle);
        group.appendChild(text);
        group.addEventListener('click', (e) => this.handleNodeClick(node, type, e));

        canvas.appendChild(group);
    }

    drawConnection(conn, index) {
        const canvas = document.getElementById('canvas');
        const fromNode = this.getNode(conn.from);
        const toNode = this.getNode(conn.to);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromNode.x);
        line.setAttribute('y1', fromNode.y);
        line.setAttribute('x2', toNode.x);
        line.setAttribute('y2', toNode.y);
        line.setAttribute('class', 'connection-line');
        line.setAttribute('data-index', index);

        line.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeConnection(index);
        });

        canvas.appendChild(line);
    }

    getNode(id) {
        return [...this.houses, ...this.utilities].find(n => n.id === id);
    }

    handleNodeClick(node, type, e) {
        e.stopPropagation();

        if (this.selectedNode === null) {
            // Select first node
            this.selectedNode = node;
            this.renderBoard();
        } else if (this.selectedNode.id === node.id) {
            // Deselect
            this.selectedNode = null;
            this.renderBoard();
        } else {
            // Try to create connection
            const fromHouse = this.houses.find(h => h.id === this.selectedNode.id);
            const toUtility = this.utilities.find(u => u.id === node.id);
            const fromUtility = this.utilities.find(u => u.id === this.selectedNode.id);
            const toHouse = this.houses.find(h => h.id === node.id);

            // Only allow house -> utility connections
            if ((fromHouse && toUtility) || (fromUtility && toHouse)) {
                const from = fromHouse ? this.selectedNode.id : node.id;
                const to = fromHouse ? node.id : this.selectedNode.id;

                // Check if connection already exists
                if (!this.connections.some(c => c.from === from && c.to === to)) {
                    // Check for crossings
                    if (this.wouldCrossingOccur(from, to)) {
                        alert('❌ ¡Las líneas se cruzan! No puedes hacer esta conexión.');
                    } else {
                        this.connections.push({ from, to });
                        this.checkWin();
                    }
                }
            }

            this.selectedNode = null;
            this.renderBoard();
        }
    }

    wouldCrossingOccur(newFrom, newTo) {
        const newFromNode = this.getNode(newFrom);
        const newToNode = this.getNode(newTo);

        for (const conn of this.connections) {
            const existingFrom = this.getNode(conn.from);
            const existingTo = this.getNode(conn.to);

            if (this.linesCross(
                newFromNode.x, newFromNode.y, newToNode.x, newToNode.y,
                existingFrom.x, existingFrom.y, existingTo.x, existingTo.y
            )) {
                return true;
            }
        }

        return false;
    }

    linesCross(x1, y1, x2, y2, x3, y3, x4, y4) {
        // Check if line segment (x1,y1)-(x2,y2) intersects with (x3,y3)-(x4,y4)
        const ccw = (ax, ay, bx, by, cx, cy) => {
            return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
        };

        return ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) &&
               ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4);
    }

    removeConnection(index) {
        this.connections.splice(index, 1);
        this.renderBoard();
    }

    updateConnectionCounter() {
        document.getElementById('connectionCounter').textContent = `Conexiones: ${this.connections.length}/9`;
    }

    checkWin() {
        if (this.connections.length === 9) {
            // Check if all houses are connected to all utilities
            const required = 9; // 3 houses * 3 utilities

            if (this.connections.length === required) {
                this.renderBoard();
                setTimeout(() => {
                    alert('🎉 ¡Felicidades! 🎉\n\n¡Has logrado lo imposible!\n\nConectaste las 3 casas con los 3 servicios sin que se crucen las líneas.\n\nEsto desafía la topología matemática 😄');
                }, 300);
            }
        }
    }

    setupEventListeners() {
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    reset() {
        this.connections = [];
        this.selectedNode = null;
        this.renderBoard();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.puzzle = new UtilitiesPuzzle();
    console.log('¡Utilities Puzzle cargado!');
});
