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
    return colorCodes[Math.floor(Math.random() * colorCodes.length)];
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

  getNumber(x, y) {
    return (y * 16) + x;
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

  illuminateGrid() {
    let grid = this.grid.randomGrid();
    for (let i = 0; i < this.grid.matrix.length; i++) {
      for (let j = 0; j < this.grid.matrix[i].length; j++) {
        let color = this.grid.getCell(i, j);
        let button = this.grid.getNumber(i, j);
        this.switchOn(button, color);
      }
    }
    return grid;
  }

  switchOn(button, color) {
    let triple = [144, button, color];
    this.device.send(triple);
    return triple;
  }

  switchOff(button) {
    let triple = [144, button, 0]
    this.device.send(triple);
    return triple;
  }

  reset() {
    this.device.send([176, 0, 0]);
    return true;
  }

  welcome() {
    this.device.send([176, 0, 127]);
    return true;
  }
}
