const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const lagu = new Audio('bep.wav');
    lagu.preload = 'auto';  
    

    let ular;
    let makanan;
    let arah;
    let gameInterval;
    let gameOver = false;

    
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    function startGame() {
        if (gameInterval) clearInterval(gameInterval);
        gameOver = false;
        
        ular = [{ x: 10, y: 10 }];
        arah = { x: 0, y: 0 };
        makanan = getRandomFoodPosition();
        scoreDisplay.textContent = '0';
        
        gameInterval = setInterval(() => {
            if (gameOver) return;
            
            moveSnake();
            drawGame();
            checkCollision();
        }, 100);
    }

    function getRandomFoodPosition() {
        let newmakan;
        do {
            newmakan = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (ular.some(segment => segment.x === newmakan.x && segment.y === newmakan.y));
        
        return newmakan;
    }

    function moveSnake() {
        const head = { ...ular[0] };
        
        
        if (arah.x) head.x += arah.x;
        if (arah.y) head.y += arah.y;

        if (
            head.x < 0 || head.x >= tileCount ||
            head.y < 0 || head.y >= tileCount
        ) {
            gameOver = true;
            return;
        }

        for (let i = 1; i < ular.length; i++) {
            if (ular[i].x === head.x && ular[i].y === head.y) {
                gameOver = true;
                return;
            }
        }

        ular.unshift(head);

        if (head.x === makanan.x && head.y === makanan.y) {
            scoreDisplay.textContent = ular.length - 1;
            makanan = getRandomFoodPosition();
            lagu.play();  
        } else {
            ular.pop();
        }
    }

    function drawGame() {
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'red';
        ctx.fillRect(makanan.x * gridSize, makanan.y * gridSize, gridSize, gridSize);

        ctx.fillStyle = 'lime';
        for (let segment of ular) {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }
    }

    function checkCollision() {
        if (
            ular[0].x < 0 || ular[0].x >= tileCount ||
            ular[0].y < 0 || ular[0].y >= tileCount ||
            ular.some((segment, index) => index !== 0 && segment.x === ular[0].x && segment.y === ular[0].y)
        ) {
            gameOver = true;
            clearInterval(gameInterval);
            alert('Game Over! Tekan tombol Start untuk memulai ulang.');
        }
    }

    
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                if (arah.x !== 1) arah = { x: -1, y: 0 };
                break;
            case 'ArrowUp':
                if (arah.y !== 1) arah = { x: 0, y: -1 };
                break;
            case 'ArrowRight':
                if (arah.x !== -1) arah = { x: 1, y: 0 };
                break;
            case 'ArrowDown':
                if (arah.y !== -1) arah = { x: 0, y: 1 };
                break;
        }
    });