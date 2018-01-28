class Game {
  constructor(midi) {
    this.strength = 100;
    this.score = 0;
    this.endScore = 0;
    this.speedFactor = 0.1;
    this.speedIncrement = 0.01;
    this.scoreBoard = document.querySelector('#score');
    this.strengthBoard = document.querySelector('#hud');
    this.midi = midi;
    this.cam = document.getElementById('camera');
    this.light = document.getElementById('light');
    this.boxZ = document.querySelector('.box');
  }

  start() {
    this.frame();
    this.midi.lp.illuminateGrid();
  }

  frame() {
    this.moveCamera();
    if (this.passBarrier()) {
      this.updateScore();
      if (!this.rightColor()) {
        this.updateStrength();
        this.midi.lp.illuminateGrid();
        this.increaseSpeed();
      }
      this.updateBoxZ();
    }
    this.checkForEnd();
    this.raf = window.requestAnimationFrame(this.frame.bind(this));
    return this.raf;
  }

  cancelFrame(id) {
    window.cancelAnimationFrame(id);
  }

  moveCamera() {
    let pos = this.cam.getAttribute('position');
    let newPos = pos.z - this.speedFactor;
    this.cam.setAttribute('position', {x: pos.x, y: pos.y, z: newPos } );
    return newPos;
  }

  passBarrier() {
    if (this.boxZ !== null) {
      let camZ =  this.cam.getAttribute('position').z;
      let boxZ = this.boxZ.getAttribute('position').z;
      return camZ <= boxZ;
    } else {
      this.checkForEnd();
      return null;
    }
  }

  rightColor() {
    var matchMap = {
      '#ff0000': '#00ff00',
      '#ffff00': '#dddd00',
      '#00ff00': '#ff0000'
    };
    let boxColor = this.boxZ.getAttribute('color');
    let lightColor = this.midi.entity.getAttribute('light').color;
    return matchMap[boxColor] === lightColor;
  }

  increaseSpeed() {
    this.speedFactor += this.speedIncrement;
    return this.speedFactor;
  }

  updateBoxZ() {
    if (this.boxZ.parentNode) {
      this.boxZ.parentNode.removeChild(this.boxZ);
    }

    let newBox = document.querySelector('.box');
    if (newBox) {
      this.boxZ = newBox;
    } else {
      this.boxZ = null;
    }
    return this.boxZ;
  }

  updateScore() {
    this.score ++;
    this.scoreBoard.setAttribute('text', 'value', `Barriers passed: ${this.score}`);
    return this.score;
  }

  updateStrength() {
    this.strength -= 10;
    this.strengthBoard.setAttribute('text', 'value', `Strength remaining: ${this.strength}`);
    return this.strength;
  }

  checkForEnd() {
    if (this.strength < 0 || this.boxZ === null) {
      this.gameover();
      return true;
    } else {
      return false;
    }
  }
  gameover() {
    this.endScore = this.score * this.strength;
    this.cancelFrame(this.raf);
    document.querySelector('#highscore').innerHTML = this.endScore;
    document.querySelector('#gameover').classList.remove('hidden');
  }
}
