var raf;
var midi;

var strength = 100;
var speedFactor = 0.01;

var cam = document.getElementById('camera');

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  alert("No MIDI support in your browser.");
}

function onMIDISuccess(midiAccess) {
  midi = new MidiMgmt(midiAccess);
  midi.lp.reset();
}

function onMIDIFailure(error) {
  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

function frame(dt) {
  let pos = cam.getAttribute('position');
  cam.setAttribute('position', {x: pos.x, y: pos.y, z: pos.z - speedFactor } );
  raf = window.requestAnimationFrame(frame);
  //console.log(Math.floor(dt) % 1000);
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
