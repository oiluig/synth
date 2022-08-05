const VCA = class {
  constructor(audioCtx, document) {
    this.vca = audioCtx.createGain();
    this.vca.gain.value = 0;
    this.gain = this.vca.gain;

    var that = this;
    document.getElementById("vca").addEventListener(
      "change",
      function () {
        that._vca(this);
      },
      false
    );
  }

  _vca(that) {
    this.gain.value = parseFloat(that.querySelector(".gain").value);
  }
};
