const Wave = class {
  constructor(audioCtx, document) {
    this.oscillator = audioCtx.createOscillator();
    this.frequency = this.oscillator.frequency;
    this.gain = this.oscillator.gain;
    this.oscillator.start();
    var that = this;
    document.getElementById("wave").addEventListener(
      "change",
      function () {
        that._wave(this);
      },
      false
    );
  }

  _wave(that) {
    this.oscillator.type = that.querySelector(
      'input[name="wave_type"]:checked'
    ).value;
    this.frequency.setValueAtTime(
      parseFloat(that.querySelector(".frequency").value),
      audioCtx.currentTime
    );
  }
};
