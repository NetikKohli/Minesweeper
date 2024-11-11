document.addEventListener("DOMContentLoaded", () => {
    const levelMapper = {
      easy: { boardSize: 8, mineCount: 10 },
      medium: { boardSize: 12, mineCount: 20 },
      hard: { boardSize: 15, mineCount: 35 },
    };
  
    const startButton = document.querySelector(".minesweeper-start");
    const levelSelect = document.querySelector(".minesweeper-level");
    const gameboard = document.querySelector(".minesweeper-board");
    const flags = document.querySelector(".minesweeper-flag-count");
    const endScreen = document.querySelector(".minesweeper-endscreen");
    const endScreenText = document.querySelector(".minesweeper-endscreen-text");
    const restartButton = document.querySelector(".minesweeper-restart");
    const change = document.querySelector(".start");
    const exitButton = document.querySelector(".minesweeper-exit");
    startButton.addEventListener("click", ()=>{initializeGame(); change.style.display='none'});
    restartButton.addEventListener("click", initializeGame); // Restart game
    
    change.style.display='none';
    exitButton.addEventListener("click",()=> endGame("Bye Bye ...")); // Exit game
    initializeGame()
    
    function initializeGame() {
      gameboard.innerHTML = ""; // Clear any existing cells
      endScreen.style.display = "none"; // Hide the end screen
      gameboard.style.visibility = "visible"; // Show the gameboard
      startButton.style.display = "block"; // Hide the start button
      levelSelect.style.display = "block"; // Hide the level select dropdown
      const level = levelSelect.value;
      levelSelect.addEventListener("change",()=> {change.style.display='flex'});
      const { boardSize, mineCount } = levelMapper[level];
  
      let mines = generateMines(boardSize, mineCount);
      flags.textContent = `🚩 ${mineCount}`;
      createBoard(boardSize, mines);
    }
  
  
    function generateMines(boardSize, mineCount) {
      const mines = new Set();
      while (mines.size < mineCount) {
        const randomMine = `${Math.floor(Math.random() * boardSize)}-${Math.floor(Math.random() * boardSize)}`;
        mines.add(randomMine);
      }
      return mines;
    }
  
    function createBoard(boardSize, mines) {
      for (let row = 0; row < boardSize; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("minesweeper-row");
  
        for (let col = 0; col < boardSize; col++) {
          const cell = document.createElement("div");
          cell.classList.add("box", "unrevealed");
          cell.setAttribute("data-id", `${row}-${col}`);
  
          cell.addEventListener("click", () => revealCell(cell, row, col, boardSize, mines));
          cell.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            toggleFlag(cell);
          });
  
          rowDiv.appendChild(cell);
        }
        gameboard.appendChild(rowDiv);
      }
    }
  
    function toggleFlag(cell) {
      if (cell.classList.contains("revealed")) return;
      cell.classList.toggle("flag");
      updateFlagCount();
    }
  
    function updateFlagCount() {
      const flagsCount = document.querySelectorAll(".box.flag").length;
      const level = levelSelect.value;
      flags.textContent = `🚩 ${levelMapper[level].mineCount - flagsCount}`;
    }
  
    function revealCell(cell, row, col, boardSize, mines) {
      if (cell.classList.contains("flag") || cell.classList.contains("revealed")) return;
  
      const cellId = `${row}-${col}`;
      if (mines.has(cellId)) {
        cell.classList.add("revealed", "mine");
        revealAllMines(mines);
        endGame("Ohh No ... \n You Loose! Try Again.");
      } else {
        const mineCount = countMinesAround(row, col, boardSize, mines);
        cell.classList.add("revealed");
        if (mineCount > 0) {
          cell.textContent = mineCount;
          cell.classList.add(`text-${mineCount}`);
        } else {
          revealSurroundingCells(row, col, boardSize, mines);
        }
      }
    }
  
    function revealSurroundingCells(row, col, boardSize, mines) {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && c >= 0 && r < boardSize && c < boardSize) {
            const adjacentCell = document.querySelector(`.box[data-id="${r}-${c}"]`);
            if (adjacentCell && !adjacentCell.classList.contains("revealed")) {
              revealCell(adjacentCell, r, c, boardSize, mines);
            }
          }
        }
      }
    }
  
    function countMinesAround(row, col, boardSize, mines) {
      let mineCount = 0;
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && c >= 0 && r < boardSize && c < boardSize) {
            if (mines.has(`${r}-${c}`)) mineCount++;
          }
        }
      }
      return mineCount;
    }
  
    function revealAllMines(mines) {
      mines.forEach((mineId) => {
        const mineCell = document.querySelector(`.box[data-id="${mineId}"]`);
        if (mineCell) {
          mineCell.classList.add("revealed", "mine");
        }
      });
    }
  
    function endGame(message) {
     setTimeout( ()=>{gameboard.style.visibility = "hidden"; // Hide the gameboard
      endScreen.style.display = "flex"; // Show the end screen
      endScreenText.textContent = message; // Set the message
      startButton.style.display = "none"; // Hide the start button
      levelSelect.style.display = "none"; // Hide the level select dropdown
    },1500);
    }
  });
  
