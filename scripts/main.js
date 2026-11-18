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
const rows = 31
const cols = 31

let snake = {
  name: "nagini",
  body: [
    [15, 14],
    [15, 15],
    [15, 16],
  ],
}

function isOnSnake(x, y) {
  for (let i = 0; i < snake.body.length; i++) {
    if (snake.body[i][0] === x && snake.body[i][1] === y) {
      return true
    }
  }
  return false
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
  let x = Math.floor(Math.random() * cols)
  let y = Math.floor(Math.random() * rows)

  while (isOnSnake(x, y)) {
    x = Math.floor(Math.random() * cols)
    y = Math.floor(Math.random() * rows)
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

let score = 0
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
    score++
    randomFood()
  } else {
    snake.body.pop()
  }
  drawSnake()
}

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

drawSnake()
randomFood()
setInterval(moveSnake, 200)
