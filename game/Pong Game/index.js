const { body } = document;
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const width = 500;
const height = 700;
let canvasPosition = 0;

const isMobile = window.matchMedia("(max-width: 600px)");
const gameOverDiv = document.createElement('div');

const paddleWidth = 10;
const paddleHeight = 50;
const paddleDiff = paddleWidth / 2;
let paddleBawahx = 255;
let paddleAtasx = 255;
let pemainGerak = false;
let paddleContact = false;

let bolaX = 250;
let bolaY = 350;
const bolaRadius = 5;

let skorPemain = 0;
let skorBot = 0;
const skorPemenang = 5;
let isNewGame = true;
let isGameOver = true;

let kecepatanY;
let kecepatanX;
let trajectoryX;
let kecepatanCom;

if(isMobile.matches){
    kecepatanY = -2;
    kecepatanX = kecepatanY;
    kecepatanCom = 4;
}else{
    kecepatanY = -1;
    kecepatanX = kecepatanY;
    kecepatanCom = 3;
}

const gerakBola = () => {
    bolaY += kecepatanY;

    if (paddleContact) {
        bolaX += trajectoryX;
    } else {
        bolaX += kecepatanX;
    }
}

const bolaReset = () => {
    bolaX = width / 2;
    bolaY = height / 2;
    kecepatanY = -3;
    kecepatanX = -kecepatanY;
    paddleContact = false;
}

const cetakSkor = () => {
    if (bolaX - bolaRadius <= 0 || bolaX + bolaRadius >= width) {
        kecepatanX = -kecepatanX;
    }


    if (bolaY > height - 20 - paddleDiff){
        if (bolaX > paddleBawahx && bolaX < paddleBawahx + paddleHeight){
            paddleContact = true;
            if(pemainGerak){
                kecepatanY -= 1;
                if(kecepatanY <= -5){
                    kecepatanY = -5;
                    kecepatanCom = 6;
                }
            }
            kecepatanY = -kecepatanY;
            trajectoryX = (bolaX - (paddleBawahx + paddleHeight / 2)) * 0.2;
        } else if(bolaY > height + bolaRadius){
            bolaReset();
            skorBot++;
        }
    }

    if (bolaY < 10 + paddleDiff) {
        if (bolaX > paddleAtasx && bolaX < paddleAtasx + paddleHeight) {
            if(pemainGerak){
                kecepatanY += 1;
                if(kecepatanY >= 5){
                    kecepatanY = 5;
                }
            }
            kecepatanY = -kecepatanY;
            trajectoryX = (bolaX - (paddleAtasx + paddleHeight / 2)) * 0.2;
        } else if(bolaY < -bolaRadius){
            bolaReset();
            skorPemain++;
        }
    }
}

const gerakBot = () => {
    if (paddleAtasx + paddleDiff < bolaX){
        paddleAtasx += kecepatanCom;
    } else{
        paddleAtasx -= kecepatanCom;
    }

    if (paddleAtasx < 0) {
        paddleAtasx = 0;
    } else if (paddleAtasx > width - paddleHeight) {
        paddleAtasx = width - paddleHeight;
    }
}

const gameOver = () => {
    if(skorPemain === skorPemenang || skorBot === skorPemenang){
        isGameOver = true;
        const winner = skorPemain === skorPemenang ? 'Pemain' : 'Bot';
        tampilanGameOver(winner);
    }
}

const tampilanGameOver = (winner) => {
    canvas.hidden = true;
    gameOverDiv.textContent = '';
    const title = document.createElement('h1');
    title.textContent = `${winner} Menang!`;
    const tombolUlang = document.createElement('button');
    tombolUlang.setAttribute('onClick', 'startGame()');
    tombolUlang.textContent = 'Main Lagi';
    gameOverDiv.append(title, tombolUlang);
    body.appendChild(gameOverDiv);
    gameOverDiv.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 100;
    `;
    tombolUlang.style.cssText = `
        background-color: limegreen;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 15px;
        font-size: 18px;
    `;
}

const renderCanvas = () => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';
    context.fillRect(paddleBawahx, height - 20, paddleHeight, paddleWidth );
    context.fillRect(paddleAtasx, 10, paddleHeight, paddleWidth);

    context.beginPath();
    context.setLineDash([5]);
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.strokeStyle = 'limegreen';
    context.stroke();

    context.beginPath();
    context.arc(bolaX, bolaY, bolaRadius, 0, 2 * Math.PI);
    context.fillStyle = 'white';
    context.fill();

    context.font = '20px Courier New';
    context.fillStyle = 'white';
    context.fillText(`Skor P: ${skorPemain}`, 20, height / 2 + 50);
    context.fillText(`Skor B: ${skorBot}`, 20, height / 2 - 50);
}

const createCanvas = () => {
    canvas.width = width;
    canvas.height = height;
    canvas.style.cssText = `
        display: block;
        margin: 20px auto;
        border: 2px solid limegreen;
        background-color: black;
    `;
    body.appendChild(canvas);
    canvasPosition = canvas.getBoundingClientRect().left;
}

const animate = () => {
    renderCanvas();
    gerakBola();
    cetakSkor();
    gerakBot();
    gameOver();
    if (!isGameOver) {
        requestAnimationFrame(animate);
    }
}

const startGame = () => {
    if (isGameOver && !isNewGame) {
        if (body.contains(gameOverDiv)) {
            body.removeChild(gameOverDiv);
        }
        canvas.hidden = false;
    }
    isGameOver = false;
    isNewGame = false;
    skorPemain = 0;
    skorBot = 0;
    bolaReset();
    if (!canvas.parentNode) {
        createCanvas();
    } else {
        canvasPosition = canvas.getBoundingClientRect().left;
    }
    animate();

    canvas.addEventListener('mousemove', (e)=> {
        pemainGerak = true;
        paddleBawahx = e.clientX - canvasPosition - paddleHeight / 2;

        if (paddleBawahx < 0) {
            paddleBawahx = 0;
        } else if (paddleBawahx > width - paddleHeight) {
            paddleBawahx = width - paddleHeight;
        }
    });
}

startGame();

window.addEventListener('resize', () => {
    if (canvas.parentNode) {
        canvasPosition = canvas.getBoundingClientRect().left;
    }
});
