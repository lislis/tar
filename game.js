var raf;
var midi;

var strength = 100;
var score = 0;
var endScore = 0;
var speedFactor = 0.1;

var cam = document.getElementById('camera');
var light = document.getElementById('light');

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  alert("No MIDI support in your browser.");
}

function onMIDISuccess(midiAccess) {
  midi = new MidiMgmt(midiAccess, light);
  midi.lp.reset();
}

function onMIDIFailure(error) {
  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

var boxZ = document.querySelector('.box');
var scoreBoard =  document.querySelector('#score');
var strengthBoard =  document.querySelector('#hud');

function passBarrier() {
  if (boxZ !== null) {
    return cam.getAttribute('position').z <= boxZ.getAttribute('position').z;
  } else {
    checkForEnd();
  }
}

function rightColor() {
  // access key of barrier
  // map to necessary light color
  var matchMap = {
    '#ff0000': '#00ff00',
    '#ffff00': '#dddd00',
    '#00ff00': '#ff0000'
  };
  let boxColor = boxZ.getAttribute('color');
  let lightColor = midi.entity.getAttribute('light').color;

  return matchMap[boxColor] === lightColor;
}

function updateBoxZ() {
  if (boxZ.parentNode) {
    boxZ.parentNode.removeChild(boxZ);
  }

  let newBox = document.querySelector('.box');
  if (newBox) {
    boxZ = newBox;
  } else {
    boxZ = null;
  }
}

function updateScore() {
  score ++;
  scoreBoard.setAttribute('text', 'value', `Barriers passed: ${score}`);
}

function updateStrength() {
  strength -= 10;
  strengthBoard.setAttribute('text', 'value', `Strength remaining: ${strength}`);
}

function checkForEnd() {
  if (strength < 0 || boxZ === null) {
    endScore = score * strength;
    cancelFrame(raf);
    document.querySelector('#highscore').innerHTML = endScore;
    document.querySelector('#gameover').classList.remove('hidden');
  }
}


function frame(dt) {
  let pos = cam.getAttribute('position');
  cam.setAttribute('position', {x: pos.x, y: pos.y, z: pos.z - speedFactor } );

  if (passBarrier()) {
    updateScore();

    if (!rightColor()) {
      updateStrength();
      midi.lp.illuminateGrid();
      speedFactor += 0.01;
    }

    updateBoxZ();
  }
  checkForEnd();

  raf = window.requestAnimationFrame(frame);
}

function cancelFrame(id) {
  window.cancelAnimationFrame(id);
}

document.querySelector('#intro button').addEventListener('click', () => {
  document.querySelector('body').removeChild(document.querySelector('#intro'));
  frame();
  midi.lp.illuminateGrid();
});
