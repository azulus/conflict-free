var assert = require('assert');

var ObservedRemoveSet = require('../examples/ObservedRemoveSet');
var Site = require('../lib/Site');

describe('ObservedRemoveSet', function() {
  var counter1, counter2, counter3;

  it("should add and remove", function() {
    counter1 = new ObservedRemoveSet('a', function (event) {});

    counter1.add('jeremy');
    assert.equal(counter1.values.indexOf('jeremy') !== -1, true);

    counter1.add('jeremy');
    counter1.remove('jeremy');
    assert.equal(counter1.values.indexOf('jeremy') === -1, true);
  });

  it("should resolve merges correctly", function() {
    var counter1Events = [];
    var counter2Events = [];
    var counter3Events = [];

    counter1 = new ObservedRemoveSet('a', function (event) {
      counter1Events.push(event);
    });
    counter2 = new ObservedRemoveSet('b', function (event) {
      counter2Events.push(event);
    });
    counter3 = new ObservedRemoveSet('c', function (event) {
      counter3Events.push(event);
    });

    // add to set 1, tell sets 2 and 3
    counter1.add('jeremy');
    counter2.handle(counter1Events.slice(0));
    counter3.handle(counter1Events.slice(0));
    assert.equal(counter1.values.indexOf('jeremy') !== -1, true);
    assert.equal(counter2.values.indexOf('jeremy') !== -1, true);
    assert.equal(counter3.values.indexOf('jeremy') !== -1, true);

    // remove from set 2, only tell set 1 initially
    counter2.remove('jeremy');
    counter1.handle(counter2Events.slice(0));
    assert.equal(counter1.values.indexOf('jeremy') === -1, true);
    assert.equal(counter2.values.indexOf('jeremy') === -1, true);
    assert.equal(counter3.values.indexOf('jeremy') !== -1, true);

    // re-add from set 1, tell sets 2 and 3
    counter1.add('jeremy');
    counter2.handle(counter1Events.slice(1));
    counter3.handle(counter1Events.slice(1));
    assert.equal(counter1.values.indexOf('jeremy') !== -1, true);
    assert.equal(counter2.values.indexOf('jeremy') !== -1, true);
    assert.equal(counter3.values.indexOf('jeremy') !== -1, true);

    // apply earlier set 2 removal, ensure that key is still visible due to
    // second set 1 added (applied before the removal to set 3)
    counter3.handle(counter2Events.slice(0));
    assert.equal(counter3.values.indexOf('jeremy') !== -1, true);
  });
});
