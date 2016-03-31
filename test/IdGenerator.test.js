var assert = require('assert');

var IdGenerator = require('../lib/IdGenerator');

var TEST_ITERATIONS = 100;

describe('IdGenerator', function() {
  var min = IdGenerator.getMin(5);
  var max = IdGenerator.getMax(5);

  it("should return valid min and max", function() {
    assert.equal(min, '+++++');
    assert.equal(max, 'zzzzz');
  });

  it("should convert between number and string", function() {
    for (var i = 0; i < TEST_ITERATIONS; i++) {
      var num = Math.floor(Math.random() * (Math.pow(64, 5) - 1))
      var numAsString = IdGenerator.numberToString(num, 5);
      assert.equal(IdGenerator.stringToNumber(numAsString), num);
    }
  });

  it("should generate id of length", function() {
    var id = IdGenerator.generate('siteA', 5);
    assert.equal(IdGenerator.stringify(id).length, 11);
  });

  it("should generate ids between undefined and undefined", function() {
    for (var i = 0; i < TEST_ITERATIONS; i++) {
      var id = IdGenerator.generate('siteA', 5);
      assert.equal(IdGenerator.compare(min, id), -1);
      assert.equal(IdGenerator.compare(max, id), 1);
    }
  });

  it("should generate ids between undefined and id", function() {
    var maxId = IdGenerator.generate('siteA', 5);
    for (var i = 0; i < TEST_ITERATIONS; i++) {
      var id = IdGenerator.generate('siteA', 5, null, maxId);
      assert.equal(IdGenerator.compare(min, id), -1);
      assert.equal(IdGenerator.compare(maxId, id), 1);
    }
  });

  it("should generate ids between id and undefined", function() {
    var minId = IdGenerator.generate('siteA', 5);
    for (var i = 0; i < TEST_ITERATIONS; i++) {
      var id = IdGenerator.generate('siteA', 5, minId, null);
      assert.equal(IdGenerator.compare(minId, id), -1);
      assert.equal(IdGenerator.compare(max, id), 1);
    }
  });

  it("should generate ids between id and id", function() {
    var minId = IdGenerator.generate('siteA', 5);
    var maxId = IdGenerator.generate('siteA', 5, minId, null);
    for (var i = 0; i < TEST_ITERATIONS; i++) {
      var id = IdGenerator.generate('siteA', 5, minId, maxId);
      assert.equal(IdGenerator.compare(minId, id), -1);
      assert.equal(IdGenerator.compare(maxId, id), 1);
    }
  });

  it("should generate ids between id-siteA and id-siteB", function() {
    var minId = IdGenerator.generate('siteA', 5);
    var maxId = [].concat(minId);
    minId[0] += ':siteA';
    maxId[0] += ':siteB';
    for (var i = 0; i < TEST_ITERATIONS; i++) {
      var id = IdGenerator.generate('siteA', 5, minId, maxId);
      assert.equal(IdGenerator.compare(minId, id), -1);
      assert.equal(IdGenerator.compare(maxId, id), 1);
    }
  });
  //
  // it("should generate ids between id-siteA and id", function() {
  //   var minId = IdGenerator.generate('siteA', 5);
  //   minId[0] += ':siteA';
  //   var maxId = IdGenerator.generate('siteA', 5, minId, null);
  //   for (var i = 0; i < TEST_ITERATIONS; i++) {
  //     var id = IdGenerator.generate('siteA', 5, minId, maxId);
  //     assert.equal(IdGenerator.compare(minId, id), -1);
  //     assert.equal(IdGenerator.compare(maxId, id), 1);
  //   }
  // });
  //
  // it("should generate ids between id and id-siteA", function() {
  //   var minId = IdGenerator.generate('siteA', 5);
  //   var maxId = IdGenerator.generate('siteA', 5, minId, null);
  //   maxId[0] += ':siteA';
  //   for (var i = 0; i < TEST_ITERATIONS; i++) {
  //     var id = IdGenerator.generate('siteA', 5, minId, maxId);
  //     assert.equal(IdGenerator.compare(minId, id), -1);
  //     assert.equal(IdGenerator.compare(maxId, id), 1);
  //   }
  // });
  //
  // it("should generate ids between id-siteA-subId and id-siteA-subId", function() {
  //   var minId = IdGenerator.generate('siteA', 5);
  //   var maxId = [].concat(minId);
  //   minId[0] += ':siteA/aaaaa';
  //   maxId[0] += ':siteB/fffff';
  //   for (var i = 0; i < TEST_ITERATIONS; i++) {
  //     var id = IdGenerator.generate('siteA', 5, minId, maxId);
  //     assert.equal(IdGenerator.compare(minId, id), -1);
  //     assert.equal(IdGenerator.compare(maxId, id), 1);
  //   }
  // });
  //
  // it("should generate ids between id/subId and id/subId", function() {
  //   var minId = IdGenerator.generate('siteA', 5);
  //   var maxId = [].concat(minId);
  //   minId[0] += '/aaaaa';
  //   maxId[0] += '/fffff';
  //   for (var i = 0; i < TEST_ITERATIONS; i++) {
  //     var id = IdGenerator.generate('siteA', 5, minId, maxId);
  //     assert.equal(IdGenerator.compare(minId, id), -1);
  //     assert.equal(IdGenerator.compare(maxId, id), 1);
  //   }
  // });

});
