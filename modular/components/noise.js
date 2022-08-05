const Noise = class {
  constructor(audioCtx, document) {
    this.audioCtx = audioCtx;
    this.white = audioCtx.createBufferSource();
    this._white();
    this.white.start();

    this.bufferSize = 4096;

    var that = this;

    this.pink = (function () {
      var b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      var node = audioCtx.createScriptProcessor(that.bufferSize, 1, 1);
      node.onaudioprocess = function (e) {
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < that.bufferSize; i++) {
          var white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11; // (roughly) compensate for gain
          b6 = white * 0.115926;
        }
      };
      return node;
    })();

    this.brown = (function () {
      var lastOut = 0.0;
      var node = audioCtx.createScriptProcessor(that.bufferSize, 1, 1);
      node.onaudioprocess = function (e) {
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < that.bufferSize; i++) {
          var white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // (roughly) compensate for gain
        }
      };
      return node;
    })();

    document.getElementById("noise").addEventListener(
      "change",
      function () {
        that._white(this);
      },
      false
    );
  }

  _white() {
    var bufferSize = 2 * this.audioCtx.sampleRate,
      whiteBuffer = this.audioCtx.createBuffer(
        1,
        bufferSize,
        audioCtx.sampleRate
      ),
      output = whiteBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.white.buffer = whiteBuffer;
    this.white.loop = true;
  }
};
