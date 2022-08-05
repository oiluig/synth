const Lfo = class {
  constructor(audioCtx, document) {
    this.gain = audioCtx.createGain();
    this.oscillator = audioCtx.createOscillator();
    this.oscillator.connect(this.gain.gain);
    this.oscillator.frequency.setValueAtTime(2, audioCtx.currentTime);
    this.oscillator.start();
    var that = this;
    document.getElementById("lfo").addEventListener(
      "change",
      function () {
        that._lfo(this);
      },
      false
    );
  }

  _lfo(that) {
    this.oscillator.type = that.querySelector(
      'input[name="lfo_type"]:checked'
    ).value;
    this.oscillator.frequency.setValueAtTime(
      parseFloat(that.querySelector(".frequency").value),
      audioCtx.currentTime
    );
  }
};
