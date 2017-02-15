/*
Bitwig 1.x.x controller script for Roland JUNO-Gi
*/

loadAPI(1);

host.defineController("Roland", "JUNO-Gi", "0.1", "3e0908d1-7c12-49f6-a42f-349eabe7eb14");
host.defineMidiPorts(2, 2); // the number of MIDI ports
host.addDeviceNameBasedDiscoveryPair(["JUNO-Gi MIDI 1", "JUNO-Gi MIDI 2"], ["JUNO-Gi MIDI 1", "JUNO-Gi MIDI 2"]);

// M32 prefix for CC buttons, modes, etc.
var JUNOGi = {
  TOP: 9,
  REW: 19,
  FF: 20,
  STOP: 21,
  PLAY: 22,
  REC: 23,
  SLIDER_0: 5,  // Portament Time
  SLIDER_1: 73, // Attack Time
  SLIDER_2: 75, // Decay Time
  SLIDER_3: 72, // Release Time
  SLIDER_4: 91, // Reverb
  SLIDER_M: 7,  // Volume
  SW_0: 16,
  SW_1: 17,
  SW_2: 18,
  SW_3: 80,
  SW_4: 81,
  SW_M: 82,
  KNOB_1: 10, // Panpot
  KNOB_2: 76,
  KNOB_3: 77,
  KNOB_4: 78,
  KNOB_5: 74,
  KNOB_6: 71,
  LOWEST_CC: 1,
  HIGHEST_CC: 119
};

// Initialize
function init() {
    // MIDI ports
    host.getMidiInPort(0).setMidiCallback(onMidiPort1);
    host.getMidiInPort(1).setMidiCallback(onMidiPort2);
    generic = host.getMidiInPort(0).createNoteInput("MIDI Keyboard", "??????");
    generic.setShouldConsumeEvents(false);

    // Create host objects
    transport = host.createTransport();
    masterTrack = host.createMasterTrack(512);
    tracks = host.createMainTrackBank(512,512,512);
    cursorTrack = host.createCursorTrackSection(4,5);
}

// Actions for CC events arriving on MIDI port 1
function onMidiPort1(status, data1, data2) {
    if (isChannelController(status)) {
        if (data2 > 0) { // ignore button release
            switch (data1) {
                case JUNOGi.PLAY:
                    transport.play();
                break;

                case JUNOGi.STOP:
                    transport.stop();
                break;

                case JUNOGi.REC:
                    transport.record();
                break;

                case JUNOGi.TOP:
                    transport.setPosition(0);
                break;

                case JUNOGi.REW:
                    transport.rewind();
                break;

                case JUNOGi.FF:
                    transport.fastForward();
                break;

                case JUNOGi.SLIDER_0:
                    cursorTrack.getVolume().set(data2, 128);
                    host.showPopupNotification("Volume: " + data2);
                break;

                case JUNOGi.SLIDER_1:
                    tracks.getTrack(0).getVolume().set(data2, 128);
                    host.showPopupNotification("Track#1 Volume: " + data2);
                break;

                case JUNOGi.SLIDER_2:
                    tracks.getTrack(1).getVolume().set(data2, 128);
                    host.showPopupNotification("Track#2 Volume: " + data2);
                break;

                case JUNOGi.SLIDER_3:
                    tracks.getTrack(2).getVolume().set(data2, 128);
                    host.showPopupNotification("Track#3 Volume: " + data2);
                break;

                case JUNOGi.SLIDER_4:
                    tracks.getTrack(3).getVolume().set(data2, 128);
                    host.showPopupNotification("Track#4 Volume: " + data2);
                break;

                case JUNOGi.SLIDER_M:
                    masterTrack.getVolume().set(data2, 128);
                    host.showPopupNotification("Master Volume: " + data2);
                break;
            }
        }
    }
}
// Actions for CC events arriving on MIDI port 2
function onMidiPort2(status, data1, data2) {
}

function exit() {}
