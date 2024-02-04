class MazeCell {
  constructor(row, col) {
    this.walls = [true, true, true, true];
    this.visited = false;
    this.row = row;
    this.col = col;
  }

  checkNeighbors() {
    const neighbors = [];

    const top = grid[calculateIndex(this.row, this.col - 1)];
    const right = grid[calculateIndex(this.row + 1, this.col)];
    const bottom = grid[calculateIndex(this.row, this.col + 1)];
    const left = grid[calculateIndex(this.row - 1, this.col)];

    if (right && !right.visited) neighbors.push(right);
    if (top && !top.visited) neighbors.push(top);
    if (left && !left.visited) neighbors.push(left);
    if (bottom && !bottom.visited) neighbors.push(bottom);

    if (neighbors.length > 0) {
      const randomIndex = floor(random(0, neighbors.length));
      return neighbors[randomIndex];
    } else {
      return undefined;
    }
  }

  highlight() {
    const x = this.row * cellWidth;
    const y = this.col * cellWidth;
    noStroke();
    fill(245, 93, 62);
    rect(x, y, cellWidth, cellWidth);
  }

  display() {
    const x = this.row * cellWidth;
    const y = this.col * cellWidth;
    stroke(255);

    if (this.walls[1]) line(x + cellWidth, y, x + cellWidth, y + cellWidth);
    if (this.walls[0]) line(x, y, x + cellWidth, y);
    if (this.walls[3]) line(x, y + cellWidth, x, y);
    if (this.walls[2]) line(x + cellWidth, y + cellWidth, x, y + cellWidth);

    if (this.visited) {
      noStroke();
      if (this.row === 0 && this.col === 0) fill(245, 93, 62);
      else if (calculateIndex(this.row, this.col) === grid.length - 1) fill(247, 203, 21);
      else fill(135, 142, 136);
      rect(x, y, cellWidth, cellWidth);
    }
  }
}

let stack = [];
let currentCell;
let grid = [];
let cols, rows;
let cellWidth;

function setup() {
  const canvasDimension = 500;
  const canvas = createCanvas(canvasDimension, canvasDimension);
  canvas.parent('maze');
  strokeWeight(1.5);
  cellWidth = 50;
  cols = 10;
  rows = 10;
  grid = [];
  stack = [];

  for (let col = 0; col < rows; col++) {
    for (let row = 0; row < cols; row++) {
      grid.push(new MazeCell(row, col));
    }
  }
  console.info(grid.length - 1);
  currentCell = grid[0];
}

function draw() {
  background(51);
  for (let i = 0; i < grid.length; i++) {
    grid[i].display();
  }

  currentCell.visited = true;
  currentCell.highlight();
  const nextCell = currentCell.checkNeighbors();

  if (nextCell) {
    nextCell.visited = true;
    stack.push(currentCell);
    removeWalls(currentCell, nextCell);
    currentCell = nextCell;
  } else if (stack.length > 0) {
    currentCell = stack.pop();
  }
}

function removeWalls(cellA, cellB) {
  const xDifference = cellA.row - cellB.row;
  if (xDifference === 1) {
    cellA.walls[3] = false;
    cellB.walls[1] = false;
  } else if (xDifference === -1) {
    cellA.walls[1] = false;
    cellB.walls[3] = false;
  }
  const yDifference = cellA.col - cellB.col;
  if (yDifference === 1) {
    cellA.walls[0] = false;
    cellB.walls[2] = false;
  } else if (yDifference === -1) {
    cellA.walls[2] = false;
    cellB.walls[0] = false;
  }
}

function calculateIndex(row, col) {
  if (row < 0 || col < 0 || row > cols - 1 || col > rows - 1) {
    return -1;
  }
  return row + col * cols;
}

function createMaze(dim, numRows) {
  clear();
  const canvas = createCanvas(dim, dim);
  canvas.parent('maze');
  strokeWeight(1.5);
  cellWidth = floor(dim / numRows);
  console.info(`cellWidth: ${cellWidth}`);
  cols = numRows;
  rows = numRows;
  grid = [];
  stack = [];

  for (let col = 0; col < rows; col++) {
    for (let row = 0; row < cols; row++) {
      grid.push(new MazeCell(row, col));
    }
  }
  console.info(grid.length - 1);
  currentCell = grid[0];
}

document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generate');
  generateButton.addEventListener('click', () => {
    const canvasDimension = document.getElementById('size').value === '' ? 500 : document.getElementById('size').value;
    const rowCol = document.getElementById('row').value === '' ? 10 : document.getElementById('row').value;
    createMaze(canvasDimension, rowCol);
  });
});
