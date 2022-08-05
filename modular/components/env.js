const Env = class {
  constructor(audioCtx, document) {
    this.audioCtx = audioCtx;
    this.env = audioCtx.createGain();
    this.attackTime = 1;
    this.decayTime = 0.7;
    this.sustain = 0.5;
    this.releaseTime = 0.3;

    this.output = new (class {
      param;
      value;

      connect(to) {
        this.value = to.value;
        this.param = to;
      }

      disconnect() {
        delete this.value;
        delete this.param;
      }
    })();

    this.trigger = this;

    var that = this;

    var element = document.getElementById("env");

    element.querySelector(".trigger").addEventListener(
      "click",
      function () {
        that._trigger();
      },
      false
    );

    element.addEventListener(
      "change",
      function () {
        that._env(this);
      },
      false
    );
  }

  _trigger() {
    if (this.output.param == undefined) return;
    var now = this.audioCtx.currentTime;
    this.output.param.cancelScheduledValues(now);
    this.output.param.setValueAtTime(0 * this.output.value, now);
    this.output.param.linearRampToValueAtTime(
      1 * this.output.value,
      now + this.attackTime
    );
    this.output.param.linearRampToValueAtTime(
      this.sustain * this.output.value,
      now + this.attackTime + this.decayTime
    );
    this.output.param.linearRampToValueAtTime(
      0,
      now + this.attackTime + this.decayTime + this.releaseTime
    );
  }

  _env(that) {
    this.attackTime = parseFloat(that.querySelector(".attack").value);
    this.decayTime = parseFloat(that.querySelector(".decay").value);
    this.sustain = parseFloat(that.querySelector(".sustain").value);
    this.releaseTime = parseFloat(that.querySelector(".release").value);
  }
};
