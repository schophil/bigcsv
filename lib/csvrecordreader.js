
function CsvRecordReader(options) {

  this.readLine = (line) => {
    // FIXME: What if delimiter is used in enclosed value?
    return this.readRecord(line.split(options.delimiter));
  };

  this.readRecord = (record) => {
    if (record.length != options.template.length) {
      return null;
    }
    let object = {};
    options.template.forEach((t, i) => {
      if (t) {
        let val = this.cleanVal(record[i]);
        if (typeof t == "string") {
          object[t] = val;
        } else if (t.trans) {
          val = t.trans(val);
          object[t.name] = val;
        }
      } // else skip column
    });
    return object;
  };

  this.cleanVal = (val) => {
    if (val == null) {
      return val;
    }
    if (options.enclosure && val.startsWith(options.enclosure)) {
      val = val.slice(1, val.length - 1);
    }
    if (options.cleanToNull) {
      val = val.trim();
      if (val.length == 0) {
        val = null;
      }
    }
    return val;
  };
}

module.exports = CsvRecordReader;
