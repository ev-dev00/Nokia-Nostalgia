function createCell(rows, col) {
  const cell = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < col; c++) {
      row.push(0)
    }
    cell.push(row)
  }
  return cell
}

console.log(createCell(5, 5))

let snakePosition = [
  [8, 2],
  [7, 2],
  [6, 2],
]
