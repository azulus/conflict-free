var assert = require('assert');

var IdGenerator = require('../lib/IdGenerator');

describe('GrowOnlySet', function() {
  var min = IdGenerator.getMin(5);
  var max = IdGenerator.getMax(5);

  it("should return valid min and max", function() {
    assert.equal(min, '-----');
    assert.equal(max, 'zzzzz');
  });

  it("should generate id of length", function() {
    var id = IdGenerator.generate('siteA', 5);
    assert.equal(IdGenerator.toString(id).length, 11);
  });

  it("should generate ids between undefined and undefined", function() {
    for (var i = 0; i < 1000; i++) {
      var id = IdGenerator.generate('siteA', 5);
      assert.equal(IdGenerator.compare(min, id), -1);
      assert.equal(IdGenerator.compare(max, id), 1);
    }
  });

  it("should generate ids between undefined and id", function() {

  });

  it("should generate ids between id and undefined", function() {

  });

  it("should generate ids between id and id", function() {

  });

  it("should generate ids between id-siteA and id-siteB", function() {

  });

  it("should generate ids between id-siteA and id", function() {

  });

  it("should generate ids between id and id-siteA", function() {

  });

  it("should generate ids between id-siteA-subId and id-siteA-subId", function() {

  });

  it("should generate ids between id-siteA-subId and id", function() {

  });

});
