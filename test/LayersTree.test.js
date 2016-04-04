var assert = require('assert');

var IdGenerator = require('../lib/IdGenerator');
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
  });
});
