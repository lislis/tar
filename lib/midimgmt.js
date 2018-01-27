/*
 * Gives us access to the midi device
 * and receives messages from device
 */

class MidiMgmt {
  constructor(midi) {
    this.midi = midi; // raw midi data

    let out;
    let iter = this.midi.outputs.values();
    for (var i = iter.next(); i && !i.done; i = iter.next()) {
      out = []; // potential bug if n > 1 devices
      out.push(i.value);
      this.lp = new LaunchDevice(out[0]);
    }

    let inputs = this.midi.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = this.onMIDIMessage.bind(this);
    }
  }

  onMIDIMessage(message) {
    let data = message.data; // this gives us our [command/channel, note, velocity] data.
    console.log('MIDI data', data); // MIDI data [144, 63, 73]

    let action = data[0];
    let button = data[1];
    let color = data[2];

    let y = Math.floor(button / 8) / 2;
    let x = button % 8;

    let gridData = this.lp.grid.getCell(x, y);

    if (action === 144 && color === 127) {
      if (gridData === 0) { // was klicked on before
        this.lp.grid.setCell(x, y, 15);
        this.lp.device.send([144, button, 15]);
      } else {
        this.lp.grid.setCell(x, y, 0);
        this.lp.device.send([128, button, 0]);
      }
    }
  }
}
