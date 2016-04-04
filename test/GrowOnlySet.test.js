var assert = require('assert');

var GrowOnlySet = require('../lib/GrowOnlySet');

describe('GrowOnlySet', function() {
  var counter1, counter2, counter3;

  it("should add and remove", function() {
    counter1 = new GrowOnlySet('a');

    counter1.add('jeremy');
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);

    counter1.add('testing');
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter1.getValue().indexOf('testing') !== -1, true);
  });

  it("should resolve merges correctly", function() {
    counter1 = new GrowOnlySet('a');
    counter2 = new GrowOnlySet('b');
    counter3 = new GrowOnlySet('c');

    // add to set 1, tell sets 2 and 3
    counter1.add('jeremy');
    counter2.merge(counter1.getState());
    counter3.merge(counter1.getState());
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter2.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter3.getValue().indexOf('jeremy') !== -1, true);

    // remove from set 2, only tell set 1 initially
    counter2.add('testing');
    counter1.merge(counter2.getState());
    assert.equal(counter1.getValue().indexOf('testing') !== -1, true);
    assert.equal(counter2.getValue().indexOf('testing') !== -1, true);
    assert.equal(counter3.getValue().indexOf('testing') === -1, true);
  });
});
