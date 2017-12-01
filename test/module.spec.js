const assert = require('assert');
const expect = require('chai').expect;

const { CsvRecordReader, LineReader } = require('../index');

describe('module', function () {

  describe('export', function () {
    it('should return 2 functions', function () {
      expect(LineReader).to.be.a('Function');
      expect(CsvRecordReader).to.be.a('Function');
    });
  });

});
