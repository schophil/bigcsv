var fs = require('fs');

function LineReader(options) {

  this.linesq = []; // queue of lines to be processed
  this.rs = null;   // current read stream
  this.lineBreak = null;  // the line break character to use

  /**
  * Start reading the lines of the given file.
  * @param file - string
  */
  this.read = (file, toTrigger) => {
    // reset buffer
    this.linesq = [];
    this.rs = null;
    this.lineBreak = null;

    let lineIndex = 1;
    let last = null;

    this.rs = fs.createReadStream(file);
    this.rs.on('end', () => {
      //console.log('on end');
      if (last != null) {
        this.linesq.push({
          l: last,
          i: lineIndex++
        });
        last = null;
        this.rs = null;
        // is this ok?
        if (toTrigger) {
          toTrigger(this);
        }
      }
    });
    this.rs.on('data', (chunk) => {
      if (chunk == null) {
        return;
      }
      chunk = chunk.toString();
      //console.log('on data', chunk);

      let lines = null;
      if (!this.lineBreak) {
        // try to detrmine line break character
        let guess = this._guessLineBreak(chunk);
        if (!guess) {
          // line break is not yet discovered; treat the whole chunk as one line
          lines = [chunk];
        } else {
          this.lineBreak = guess;
        }
      }

      // this means the line break is known and we can split accordingly
      if (!lines) {
        lines = this._smartSplit(chunk, this.lineBreak);
      }

      let lastIndex = lines.chunks.length - 1;
      lines.chunks.forEach((line, idx) => {
        if (idx == 0 && last != null) {
          //console.log(`Reassembled line ${last + line} on ${lineIndex}`);
          this.linesq.push({
            l: last + line,
            i: lineIndex++
          });
          last = null;
        } else if (idx == lastIndex && !lines.end) {
          last = line;
        } else {
          // regular line
          //console.log(`Buffering line ${line} on ${lineIndex}`);
          this.linesq.push({
            l: line,
            i: lineIndex++
          });
        }
      });

      //console.log('Pause file stream');
      this.rs.pause();

      // is this ok?
      if (toTrigger) {
        toTrigger(this);
      }

    });
  };

  this._guessLineBreak = (data) => {
    if (data.indexOf('\r\n') >= 0) {
      //console.log('DETECTED CRLF');
      return '\r\n';
    } else if (data.indexOf('\n') >= 0) {
      //console.log('DETECTED LF');
      return '\n';
    }
    return null;
  };

  this.size = () => {
    return this.linesq.length;
  };

  this.available = () => {
    return this.size() > 0;
  };

  this.pop = () => {
    let el = null;
    if (this.linesq.length > 0) {
      el = this.linesq.shift();
    }

    if (this.linesq.length == 0 && this.rs) {
      //console.log('Resume file stream');
      this.rs.resume();
    }
    return el;
  };

  this._smartSplit = (text, splitter) => {
    let result = {
      chunks: text.split(splitter),
      end: false
    };
    if (text.endsWith(splitter)) {
      result.chunks.pop(); // will be empty
      result.end = true;
    }
    return result;
  };
}

module.exports = LineReader;
