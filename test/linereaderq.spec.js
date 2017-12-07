const assert = require('assert');
const expect = require('chai').expect;
const LineReader = require('../lib/linereaderq');

function test(done, tests) {
  try {
    tests();
    done();
  } catch (e) {
    done(e);
  }
}

describe('LineReader', function () {

  describe('export', function () {
    it('should return a single function', function () {
      expect(LineReader).to.be.a('Function');
    });
  });

  describe('lineReader', function () {
    let lr = new LineReader({
    });

    it('should return null when popping before reading', function () {
      expect(lr.pop()).to.be.null;
    });

    it('should return false before reading', function () {
      expect(lr.available()).to.be.false;
    });

    it('should read the first line', function (done) {
      lr.read('./test/test.csv', (lr) => {
        test(done, () => {
          let line = lr.pop();
          console.log(`>> ${line.l}`);
          expect(line.l).to.equal('Jan;Bogaert;5');
          expect(line.i).to.equal(1);
        });
      });
    });

    it('should detect the line break charachter', function (done) {
      let total = 0;
      let firstLine = null;
      let secondLine = null;
      let lineBreak = null;
      lr.read('./test/win.txt', (lr) => {
        if (total == 0) {
          firstLine = lr.pop().l;
          total++;
        }
        if (total == 1) {
          secondLine = lr.pop().l;
          total++;
          lineBreak = lr.lineBreak;
        }
        while (lr.available()) {
          lr.pop();
          total++;
        }
        if (total == 4) {
          test(done, () => {
            expect(firstLine).to.equal('FIRSTLINE');
            expect(secondLine).to.equal('SECONDLINE');
            expect(lineBreak).to.equal('\r\n');
          });
        }
      });
    });

    it('shoud read the full file at some point', function (done) {
      let total = 0;
      let lastLine = null;
      lr.read('./test/test_total.csv', (lr) => {
        //console.log('>> reading');
        while (lr.available()) {
          lastLine = lr.pop();
          total++;
          //console.log(`>> last line ${lastLine.l} on ${lastLine.i} for ${total}`);
          if (total == 2340) {
            test(done, () => {
              expect(lastLine.i).to.equal(2340);
              expect(lastLine.l).to.equal('aaaaaaaaaaaaaaa;bbbbbbbbbbbbbbb;ccccccccccccccc;ddddddddddddddd;999999999999999');
            });
          }
        }
      });
    });

  });

});
