var midi;
var game;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  alert("No MIDI support in your browser.");
}

function onMIDISuccess(midiAccess) {
  midi = new MidiMgmt(midiAccess, light);
  game = new Game(midi);
  game.midi.lp.reset();
}

function onMIDIFailure(error) {
  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

document.querySelector('#intro button').addEventListener('click', () => {
  document.querySelector('body').removeChild(document.querySelector('#intro'));
  game.start();
});
