var assert = require('assert');

var PNCounter = require('../examples/PNCounter');
var Site = require('../lib/Site');

describe('PNCounter', function() {
  beforeEach(function() {
    counter1 = new PNCounter('a');
    counter2 = new PNCounter('b');
  });

  it('should increment single', function () {
    counter1.increment(2);
    assert.equal(counter1.value, 2);

    counter1.increment(3);
    assert.equal(counter1.value, 5);
  });

  it('should merge correctly', function () {
    counter1.increment(3);
    counter2.increment(4);

    counter1.merge([counter2.getState()]);
    assert.equal(counter1.value, 7);

    counter2.merge([counter1.getState()]);
    assert.equal(counter2.value, 7);

    counter2.decrement(2);

    counter1.merge([counter2.getState()]);
    assert.equal(counter1.value, 5);

    counter1.decrement(2);
    counter1.decrement(1);
    counter2.merge([counter1.getState()]);

    assert.equal(counter2.value, 2);
    assert.equal(counter1.value, 2);
  });
});
