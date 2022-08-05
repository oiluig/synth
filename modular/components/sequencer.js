const Sequencer = class {
  currentNote = 0;
  nextNoteTime = 0.0;
  timerID;
  lookahead = 25.0;
  scheduleAheadTime = 0.1;
  notesInQueue = [];
  constructor(audioCtx, document) {
    this.audioCtx = audioCtx;
    this.isPlaying = false;
    this.tempo = 60.0;
    this.currentNote = 0;
    this.nextNoteTime = 0.0;
    this.timerID;
    this.lookahead = 25;
    this.scheduleAheadTime = 0.1;
    this.output = new (class {
      param;

      connect(to) {
        this.param = to;
      }

      disconnect() {
        delete this.param;
      }
    })();

    this.clock = new (class {
      param;

      connect(to) {
        this.param = to;
      }

      disconnect() {
        delete this.param;
      }
    })();

    this.notesInQueue = [
      400, 900, 200, 100, 300, 300, 400, 300, 400, 900, 200, 100, 300, 300, 400,
      300,
    ];

    this.beats = document
      .getElementById("sequencer")
      .querySelectorAll(".schedule .beat");

    var that = this;
    document.getElementById("sequencer").addEventListener(
      "change",
      function () {
        that._sequencer(this);
      },
      false
    );
  }

  _nextNote() {
    const secondsPerBeat = 60.0 / this.tempo;

    this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    // Advance the beat number, wrap to zero when reaching 16
    this.currentNote = (this.currentNote + 1) % 16;
  }

  _scheduleNote(beatNumber, time) {
    // Push the note on the queue, even if we're not playing.
    //this.notesInQueue.push({ note: beatNumber, time: time });
    if (this.clock.param != undefined) this.clock.param._trigger();

    if (this.output.param != undefined)
      this.output.param.value = this.notesInQueue[beatNumber];

    for (const [key, beat] of Object.entries(this.beats)) {
      if (key != beatNumber) {
        if (!beat.classList.contains("bg-black"))
          beat.classList.add("bg-black");
        if (beat.classList.contains("bg-green-200"))
          beat.classList.remove("bg-green-200");
      } else {
        if (beat.classList.contains("bg-black"))
          beat.classList.remove("bg-black");
        if (!beat.classList.contains("bg-green-200"))
          beat.classList.add("bg-green-200");
      }
    }
  }

  _scheduler(that) {
    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (that.nextNoteTime < audioCtx.currentTime + that.scheduleAheadTime) {
      that._scheduleNote(that.currentNote, that.nextNoteTime);
      that._nextNote();
    }

    that.timerID = setTimeout(function () {
      that._scheduler(that);
    }, that.lookahead);
  }

  _sequencer(that) {
    this.tempo = that.querySelector(".tempo").value;

    if (this.isPlaying == (that.querySelector(".play:checked") != undefined))
      return;

    if ((this.isPlaying = that.querySelector(".play:checked") != undefined)) {
      this.currentNote = 0;
      this.nextNoteTime = this.audioCtx.currentTime;

      this._scheduler(this);
    } else {
      clearTimeout(this.timerID);
    }
  }
};
