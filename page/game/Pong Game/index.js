const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const sound = new Audio('hit.wav')
const soundDinding = new Audio('hit.wav')
sound.preload = "auto";
soundDinding.preload = "auto";

function resizeCanvas() {
    if (window.innerWidth < 768) { 
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } else {
      canvas.width = 500;
      canvas.height = 700;
    }
  }

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

const paddleWidth = 100;
const paddleHeight = 10;
const kecepatanBot = 3; 

let player = { x: 200, y: canvas.height - 20 };
let bot = { x: 200, y: 10 };

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  speed: 10,
  dx: 3,
  dy: -4
};

let score = { player: 0, bot: 0 };
const winningScore = 5;
let isGameOver = false;

const gameStart = document.getElementById('game-start')
const gameOverDiv = document.getElementById('game-over');
const winnerText = document.getElementById('winner');

function drawPaddle(p) {
  ctx.fillStyle = 'white';
  ctx.fillRect(p.x, p.y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

function drawNet() {
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.strokeStyle = 'limegreen';
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawScore() {
  ctx.font = '20px Courier New';
  ctx.fillText(`Pemain: ${score.player}`, 20, canvas.height / 2 + 40);
  ctx.fillText(`Bot: ${score.bot}`, 20, canvas.height / 2 - 20);
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2);
  ball.dy = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2);
}

function moveBot() {
  if (ball.dy < 0) {
    const tengahBot = bot.x + paddleWidth / 2;
    const selisih = ball.x - tengahBot;

    const kesalahan = Math.random() * 30 - 15;

    const kecepatan = Math.min(kecepatanBot, Math.abs(selisih) / 10);

    if (Math.abs(selisih) > 10) {
      bot.x += Math.sign(selisih + kesalahan) * kecepatan;
    }
  }

  if (bot.x < 0) bot.x = 0;
  if (bot.x + paddleWidth > canvas.width) bot.x = canvas.width - paddleWidth;
}


function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.dx *= -1;
    soundDinding.play();
  }

  if (ball.y + ball.radius >= player.y &&
      ball.x >= player.x && ball.x <= player.x + paddleWidth) {
    ball.dy *= -1.05;
    ball.speed += 0.2;
    sound.play();
  }

  if (ball.y - ball.radius <= bot.y + paddleHeight &&
      ball.x >= bot.x && ball.x <= bot.x + paddleWidth) {
    ball.dy *= -1.05;
    sound.play();
  }

  if (ball.y - ball.radius > canvas.height) {
    score.bot++;
    checkGameOver();
    resetBall();
  }

  if (ball.y + ball.radius < 0) {
    score.player++;
    checkGameOver();
    resetBall();
  }
}

function checkGameOver() {
  if (score.player >= winningScore || score.bot >= winningScore) {
    isGameOver = true;
    winnerText.textContent = score.player >= winningScore ? 'Pemain Menang!' : 'Bot Menang!';
    gameOverDiv.style.display = 'block';
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(player);
  drawPaddle(bot);
  drawBall();
  drawNet();
  drawScore();
}

function gameLoop() {
  if (!isGameOver) {
    draw();
    moveBot();
    updateBall();
    requestAnimationFrame(gameLoop);
  }
}
function startGame() {
  isGameOver = false;
  score.player = 0;
  score.bot = 0;
  resetBall();
  document.getElementById('game-over').style.display = 'none';
  gameLoop();
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  player.x = e.clientX - rect.left - paddleWidth / 2;
  if (player.x < 0) player.x = 0;
  if (player.x + paddleWidth > canvas.width) player.x = canvas.width - paddleWidth;
});

gameStart.addEventListener('click', () => {
  gameStart.style.display = 'none';
  startGame();
});