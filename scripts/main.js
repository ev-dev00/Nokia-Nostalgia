const board = document.querySelector(".board")

const boardCells = function () {
  const cell = document.createElement("div")
  cell.classList.add("cell")
  board.appendChild(cell)
  return cell
}

function createBoard(rows, col) {
  const grid = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < col; c++) {
      row.push(boardCells())
    }
    grid.push(row)
  }
  return grid
}

const jungle = createBoard(31, 31)

function warnBeforeLeaving(event) {
  event.preventDefault()
  event.returnValue = ""
}

const gameState = {
  score: 0,
  highScore: Number(localStorage.getItem("highScore")),
  phase: "ready",

  updateScore: function () {
    const scoreElement = document.getElementById("score")
    const highScoreElement = document.getElementById("high-score")

    scoreElement.textContent = gameState.score

    if (gameState.score > gameState.highScore) {
      gameState.highScore = gameState.score
      localStorage.setItem("highScore", gameState.highScore)
    }

    highScoreElement.textContent = gameState.highScore
  },

  speed: 150,
  level: {
    easy: 250,
    normal: 150,
    hard: 80,
  },

  gameTimer: null,

  startGame: function () {
    clearInterval(gameState.gameTimer)
    gameState.phase = "playing"
    window.addEventListener("beforeunload", warnBeforeLeaving)
    gameState.gameTimer = setInterval(moveSnake, gameState.speed)
  },

  stopGame: function () {
    clearInterval(gameState.gameTimer)
  },
}

const snake = {
  name: "nagini",
  body: [
    [15, 14],
    [15, 15],
    [15, 16],
  ],
  isHere: function (x, y) {
    for (let i = 0; i < snake.body.length; i++) {
      if (snake.body[i][0] === x && snake.body[i][1] === y) {
        return true
      }
    }
    return false
  },

  flashTimer: null,
  flashShake: function () {
    for (let i = 0; i < snake.body.length; i++) {
      const x = snake.body[i][0]
      const y = snake.body[i][1]
      jungle[y][x].classList.toggle("flash")
    }
  },
}

function resetGame() {
  undrawSnake()

  snake.body = [
    [15, 14],
    [15, 15],
    [15, 16],
  ]
  dirX = 0
  dirY = -1
  lastDirX = 0
  lastDirY = -1

  gameState.score = 0
  gameState.updateScore()

  drawSnake()
  randomFood()
  gameState.phase = "ready"
}

function gameOver() {
  gameState.stopGame()
  gameState.phase = "flashing"
  window.removeEventListener("beforeunload", warnBeforeLeaving)

  let switches = 0
  snake.flashTimer = setInterval(function () {
    snake.flashShake()
    switches++

    if (switches === 10) {
      clearInterval(snake.flashTimer)
      resetGame()
    }
  }, 300)
}

let foodPosition = null
const placeFood = function (x, y) {
  if (foodPosition !== null) {
    jungle[foodPosition[1]][foodPosition[0]].classList.remove("food")
  }
  foodPosition = [x, y]
  jungle[y][x].classList.add("food")
}

function randomFood() {
  let x = Math.floor(Math.random() * jungle[0].length)
  let y = Math.floor(Math.random() * jungle.length)

  while (snake.isHere(x, y)) {
    x = Math.floor(Math.random() * jungle[0].length)
    y = Math.floor(Math.random() * jungle.length)
  }
  placeFood(x, y)
}

function drawSnake() {
  for (let i = 0; i < snake.body.length; i++) {
    const piece = snake.body[i]
    const x = piece[0]
    const y = piece[1]
    const cell = jungle[y][x]

    cell.classList.add("snake-body")

    if (i === 0) {
      cell.classList.add("snake-head")
    }
  }
}

function undrawSnake() {
  for (let i = 0; i < snake.body.length; i++) {
    const x = snake.body[i][0]
    const y = snake.body[i][1]
    jungle[y][x].classList.remove("snake-body")
    jungle[y][x].classList.remove("snake-head")
  }
}

let dirX = 0
let dirY = -1
let lastDirX = 0
let lastDirY = -1

document.addEventListener("keydown", function (event) {
  let newDirX = dirX
  let newDirY = dirY
  if (event.key === "ArrowUp") {
    newDirX = 0
    newDirY = -1
  } else if (event.key === "ArrowDown") {
    newDirX = 0
    newDirY = 1
  } else if (event.key === "ArrowLeft") {
    newDirX = -1
    newDirY = 0
  } else if (event.key === "ArrowRight") {
    newDirX = 1
    newDirY = 0
  } else {
    return
  }
  event.preventDefault()
  if (gameState.phase !== "playing") {
    return
  }
  if (newDirX + lastDirX === 0 && newDirY + lastDirY === 0) {
    return
  }
  dirX = newDirX
  dirY = newDirY
})

function moveSnake() {
  const newX = snake.body[0][0] + dirX
  const newY = snake.body[0][1] + dirY

  if (
    newX < 0 ||
    newX >= jungle[0].length ||
    newY < 0 ||
    newY >= jungle.length
  ) {
    gameOver()
    return
  }

  if (snake.isHere(newX, newY)) {
    gameOver()
    return
  }

  lastDirX = dirX
  lastDirY = dirY
  undrawSnake()

  snake.body.unshift([newX, newY])

  let ateFood = false
  if (newX === foodPosition[0]) {
    if (newY === foodPosition[1]) {
      ateFood = true
    }
  }

  if (ateFood) {
    gameState.score++
    gameState.updateScore()
    randomFood()
  } else {
    snake.body.pop()
  }
  drawSnake()
}

document.getElementById("easy-btn").addEventListener("click", function () {
  gameState.speed = gameState.level.easy
})

document.getElementById("normal-btn").addEventListener("click", function () {
  gameState.speed = gameState.level.normal
})

document.getElementById("hard-btn").addEventListener("click", function () {
  gameState.speed = gameState.level.hard
})

document.getElementById("start-game").addEventListener("click", function () {
  if (gameState.phase !== "ready") {
    return
  }
  gameState.startGame()
})

drawSnake()
randomFood()
gameState.updateScore()
