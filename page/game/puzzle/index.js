    const board = document.getElementById("board");
    const timerEl = document.getElementById("timer");
    const sound = new Audio("click.wav");
    sound.preload = "auto";

    let tiles = [];
    let timer = 0;
    let interval;

    function initBoard() {
      const numbers = [...Array(8).keys()].map(x => x + 1);
      numbers.push(null);
      shuffle(numbers);

      tiles = numbers;
      drawBoard();
      startTimer();
    }

    function shuffle(array) {
      do {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      } while (!isSolvable(array) || checkWin(array));
    }

    function isSolvable(arr) {
      const a = arr.filter(x => x !== null);
      let inversions = 0;
      for (let i = 0; i < a.length; i++) {
        for (let j = i + 1; j < a.length; j++) {
          if (a[i] > a[j]) inversions++;
        }
      }
      return inversions % 2 === 0;
    }

    function drawBoard() {
      board.innerHTML = "";
      tiles.forEach((num, index) => {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        if (num === null) {
          tile.classList.add("empty");
        } else {
          tile.textContent = num;
          tile.addEventListener("click", () => moveTile(index));
        }
        board.appendChild(tile);
      });
    }

    function moveTile(index) {
    sound.play();
      const emptyIndex = tiles.indexOf(null);
      const validMoves = [
        emptyIndex - 1, emptyIndex + 1,
        emptyIndex - 3, emptyIndex + 3
      ];

      if (validMoves.includes(index) && isAdjacent(index, emptyIndex)) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        drawBoard();
        if (checkWin(tiles)) {
          stopTimer();
          setTimeout(() => {
            alert(`🎉 Selamat! Kamu menyelesaikannya dalam ${timer} detik.`);
            resetGame();
          }, 200);
        }
      }
    }

    function isAdjacent(i1, i2) {
      const x1 = i1 % 3, y1 = Math.floor(i1 / 3);
      const x2 = i2 % 3, y2 = Math.floor(i2 / 3);
      return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
    }

    function checkWin(state) {
      const winState = [1, 2, 3, 4, 5, 6, 7, 8, null];
      return state.every((val, idx) => val === winState[idx]);
    }

    function startTimer() {
      timer = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        timer++;
        timerEl.textContent = `Waktu: ${timer} detik`;
      }, 1000);
    }

    function stopTimer() {
      clearInterval(interval);
    }

    function resetGame() {
      initBoard();
    }

    initBoard();