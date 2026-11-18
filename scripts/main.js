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

const jungle = createBoard(30, 30)
const rows = 30
const cols = 30

let foodPosition = null
const placeFood = function (x, y) {
  if (foodPosition !== null) {
    jungle[foodPosition[1]][foodPosition[0]].classList.remove("food")
  }
  foodPosition = [x, y]
  jungle[y][x].classList.add("food")
}

function randomFood() {
  const x = Math.floor(Math.random() * cols)
  const y = Math.floor(Math.random() * rows)
  placeFood(x, y)
}

randomFood()
