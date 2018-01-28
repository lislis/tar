/*
 * Gives us access to the midi device
 * and receives messages from device
 */

class MidiMgmt {
  constructor(midi, elem) {
    this.midi = midi; // raw midi data
    this.entity = elem;

    this.colorMap = {
      12: '#ffffff',
      15: '#ff0000',
      63: '#dddd00',
      60: '#00ff00'
    };

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
    let data = message.data;
    let action = data[0];
    let button = data[1];
    let color = data[2];
    let y = Math.floor(button / 8) / 2;
    let x = button % 8;
    let gridData = this.lp.grid.getCell(x, y);

    this.lp.switchOff(button);
    this.entity.setAttribute('light', 'color', this.colorMap[gridData]);

    return data;
  }
}
