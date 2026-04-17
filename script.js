const WORDS = ["APPLE", "GRAPE", "TRAIN", "HOUSE", "PLANT"];

let game;

function initGame() {
  game = {
    targetWord: WORDS[Math.floor(Math.random() * WORDS.length)],
    currentRow: 0,
    currentCol: 0,
    guesses: Array(6).fill("").map(() => []),
    feedback: Array(6).fill(null),
    state: "playing"
  };
}

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let r = 0; r < 6; r++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let c = 0; c < 5; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `cell-${r}-${c}`;
      row.appendChild(cell);
    }

    board.appendChild(row);
  }
}

function renderGame() {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      const cell = document.getElementById(`cell-${r}-${c}`);
      const letter = game.guesses[r][c] || "";
      cell.textContent = letter;

      cell.classList.remove("correct", "present", "absent");

      if (game.feedback[r]) {
        cell.classList.add(game.feedback[r][c]);
      }
    }
  }

  const status = document.getElementById("status");

  if (game.state === "win") {
    status.textContent = "You win! 🎉";
  } else if (game.state === "lose") {
    status.textContent = `You lose! Word was ${game.targetWord}`;
  } else {
    status.textContent = "Keep guessing...";
  }
}

function processInput(key) {
  if (game.state !== "playing") return;

  if (/^[A-Z]$/.test(key)) {
    if (game.currentCol < 5) {
      game.guesses[game.currentRow][game.currentCol] = key;
      game.currentCol++;
    }
  }

  else if (key === "BACKSPACE") {
    if (game.currentCol > 0) {
      game.currentCol--;
      game.guesses[game.currentRow][game.currentCol] = "";
    }
  }

  else if (key === "ENTER") {
    if (game.currentCol === 5) {
      submitGuess();
    }
  }
}

function submitGuess() {
  const guess = game.guesses[game.currentRow].join("");
  const target = game.targetWord;

  const result = [];

  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result.push("correct");
    } else if (target.includes(guess[i])) {
      result.push("present");
    } else {
      result.push("absent");
    }
  }

  game.feedback[game.currentRow] = result;

  if (guess === target) {
    game.state = "win";
  } else if (game.currentRow === 5) {
    game.state = "lose";
  } else {
    game.currentRow++;
    game.currentCol = 0;
  }
}

function restartGame() {
  initGame();
  renderGame();
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();
  processInput(key);
  renderGame();
});

document.getElementById("restartBtn").addEventListener("click", () => {
  restartGame();
});

initGame();
createBoard();
renderGame();