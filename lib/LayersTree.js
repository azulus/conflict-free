var IdGenerator = require('./IdGenerator');
var LastWriterWinsMap = require('./LastWriterWinsMap');
var LastWriterWinsSet = require('./LastWriterWinsSet');

var ID_LENGTH = 4;

var LayersTree = function(ident) {
  this._ident = ident;

  this._tombstoneSet = new LastWriterWinsSet(ident);
  this._dataMap = new LastWriterWinsMap(ident);
  this._positionMap = new LastWriterWinsMap(ident);

  this._value = undefined;
};

LayersTree.prototype.getState = function () {
  return {
    tombstones: this._tombstoneSet.getState(),
    data: this._dataMap.getState(),
    positions: this._positionMap.getState()
  };
};

LayersTree.prototype._insertValue = function (dataMap, positionMap, valueMap, id, tombstones) {
  if (valueMap[id]) {
    return valueMap[id];
  }

  if (tombstones.indexOf(id) !== -1) {
    this._tombstoneSet.remove(id);
  }

  var pos = positionMap[id];

  valueMap[id] = {
    id: id,
    children: [],
    val: dataMap[id],
    pos: pos.position,
    parent: pos.parent
  };

  if (!!pos.parent) {
    this._insertValue(dataMap, positionMap, valueMap, pos.parent, tombstones).children.push(id);
  }

  return valueMap[id];
};

LayersTree.prototype._composeTree = function (data, ids) {
  var values = [];

  ids.sort(function (a, b) {
    return IdGenerator.compare(data[a].pos, data[b].pos);
  });

  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    values.push({
      id: id,
      data: data[id].val,
      children: this._composeTree(data, data[id].children)
    });
  }
  return values;
};

LayersTree.prototype.getValue = function () {
  if (typeof this._value === 'undefined') {
    var tombstones = this._tombstoneSet.getValue();
    var dataMap = this._dataMap.getValue();
    var positionMap = this._positionMap.getValue();
    var id;

    var tempMap = {};

    for (var id in dataMap) {
      if (tombstones.indexOf(id) === -1) {
        this._insertValue(dataMap, positionMap, tempMap, id, tombstones);
      }
    }

    var rootIds = [];
    for (id in tempMap) {
      if (tempMap[id].parent === null) {
        rootIds.push(id);
      }
    }

    this._value = this._composeTree(tempMap, rootIds);
  }
  return this._value;
};

LayersTree.prototype.merge = function (state) {
  this._tombstoneSet.merge(state.tombstones);
  this._dataMap.merge(state.data);
  this._positionMap.merge(state.positions);
  this._value = undefined;
};

LayersTree.prototype.move = function (id, parentId, startEl, endEl) {
  var positionMapValue = this._positionMap.getValue();
  var startPos = startEl ? positionMapValue[startEl].position : null;
  var endPos = endEl ? positionMapValue[endEl].position : null;
  var pos = IdGenerator.generate(this._ident, ID_LENGTH, startPos, endPos);

  this._positionMap.add(id, {parent: parentId, position: pos});
  this._value = undefined;
};

LayersTree.prototype.update = function (id, data) {
  this._dataMap.add(id, data);
  this._value = undefined;
};

LayersTree.prototype.add = function (id, parentId, data, startEl, endEl) {
  this.move(id, parentId, startEl, endEl);
  this.update(id, data);
  this._tombstoneSet.remove(id);

  this._value = undefined;
};

LayersTree.prototype.remove = function (id) {
  var removeIdx = 0;
  var removeIds = [id];
  var positionMapValue = this._positionMap.getValue();

  // build a reverse map of parents to their children
  var parentMap = {};
  for (var key in positionMapValue) {
    var position = positionMapValue[key];
    if (position.parent) {
      if (!parentMap[position.parent]) {
        parentMap[position.parent] = [];
      }
      parentMap[position.parent].push(key);
    }
  }

  while (removeIdx < removeIds.length) {
    var removeId = removeIds[removeIdx];
    this._tombstoneSet.add(removeId);

    if (parentMap[removeId]) {
      for (var i = 0; i < parentMap[removeId].length; i++) {
        var childId = parentMap[removeId][i];
        if (removeIds.indexOf(childId) === -1) {
          removeIds.push(childId);
        }
      }
    }

    removeIdx++;
  }

  this._value = undefined;
};

module.exports = LayersTree;
