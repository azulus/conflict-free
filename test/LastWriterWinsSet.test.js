var assert = require('assert');

var LastWriterWinsSet = require('../examples/LastWriterWinsSet');
var Site = require('../lib/Site');

describe('LastWriterWinsSet', function() {
  var counter1, counter2, counter3;

  it("should add and remove", function() {
    counter1 = new LastWriterWinsSet('a');

    counter1.add('jeremy');
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);

    counter1.remove('jeremy');
    assert.equal(counter1.getValue().indexOf('jeremy') === -1, true);

    counter1.add('jeremy');
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);
  });

  it("should resolve merges correctly", function() {
    counter1 = new LastWriterWinsSet('a');
    counter2 = new LastWriterWinsSet('b');
    counter3 = new LastWriterWinsSet('c');

    // add to set 1, tell sets 2 and 3
    counter1.add('jeremy');
    counter2.merge(counter1.getState());
    counter3.merge(counter1.getState());
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter2.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter3.getValue().indexOf('jeremy') !== -1, true);

    // add to set 1, tell sets 2 and 3
    counter1.add('testing');
    counter2.merge(counter1.getState());
    counter1.remove('testing');
    counter2.remove('testing');
    counter1.add('testing');
    assert.equal(counter1.getValue().indexOf('testing') !== -1, true);
    assert.equal(counter2.getValue().indexOf('testing') === -1, true);
    assert.equal(counter3.getValue().indexOf('testing') === -1, true);

    // merging counter 1 back into 2 and 3
    counter2.merge(counter1.getState());
    counter3.merge(counter1.getState());
    assert.equal(counter1.getValue().indexOf('testing') !== -1, true);
    assert.equal(counter2.getValue().indexOf('testing') !== -1, true);
    assert.equal(counter3.getValue().indexOf('testing') !== -1, true);
  });
});
