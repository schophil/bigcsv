# bigcsv

## Purpose

Little library to parse CSV files. It was created to be able to parse large CSV files (millions of lines). The library consists of 2 components:

* LineReader: A component to read the lines of a file. It uses an internal buffer to store lines untill they are ready to be processed. Reading the file is paused untill the buffer is empty.
* CsvRecordReader: Component to parse a single line of a CSV. It will create objects based on a template.

The 2 components can be used independently.

## Usage

Imagine a CSV constructed as follows.

```csv
John,Silver,Avenue du prince 24,Paris
Silvia,Janssens,Gemeentehuisstraat 5,Evere
Jessy,Red,Palmtreeroad 9,Miami
```

The folllwing code fragment initializes the needed components.

```javascript
const { CsvRecordReader, LineReader } = require('bigcsv');

// Create a record reader, configured with a template.
const recordReader = new CsvRecordReader({
  delimiter: ',',
  cleanToNull: true,
  template: [
    "name",								// the first column will be stored in an attribute named "name"
    null,								// the second column will be ignored
    { name: "street", trans: (val) => { return val.toUpperCase(); } },	// the fourth column will be stored in an attribute named street and its value transformed to uppercase
    "city"
  ]
});

let lr = new LineReader();
// this starts reading the file and filling the buffer
lr.read(theFile, (lr) => {
  while (lr.available()) {
    var line = lr.pop();
    var recordObject = recordReader.readLine(l.l); // l property contains the actual content of the line
    // ... do something with the object
  }
});
```
