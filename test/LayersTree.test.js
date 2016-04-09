var assert = require('assert');

var LayersTree = require('../lib/LayersTree');

var ID_LENGTH = 4;

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
});
