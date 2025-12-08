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

        this.connections = []; // Array of {from, to, path} connections
        this.isDrawing = false;
        this.currentPath = [];
        this.drawingFrom = null;
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

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', this.pathArrayToString(conn.path));
        path.setAttribute('class', 'connection-line');
        path.setAttribute('data-index', index);

        path.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeConnection(index);
        });

        canvas.appendChild(path);
    }

    pathArrayToString(pathArray) {
        if (pathArray.length === 0) return '';
        let d = `M ${pathArray[0].x} ${pathArray[0].y}`;
        for (let i = 1; i < pathArray.length; i++) {
            d += ` L ${pathArray[i].x} ${pathArray[i].y}`;
        }
        return d;
    }

    getNode(id) {
        return [...this.houses, ...this.utilities].find(n => n.id === id);
    }

    handleNodeClick(node, type, e) {
        e.stopPropagation();
        e.preventDefault();

        // Start drawing from this node
        this.isDrawing = true;
        this.drawingFrom = node;
        this.currentPath = [{ x: node.x, y: node.y }];
        this.renderBoard();
    }

    handleMouseMove(e) {
        if (!this.isDrawing) return;

        const canvas = document.getElementById('canvas');
        const rect = canvas.getBoundingClientRect();
        const scaleX = 500 / rect.width;
        const scaleY = 360 / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Check if we've made contact with a target node
        const nodeAtPosition = this.getNodeAtPosition(x, y);
        if (nodeAtPosition && nodeAtPosition.id !== this.drawingFrom.id) {
            // Made contact! End the drawing
            this.currentPath.push({ x: nodeAtPosition.x, y: nodeAtPosition.y });
            this.isDrawing = false;
            this.tryCreateConnection(this.drawingFrom, nodeAtPosition);
            this.drawingFrom = null;
            this.currentPath = [];
            this.renderBoard();
            return;
        }

        this.currentPath.push({ x, y });
        this.renderDrawingPath();
    }

    handleTouchMove(e) {
        if (!this.isDrawing) return;
        e.preventDefault();

        const canvas = document.getElementById('canvas');
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const scaleX = 500 / rect.width;
        const scaleY = 360 / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        // Check if we've made contact with a target node
        const nodeAtPosition = this.getNodeAtPosition(x, y);
        if (nodeAtPosition && nodeAtPosition.id !== this.drawingFrom.id) {
            // Made contact! End the drawing
            this.currentPath.push({ x: nodeAtPosition.x, y: nodeAtPosition.y });
            this.isDrawing = false;
            this.tryCreateConnection(this.drawingFrom, nodeAtPosition);
            this.drawingFrom = null;
            this.currentPath = [];
            this.renderBoard();
            return;
        }

        this.currentPath.push({ x, y });
        this.renderDrawingPath();
    }

    handleMouseUp(e) {
        if (!this.isDrawing) return;

        const canvas = document.getElementById('canvas');
        const rect = canvas.getBoundingClientRect();
        const scaleX = 500 / rect.width;
        const scaleY = 360 / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Check if we ended on a node
        const endNode = this.getNodeAtPosition(x, y);

        if (endNode && endNode.id !== this.drawingFrom.id) {
            this.tryCreateConnection(this.drawingFrom, endNode);
        }

        this.isDrawing = false;
        this.drawingFrom = null;
        this.currentPath = [];
        this.renderBoard();
    }

    handleTouchEnd(e) {
        if (!this.isDrawing) return;
        e.preventDefault();

        const canvas = document.getElementById('canvas');
        const rect = canvas.getBoundingClientRect();
        const touch = e.changedTouches[0];
        const scaleX = 500 / rect.width;
        const scaleY = 360 / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        // Check if we ended on a node
        const endNode = this.getNodeAtPosition(x, y);

        if (endNode && endNode.id !== this.drawingFrom.id) {
            this.tryCreateConnection(this.drawingFrom, endNode);
        }

        this.isDrawing = false;
        this.drawingFrom = null;
        this.currentPath = [];
        this.renderBoard();
    }

    getNodeAtPosition(x, y) {
        const allNodes = [...this.houses, ...this.utilities];
        for (const node of allNodes) {
            const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
            if (dist <= this.lineRadius * 1.5) {
                return node;
            }
        }
        return null;
    }

    tryCreateConnection(fromNode, toNode) {
        const fromHouse = this.houses.find(h => h.id === fromNode.id);
        const toUtility = this.utilities.find(u => u.id === toNode.id);
        const fromUtility = this.utilities.find(u => u.id === fromNode.id);
        const toHouse = this.houses.find(h => h.id === toNode.id);

        // Only allow house -> utility connections
        if ((fromHouse && toUtility) || (fromUtility && toHouse)) {
            const from = fromHouse ? fromNode.id : toNode.id;
            const to = fromHouse ? toNode.id : fromNode.id;

            // Check if connection already exists
            if (this.connections.some(c => c.from === from && c.to === to)) {
                return;
            }

            // Simplify path to avoid too many points
            const simplifiedPath = this.simplifyPath(this.currentPath, 5);

            // Check for crossings
            if (this.wouldPathCross(simplifiedPath)) {
                alert('❌ ¡Las líneas se cruzan! No puedes hacer esta conexión.');
            } else {
                this.connections.push({ from, to, path: simplifiedPath });
                this.checkWin();
            }
        }
    }

    simplifyPath(path, tolerance) {
        if (path.length <= 2) return path;

        // Simple decimation - keep every nth point
        const simplified = [path[0]];
        for (let i = tolerance; i < path.length - 1; i += tolerance) {
            simplified.push(path[i]);
        }
        simplified.push(path[path.length - 1]);
        return simplified;
    }

    renderDrawingPath() {
        const canvas = document.getElementById('canvas');
        let existingPath = canvas.querySelector('.drawing-line');
        
        if (existingPath) {
            existingPath.remove();
        }

        if (this.currentPath.length > 1) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', this.pathArrayToString(this.currentPath));
            path.setAttribute('class', 'drawing-line');
            canvas.appendChild(path);
        }
    }

    wouldPathCross(newPath) {
        // Check if the new path crosses any existing connection paths
        for (const conn of this.connections) {
            if (this.pathsCross(newPath, conn.path)) {
                return true;
            }
        }
        return false;
    }

    pathsCross(path1, path2) {
        // Check if any segment in path1 crosses any segment in path2
        for (let i = 0; i < path1.length - 1; i++) {
            for (let j = 0; j < path2.length - 1; j++) {
                if (this.linesCross(
                    path1[i].x, path1[i].y, path1[i + 1].x, path1[i + 1].y,
                    path2[j].x, path2[j].y, path2[j + 1].x, path2[j + 1].y
                )) {
                    return true;
                }
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

        const canvas = document.getElementById('canvas');
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
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
