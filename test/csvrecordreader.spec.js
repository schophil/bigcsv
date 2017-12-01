const assert = require('assert');
const expect = require('chai').expect;
const CsvRecordReader = require('../lib/csvrecordreader');

describe('CsvRecordReader', function () {

  describe('module', function () {
    it('should export one function', function () {
      expect(CsvRecordReader).to.be.a('Function');
    });
  });

  describe('reading a line', function () {
    it('should return an object with properties', function () {
      let r = new CsvRecordReader({
        delimiter: ';',
        template: [ 'name', 'givenName' ]
      });

      let o = r.readLine('joshua;anthony');
      expect(o).to.be.a('Object');
      expect(o.name).to.equal('joshua');
      expect(o.givenName).to.equal('anthony');
    });

    it('should ignore unmapped columns', function () {
      let r = new CsvRecordReader({
        delimiter: ';',
        template: [ 'name', null, 'givenName' ]
      });

      let o = r.readLine('joshua;10;anthony');
      expect(o).to.be.a('Object');
      expect(o.name).to.equal('joshua');
      expect(o.givenName).to.equal('anthony');
    });

    it('should strip enclosure characters', function () {
      let r = new CsvRecordReader({
        delimiter: ';',
        enclosure: '"',
        template: [ 'name', null, 'givenName' ]
      });

      let o = r.readLine('"joshua";"5";"anthony"');
      expect(o).to.be.a('Object');
      expect(o.name).to.equal('joshua');
      expect(o.givenName).to.equal('anthony');
    });

    it('should transform values if requested', function () {
      let r = new CsvRecordReader({
        delimiter: ';',
        enclosure: '"',
        template: [
          { name: 'name', trans: (val) => { return val.toUpperCase(); } },
          'givenName'
        ]
      });

      it('should return an object with properties with enclosure chars stripped', function () {
        let o = r.readLine('"joshua";"anthony"');
        expect(o).to.be.a('Object');
        expect(o.name).to.equal('JOSHUA');
        expect(o.givenName).to.equal('anthony');
      });
    });
  });

});
