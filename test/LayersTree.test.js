var assert = require('assert');

var LayersTree = require('../lib/LayersTree');

var ID_LENGTH = 4;

var delay = function (ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(function() {
      resolve();
    }, ms);
  });
}

describe('LayersTree', function() {
  var tree1, tree2, tree3, value;
  
  it("should contruct tree", function() {
    tree1 = new LayersTree('a');

    tree1.add('a', null, {name: 'Root Layer'});

    tree1.add('aa', 'a', {name: 'Backgrounds'});
    tree1.add('aac', 'aa', {name: 'Text'});
    tree1.add('aab', 'aa', {name: 'Circles'}, null, 'aac');
    tree1.add('aaa', 'aa', {name: 'Logo'}, 'aab', 'aac');

    tree1.add('ac', 'a', {name: 'Details'}, 'aa', null);
    tree1.add('aca', 'ac', {name: 'Items'});

    tree1.add('ab', 'a', {name: 'Mapping'}, 'aa', 'ac');
    tree1.add('aba', 'ab', {name: 'Building'});
    tree1.add('abac', 'aba', {name: 'Sitting Room'});
    tree1.add('abab', 'aba', {name: 'Kitchen'}, null, 'abac');
    tree1.add('abaa', 'aba', {name: 'Entryway'}, null, 'abab');

    value = tree1.getValue();
    assert.equal(value[0].data.name, 'Root Layer');

    assert.equal(value[0].children[0].data.name, 'Backgrounds');
    assert.equal(value[0].children[1].data.name, 'Mapping');
    assert.equal(value[0].children[2].data.name, 'Details');

    assert.equal(value[0].children[0].children[0].data.name, 'Circles');
    assert.equal(value[0].children[0].children[1].data.name, 'Logo');
    assert.equal(value[0].children[0].children[2].data.name, 'Text');

    assert.equal(value[0].children[1].children[0].data.name, 'Building');

    assert.equal(value[0].children[1].children[0].children[0].data.name, 'Entryway');
    assert.equal(value[0].children[1].children[0].children[1].data.name, 'Kitchen');
    assert.equal(value[0].children[1].children[0].children[2].data.name, 'Sitting Room');

    assert.equal(value[0].children[2].children[0].data.name, 'Items');
  });

  it("should delete recursively", function() {
    tree1 = new LayersTree('a');

    tree1.add('a', null, {name: 'Root Layer'});

    tree1.add('aa', 'a', {name: 'Backgrounds'});
    tree1.add('aac', 'aa', {name: 'Text'});
    tree1.add('aab', 'aa', {name: 'Circles'}, null, 'aac');
    tree1.add('aaa', 'aa', {name: 'Logo'}, 'aab', 'aac');

    tree1.add('ac', 'a', {name: 'Details'}, 'aa', null);
    tree1.add('aca', 'ac', {name: 'Items'});

    tree1.add('ab', 'a', {name: 'Mapping'}, 'aa', 'ac');
    tree1.add('aba', 'ab', {name: 'Building'});
    tree1.add('abac', 'aba', {name: 'Sitting Room'});
    tree1.add('abab', 'aba', {name: 'Kitchen'}, null, 'abac');
    tree1.add('abaa', 'aba', {name: 'Entryway'}, null, 'abab');

    tree1.remove('ab');

    value = tree1.getValue();
    assert.equal(value[0].children.length, 2);
    assert.equal(value[0].children[0].id, 'aa');
    assert.equal(value[0].children[1].id, 'ac');
  });

  it("should resolve merges correctly", function(done) {
    tree1 = new LayersTree('a');
    tree2 = new LayersTree('b');
    tree3 = new LayersTree('c');

    delay(0)
    .then(function () {
      // initial setup
      tree1.add('a', null, {name: 'Layer A'});
      tree1.add('b', null, {name: 'Layer B'}, 'a');
      tree1.add('aa', 'a', {name: 'Child Layer'});
      tree2.merge(tree1.getState());
      tree3.merge(tree1.getState());
      return delay(2);
    })
    .then(function () {
      tree1.add('aaa', 'aa', {name: 'Child Child Layer'});
      return delay(2);
    })
    .then(function () {
      tree2.remove('aa');
      return delay(2);
    })
    .then(function () {
      tree3.move('aa', 'b');
      return delay(2);
    })
    .then(function () {
      tree1.merge(tree2.getState());
      tree1.merge(tree3.getState());
      tree2.merge(tree1.getState());
      tree3.merge(tree1.getState());
      return delay(2);
    })
    .then(function () {
      var value1 = tree1.getValue();
      var value2 = tree2.getValue();
      var value3 = tree3.getValue();

      assert.equal(JSON.stringify(value1), JSON.stringify(value2));
      assert.equal(JSON.stringify(value1), JSON.stringify(value3));

      assert.equal(value1.length, 2);
      assert.equal(value1[0].id, 'a');
      assert.equal(value1[1].id, 'b');

      assert.equal(value1[0].children.length, 0);
      assert.equal(value1[1].children.length, 1);
      assert.equal(value1[1].children[0].id, 'aa');
    })
    .then(done);
  });
});
