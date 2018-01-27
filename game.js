var cam = document.getElementById('camera');
var speedFactor = 0.01;
var raf;

var strength = 100;

function frame(dt) {
  let pos = cam.getAttribute('position');
  cam.setAttribute('position', {x: pos.x, y: pos.y, z: pos.z - speedFactor } );
  raf = window.requestAnimationFrame(frame);
}

//frame();

function cancelFrame(id) {
  window.cancelAnimationFrame(id);
}





var midi, data, out, lp;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  alert("No MIDI support in your browser.");
}

function onMIDISuccess(midiAccess) {
  midi = midiAccess; // raw midi data

  var inputs = midi.inputs.values();
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = onMIDIMessage;
  }

  var iter = midi.outputs.values();
  for (var i = iter.next(); i && !i.done; i = iter.next()) {
    out = []; // potential bug if n > 1 devices
    out.push(i.value);
    lp = new LaunchDevice(out[0]);
  }
}

function onMIDIFailure(error) {
  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

function onMIDIMessage(message) {
  data = message.data; // this gives us our [command/channel, note, velocity] data.
  console.log('MIDI data', data); // MIDI data [144, 63, 73]

  let action = data[0];
  let button = data[1];
  let color = data[2];

  let y = Math.floor(button / 8) / 2;
  let x = button % 8;

  let gridData = lp.grid.getCell(x, y);

  if (action === 144 && color === 127) {
    if (gridData === 0) { // was klicked on before
      lp.grid.setCell(x, y, 15);
      lp.device.send([144, button, 15]);
    } else {
      lp.grid.setCell(x, y, 0);
      lp.device.send([128, button, 0]);
    }
  }
}
