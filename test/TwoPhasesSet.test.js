var assert = require('assert');

var TwoPhasesSet = require('../examples/TwoPhasesSet');
var Site = require('../lib/Site');

describe('TwoPhasesSet', function() {
  var counter1, counter2, counter3;

  it("should add and remove", function() {
    counter1 = new TwoPhasesSet('a');

    counter1.add('jeremy');
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);

    counter1.remove('jeremy');
    assert.equal(counter1.getValue().indexOf('jeremy') === -1, true);

    counter1.add('jeremy');
    assert.equal(counter1.getValue().indexOf('jeremy') === -1, true);
  });

  it("should resolve merges correctly", function() {
    counter1 = new TwoPhasesSet('a');
    counter2 = new TwoPhasesSet('b');
    counter3 = new TwoPhasesSet('c');

    // add to set 1, tell sets 2 and 3
    counter1.add('jeremy');
    counter2.merge(counter1.getState());
    counter3.merge(counter1.getState());
    assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter2.getValue().indexOf('jeremy') !== -1, true);
    assert.equal(counter3.getValue().indexOf('jeremy') !== -1, true);

    // add to set 1, tell sets 2 and 3
    counter1.remove('jeremy');
    counter2.merge(counter1.getState());
    counter3.merge(counter1.getState());
    assert.equal(counter1.getValue().indexOf('jeremy') === -1, true);
    assert.equal(counter2.getValue().indexOf('jeremy') === -1, true);
    assert.equal(counter3.getValue().indexOf('jeremy') === -1, true);

    // remove from set 2, only tell set 1 initially
    counter2.add('testing');
    counter1.merge(counter2.getState());
    assert.equal(counter1.getValue().indexOf('testing') !== -1, true);
    assert.equal(counter2.getValue().indexOf('testing') !== -1, true);
    assert.equal(counter3.getValue().indexOf('testing') === -1, true);
  });
});
