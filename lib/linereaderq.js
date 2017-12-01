var fs = require('fs');

function LineReader(options) {

  this.linesq = []; // queue of lines to be processed
  this.rs = null;   // current read stream

  /**
  * Start reading the lines of the given file.
  * @param file - string
  */
  this.read = (file, toTrigger) => {
    // reset buffer
    this.linesq = [];
    this.rs = null;

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
      //console.log('on data');
      if (chunk == null) {
        return;
      }
      chunk = chunk.toString();

      let lines = this._smartSplit(chunk, '\n');
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
