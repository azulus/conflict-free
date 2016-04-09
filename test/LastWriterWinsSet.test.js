var assert = require('assert');

var LastWriterWinsSet = require('../lib/LastWriterWinsSet');

describe('LastWriterWinsSet', function() {
  var set1, set2, set3;

  it("should add and remove", function() {
    set1 = new LastWriterWinsSet('a');

    set1.add('jeremy');
    assert.equal(set1.getValue().indexOf('jeremy') !== -1, true);

    set1.remove('jeremy');
    assert.equal(set1.getValue().indexOf('jeremy') === -1, true);

    set1.add('jeremy');
    assert.equal(set1.getValue().indexOf('jeremy') !== -1, true);
  });

  it("should reuse data structure where possible", function() {
    var value1, value2, value3;

    set1 = new LastWriterWinsSet('a');
    set2 = new LastWriterWinsSet('b');

    set1.add('a');
    var value1 = set1.getValue();

    set2.add('a');
    set1.merge(set2.getState());
    var value2 = set1.getValue();
    assert.equal(value1, value2);

    set1.add('b');
    value3 = set1.getValue();
    assert.notEqual(value1, value3);
    assert.notEqual(value2, value3);
    assert.equal(value1, value2);

    set1.remove('b');
    value3 = set1.getValue();
    assert.notEqual(value1, value3);
    assert.notEqual(value2, value3);
    assert.equal(value1, value2);
  });

  it("should resolve merges correctly", function() {
    set1 = new LastWriterWinsSet('a');
    set2 = new LastWriterWinsSet('b');
    set3 = new LastWriterWinsSet('c');

    // add to set 1, tell sets 2 and 3
    set1.add('jeremy');
    set2.merge(set1.getState());
    set3.merge(set1.getState());
    assert.equal(set1.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(set2.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(set3.getValue().indexOf('jeremy') !== -1, true);

    // add to set 1, tell sets 2 and 3
    set1.add('testing');
    set2.merge(set1.getState());
    set1.remove('testing');
    set2.remove('testing');
    set1.add('testing');
    assert.equal(set1.getValue().indexOf('testing') !== -1, true);
    assert.equal(set2.getValue().indexOf('testing') === -1, true);
    assert.equal(set3.getValue().indexOf('testing') === -1, true);

    // merging set 1 back into 2 and 3
    set2.merge(set1.getState());
    set3.merge(set1.getState());
    assert.equal(set1.getValue().indexOf('testing') !== -1, true);
    assert.equal(set2.getValue().indexOf('testing') !== -1, true);
    assert.equal(set3.getValue().indexOf('testing') !== -1, true);
  });

  it("should merge deterministically", function() {
    set1 = new LastWriterWinsSet('a');
    set2 = new LastWriterWinsSet('b');

    set1.add('jeremy');
    set2.merge(set1.getState());

    set1.remove('jeremy');
    set1.add('jeremy');
    set2.remove('jeremy');

    var state1 = set1.getState();
    var state2 = set2.getState();
    var now = Date.now();
    state1[0].timestamp = now + 1;
    state2[0].timestamp = now + 2;

    // adjust state timestamps
    set1.merge(state1);
    set2.merge(state2);

    set1.merge(set2.getState());
    set2.merge(set1.getState());
    assert.equal(set1.getValue().indexOf('jeremy'), set2.getValue().indexOf('jeremy'));
  });
});
