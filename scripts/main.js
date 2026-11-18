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

const gameState = {
  score: 0,
  highScore: 0,

  updateScore: function () {
    const scoreElement = document.getElementById("score")
    scoreElement.textContent = gameState.score
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
  if (newDirX + lastDirX === 0 && newDirY + lastDirY === 0) {
    return
  }
  dirX = newDirX
  dirY = newDirY
})

function moveSnake() {
  lastDirX = dirX
  lastDirY = dirY
  undrawSnake()

  const newX = snake.body[0][0] + dirX
  const newY = snake.body[0][1] + dirY

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
  gameState.startGame()
})

drawSnake()
randomFood()
gameState.updateScore()
