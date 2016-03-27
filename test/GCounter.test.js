var assert = require('assert');

var GCounter = require('../examples/GCounter');
var Site = require('../lib/Site');

describe('GCounter', function() {
  var counter1, counter2;

  beforeEach(function() {
    counter1 = new GCounter('a');
    counter2 = new GCounter('b');
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

    counter2.increment(2);

    counter1.merge([counter2.getState()]);
    assert.equal(counter1.value, 9);
  });
});
