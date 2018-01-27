/*
 OFF: 12,
 LOW_RED: 13,
 RED: 15,
 LOW_AMBER: 29,
 AMBER: 63,
 LOW_GREEN: 28,
 GREEN: 60,
 YELLOW: 62,
 */


/*
 * Abstraction of grid buttons for state management
 */
class LaunchGrid {
  constructor() {
    let grid = [];
    for (let i = 0; i < 8; i++) {
      grid.push([]);
      for (let j = 0; j < 8; j++) {
        grid[i].push(0);
      }
    }
    this.matrix = grid;
  }

  randomColor() {
    let colorCodes = [15, 63, 60, 12];
    return Math.floor(Math.random() * colorCodes.length);
  }

  print() {
    console.log(this.matrix);
  }

  getCell(x, y) {
    return this.matrix[y][x];
  }

  setCell(x, y, v) {
    this.matrix[y][x] = v;
    return v;
  }

  randomGrid() {
    let grid = [];
    for (let i = 0; i < 8; i++) {
      grid.push([]);
      for (let j = 0; j < 8; j++) {
        grid[i].push(this.randomColor());
      }
    }
    return this.matrix = grid;
  }
}

/*
 * Utilities for interacting with device from the code
 */
class LaunchDevice {
  constructor(device) {
    this.device = device;
    this.grid = new LaunchGrid;
  }

  reset() {
    this.device.send([176, 0, 0]);
  }

  welcome() {
    this.device.send([176, 0, 127]);
  }
}
