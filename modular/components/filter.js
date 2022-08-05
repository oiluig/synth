const Filter = class {
  constructor(audioCtx, document) {
    this.audioCtx = audioCtx;
    this.filter = audioCtx.createBiquadFilter();
    this.frequency = this.filter.frequency;
    this.gain = this.filter.gain;
    this.Q = this.filter.Q;

    var that = this;
    document.getElementById("filter").addEventListener(
      "change",
      function () {
        that._filter(this);
      },
      false
    );
  }

  _filter(that) {
    this.filter.type = that.querySelector("#filter_type").value;
    this.Q.value = parseFloat(that.querySelector(".q").value);

    this.frequency.setValueAtTime(
      parseFloat(that.querySelector(".frequency").value),
      this.audioCtx.currentTime
    );

    this.gain.value = parseFloat(that.querySelector(".gain").value);
  }
};
