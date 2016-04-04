var assert = require('assert');

var ObservedRemoveSet = require('../lib/ObservedRemoveSet');

describe('ObservedRemoveSet', function() {
  var counter1, counter2, counter3;

  it("should add and remove", function() {
    counter1 = new ObservedRemoveSet('a');

    counter1.add('jeremy');
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);

    counter1.add('jeremy');
    counter1.remove('jeremy');
    assert.equal(counter1.getValue().indexOf('jeremy') === -1, true);
  });

  it("should resolve merges correctly", function() {
    counter1 = new ObservedRemoveSet('a');
    counter2 = new ObservedRemoveSet('b');
    counter3 = new ObservedRemoveSet('c');

    // add to set 1, tell sets 2 and 3
    counter1.add('jeremy');
    counter2.merge(counter1.getState());
    counter3.merge(counter1.getState());
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter2.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter3.getValue().indexOf('jeremy') !== -1, true);

    // remove from set 2, only tell set 1 initially
    counter2.remove('jeremy');
    counter1.merge(counter2.getState());
    assert.equal(counter1.getValue().indexOf('jeremy') === -1, true);
    assert.equal(counter2.getValue().indexOf('jeremy') === -1, true);
    assert.equal(counter3.getValue().indexOf('jeremy') !== -1, true);

    // re-add from set 1, tell sets 2 and 3
    counter1.add('jeremy');
    counter2.merge(counter1.getState());
    counter3.merge(counter1.getState());
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter2.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter3.getValue().indexOf('jeremy') !== -1, true);

    // apply earlier set 2 removal, ensure that key is still visible due to
    // second set 1 added (applied before the removal to set 3)
    counter3.merge(counter2.getState());
    assert.equal(counter3.getValue().indexOf('jeremy') !== -1, true);
  });
});
