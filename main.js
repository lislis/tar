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

var midi, data, grid, out;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  alert("No MIDI support in your browser.");
}

function setupGrid() {
  let grid = [];
  for (let i = 0; i < 8; i++) {
    grid.push([]);
    for (let j = 0; j < 8; j++) {
      grid[i].push(0);
    }
  }
  return grid;
}

function printGrid() {
  console.log(grid);
}

function setGrid(x, y, v) {
  grid[y][x] = v;
  return v;
}

function getGrid(x, y) {
  return grid[y][x];
}

function resetGrid(output) {
  output.send([176, 0, 0]);
}

function welcomeGrid(output) {
  output.send([176, 0, 127]);
}

function onMIDISuccess(midiAccess) {
  midi = midiAccess; // raw midi data
  grid = setupGrid();

  var inputs = midi.inputs.values();
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = onMIDIMessage;
  }

  var iter = midi.outputs.values();
  for (var i = iter.next(); i && !i.done; i = iter.next()) {
    out = []; // potential bug if n > 1 devices
    out.push(i.value);
    out = out[0];
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

  let gridData = getGrid(x, y);

  if (action === 144 && color === 127) {
    if (gridData === 0) { // was klicked on before
      setGrid(x, y, 15);
      out.send([144, button, 15]);
    } else {
      setGrid(x, y, 0);
      out.send([128, button, 0]);
    }
  }
}
