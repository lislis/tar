var raf;
var midi;

var strength = 100;
var score = 0;
var speedFactor = 0.03;

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
var strength =  document.querySelector('#hud');

function frame(dt) {
  let pos = cam.getAttribute('position');
  cam.setAttribute('position', {x: pos.x, y: pos.y, z: pos.z - speedFactor } );
  //console.log(Math.floor(dt) % 1000);

  if (cam.getAttribute('position').z <= boxZ.getAttribute('position').z) {
    console.log(cam);
    boxZ.parentNode.removeChild(boxZ);
    score ++;
    scoreBoard.setAttribute('text', 'value', `Barriers passed: ${score}`);

    // get current light color
    // get color of barriers
    // calculate damage to strength
    // if strength < 0 -> end game

    let newBox = document.querySelector('.box');
    if (newBox) {
      boxZ = newBox;
    } // else end game?
  }

  raf = window.requestAnimationFrame(frame);
}

function cancelFrame(id) {
  window.cancelAnimationFrame(id);
}

// intro screen
document.querySelector('#intro button').addEventListener('click', () => {
  document.querySelector('body').removeChild(document.querySelector('#intro'));
  frame();
  midi.lp.illuminateGrid();
});


// end screen
// highscore strength times barriers
