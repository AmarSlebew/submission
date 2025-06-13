const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const lagu = new Audio(
      "lagu.mp3"
    )
    lagu.preload = "auto";
    lagu.loop = true;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let birdX = 100;
    let birdY = canvas.height / 2;
    let velocity = 0;
    const gravity = 0.2;
    const flapPower = -7;

    let pipes = [];
    const pipeWidth = 80;
    const gap = 120;
    let score = 0;

    document.addEventListener('click', () => {
      velocity = flapPower;
    });

    function drawBird() {
      ctx.beginPath();
      ctx.arc(birdX, birdY, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'yellow';
      ctx.fill();
    }

    function drawPipes() {
      for (let pipe of pipes) {
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

        
        ctx.fillRect(pipe.x, pipe.bottomHeight, pipeWidth, canvas.height - pipe.bottomHeight);
      }
    }

    function update() {
      
      velocity += gravity;
      birdY += velocity;

      
      if (birdY + 10 >= canvas.height) {
        alert('Game Over! Your score: ' + score);
        document.location.reload();
      }

      
      if (birdY - 10 <= 0) {
        birdY = 10;
      }

      
      if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const topHeight = Math.random() * (canvas.height - gap - 50);
        pipes.push({
          x: canvas.width,
          topHeight: topHeight,
          bottomHeight: topHeight + gap
        });
      }

      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -=2;
        if (pipes[i].x + pipeWidth < 0) {
          pipes.splice(i, 1);
        }
      }

      
      for (let pipe of pipes) {
        if (
          birdX + 10 > pipe.x &&
          birdX < pipe.x + pipeWidth &&
          (birdY < pipe.topHeight || birdY + 10 > pipe.bottomHeight)
        ) {
          alert('Game Over! Your score: ' + score);
          document.location.reload();
        }
      }

    }

    function draw() {
      
      ctx.fillStyle = '#8fbc8f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      
      drawBird();
      drawPipes();
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
      lagu.play();
    }

    gameLoop();