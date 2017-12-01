# bigcsv

## Purpose

Little library to parse CSV files. It was created to be able to parse large CSV files (millions of lines). The library consists of 2 components:

* LineReader: A component to read the lines of a file. It uses an internal buffer to store lines untill they are ready to be processed. Reading the file is paused untill the buffer is empty.
* CsvRecordReader: Component to parse a single line of a CSV. It will create objects based on a template.

The 2 components can be used independantly.

## Usage

Imagine a CSV constructed as follows.

<pre>
<code class="csv">
John,Silver,Avenue du prince 24,Paris
Silvia,Janssens,Gemeentehuisstraat 5,Evere
Jessy,Red,Palmtreeroad 9,Miami
</code>
</pre>

<pre>
<code class="javascript">
const {LineReader,CsvRecordReader} = require('bigcsv');

// Create a record reader, configured with a template.
const recordReader = new CsvRecordReader({
  delimiter: ',',
  cleanToNull: true,
  template: [
    { name: "name" },							// the first column will be stored in an attribute named "name"
    null,								// the second column will be ignored
    { name: "street", trans: (val) => { return val.toUpperCase(); } },	// the fourth column will be stored in an attribute named street and its value transformed to uppercase
    { name: "city" }
  ]
});

let lr = new LineReader();
// this starts reading the file and filling the buffer
lr.read(theFile, (lr) => {
  while (lr.available()) {
    var recordObject = recordReader.read(lr.pop());
    // ... do something with the object
  }
});
</code>
</pre>
