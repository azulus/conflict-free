var assert = require('assert');

var LastWriterWinsMap = require('../lib/LastWriterWinsMap');

var delay = function (ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(function() {
      resolve();
    }, ms);
  });
}

describe('LastWriterWinsMap', function() {
  var map1, map2, map3;

  it("should add and remove", function() {
    map1 = new LastWriterWinsMap('a');

    map1.add('jeremy', {name: 'Jeremy'});
    assert.equal(map1.getValue()['jeremy'].name === 'Jeremy', true);

    map1.remove('jeremy');
    assert.equal(typeof map1.getValue()['jeremy'], 'undefined');

    map1.add('jeremy', {name: 'Joe'});
    assert.equal(map1.getValue()['jeremy'].name === 'Joe', true);
  });

  it("should reuse data structure where possible", function() {
    map1 = new LastWriterWinsMap('a');
    map2 = new LastWriterWinsMap('b');

    var value1, value2, value3;

    var obj1 = {name: 'Jeremy'};
    var obj2 = {name: 'Joe'};

    map1.add('jeremy', obj1);
    value1 = map1.getValue();
    map2.merge(map1.getState());
    map2.add('joe', obj2);

    return delay(1)
    .then(function() {
      map1.add('jeremy', obj1);
      assert.equal(map1.getValue(), value1);
      map1.merge(map2.getState());
      value2 = map1.getValue();
      assert.notEqual(value2, value1);
      return delay(1);
    })
    .then(function() {
      map1.merge(map2.getState());
      value3 = map1.getValue();
      map1.add('joe', obj2);
      assert.equal(value3, map1.getValue());
    });
  });

  it("should resolve merges correctly", function() {
    map1 = new LastWriterWinsMap('a');
    map2 = new LastWriterWinsMap('b');
    map3 = new LastWriterWinsMap('c');

    // add to set 1, tell sets 2 and 3
    map1.add('Batman v Superman', {rating: 30});
    map2.merge(map1.getState());
    map3.merge(map1.getState());
    assert.equal(map1.getValue()['Batman v Superman'].rating === 30, true);
    assert.equal(map2.getValue()['Batman v Superman'].rating === 30, true);
    assert.equal(map3.getValue()['Batman v Superman'].rating === 30, true);

    // // add to set 1, tell sets 2 and 3
    map1.add('The Dark Knight Rises', {rating: 70});
    map2.merge(map1.getState());
    map1.remove('The Dark Knight Rises');
    map2.remove('The Dark Knight Rises');
    map1.add('The Dark Knight Rises', {rating: 70});
    assert.equal(map1.getValue()['The Dark Knight Rises'].rating === 70, true);
    assert.equal(typeof map2.getValue()['The Dark Knight Rises'], 'undefined');
    assert.equal(typeof map3.getValue()['The Dark Knight Rises'], 'undefined');

    // merging map 1 back into 2 and 3
    map1.merge(map2.getState());
    map2.merge(map1.getState());
    map3.merge(map1.getState());
    assert.equal(map1.getValue()['The Dark Knight Rises'].rating === 70, true);
    assert.equal(map2.getValue()['The Dark Knight Rises'].rating === 70, true);
    assert.equal(map3.getValue()['The Dark Knight Rises'].rating === 70, true);
  });

  it("should merge deterministically", function() {
    map1 = new LastWriterWinsMap('a');
    map2 = new LastWriterWinsMap('b');

    map1.add('The Dark Knight Rises', {rating: 70});
    map2.merge(map1.getState());

    map1.remove('The Dark Knight Rises');
    map1.add('The Dark Knight Rises', {rating: 70});
    map2.remove('The Dark Knight Rises');

    var state1 = map1.getState();
    var state2 = map2.getState();
    var now = Date.now();
    state1[0].timestamp = now + 1;
    state2[0].timestamp = now + 2;

    // adjust state timestamps
    map1.merge(state1);
    map2.merge(state2);

    map1.merge(map2.getState());
    map2.merge(map1.getState());
    assert.equal(typeof map1.getValue()['The Dark Knight Rises'], typeof map1.getValue()['The Dark Knight Rises']);
  });
});
