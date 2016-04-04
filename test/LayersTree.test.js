var assert = require('assert');

var LayersTree = require('../lib/LayersTree');

describe('LayersTree', function() {
  var tree1, tree2, tree3;

  it("should add and remove", function() {
    tree1 = new LayersTree('a');

    tree1.add('a', null, 5);
    tree1.add('aa', 'a', 5);
    tree1.add('aaa', 'aa', 5);
    tree1.add('ab', 'a', 5);
    tree1.add('aba', 'ab', 5);

    // console.log(tree1.getState());

    tree1.remove('aa');

    // console.log(tree1.getState());

    // counter1.add('jeremy');
    // assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);
    //
    // counter1.add('testing');
    // assert.equal(counter1.getValue().indexOf('jeremy') !== -1, true);
    // assert.equal(counter1.getValue().indexOf('testing') !== -1, true);
  });
});
