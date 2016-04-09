var assert = require('assert');

var ObservedRemoveSet = require('../lib/ObservedRemoveSet');

describe('ObservedRemoveSet', function() {
  var set1, set2, set3;

  it("should add and remove", function() {
    set1 = new ObservedRemoveSet('a');

    set1.add('jeremy');
    assert.equal(set1.getValue().indexOf('jeremy') !== -1, true);

    set1.add('jeremy');
    set1.remove('jeremy');
    assert.equal(set1.getValue().indexOf('jeremy') === -1, true);
  });

  it("should reuse data structure where possible", function() {
    var value1, value2, value3;

    set1 = new ObservedRemoveSet('a');
    set2 = new ObservedRemoveSet('b');

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
    set1 = new ObservedRemoveSet('a');
    set2 = new ObservedRemoveSet('b');
    set3 = new ObservedRemoveSet('c');

    // add to set 1, tell sets 2 and 3
    set1.add('jeremy');
    set2.merge(set1.getState());
    set3.merge(set1.getState());
    assert.equal(set1.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(set2.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(set3.getValue().indexOf('jeremy') !== -1, true);

    // remove from set 2, only tell set 1 initially
    set2.remove('jeremy');
    set1.merge(set2.getState());
    assert.equal(set1.getValue().indexOf('jeremy') === -1, true);
    assert.equal(set2.getValue().indexOf('jeremy') === -1, true);
    assert.equal(set3.getValue().indexOf('jeremy') !== -1, true);

    // re-add from set 1, tell sets 2 and 3
    set1.add('jeremy');
    set2.merge(set1.getState());
    set3.merge(set1.getState());
    assert.equal(set1.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(set2.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(set3.getValue().indexOf('jeremy') !== -1, true);

    // apply earlier set 2 removal, ensure that key is still visible due to
    // second set 1 added (applied before the removal to set 3)
    set3.merge(set2.getState());
    assert.equal(set3.getValue().indexOf('jeremy') !== -1, true);
  });
});
