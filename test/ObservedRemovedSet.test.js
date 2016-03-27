var assert = require('assert');

var ObservedRemoveSet = require('../examples/ObservedRemoveSet');
var Site = require('../lib/Site');

describe('ObservedRemoveSet', function() {
  var counter1, counter2;

  it("should add and remove", function() {
    counter1 = new ObservedRemoveSet('a');
    counter2 = new ObservedRemoveSet('b');
    counter3 = new ObservedRemoveSet('b');

    counter1.add('jeremy');
    assert.equal(counter1.values.indexOf('jeremy') !== -1, true);

    counter1.add('jeremy');
    counter1.remove('jeremy');
    assert.equal(counter1.values.indexOf('jeremy') === -1, true);
  });

});
