var IdGenerator = require('./IdGenerator');
var LastWriterWinsMap = require('./LastWriterWinsMap');
var LastWriterWinsSet = require('./LastWriterWinsSet');

var ID_LENGTH = 4;

var LayersTree = function(ident) {
  this._childMap = {};
  this._dataMap = new LastWriterWinsMap(ident);
  this._dirty = false;
  this._flatMap = {};
  this._ident = ident;
  this._positionMap = new LastWriterWinsMap(ident);
  this._tombstoneSet = new LastWriterWinsSet(ident);
  this._treeMap = {};
  this._value = {};

  this._compare = this._compare.bind(this);
};

LayersTree.prototype.getState = function () {
  return {
    tombstones: this._tombstoneSet.getState(),
    data: this._dataMap.getState(),
    positions: this._positionMap.getState()
  };
};

LayersTree.prototype._compare = function (id1, id2) {
  return IdGenerator.compare(this._flatMap[id1].pos.position, this._flatMap[id2].pos.position);
};

LayersTree.prototype._composeTreeNew = function (changedIdMap, id) {
  var _flatMap = this._flatMap;

  if (changedIdMap[id] === true) {
    delete changedIdMap[id];
    this._treeMap[id] = undefined;

    var data = _flatMap[id].data;
    var tombstoned = _flatMap[id].tombstoned;

    var childIds = (this._childMap[id] || []).sort(this._compare);

    var children = [];
    for (var i = 0; i < childIds.length; i++) {
      var child = this._composeTreeNew(changedIdMap, childIds[i]);
      if (typeof child !== 'undefined') {
        children.push(child);
      }
    }

    this._treeMap[id] = tombstoned === false || children.length > 0 ? {
      id: id,
      data: data,
      children: children
    } : undefined;

    if (tombstoned && children.length > 0) {
      this._tombstoneSet.remove(id);
    }
  }
  return this._treeMap[id];
};

LayersTree.prototype._addChild = function (parent, child) {
  if (typeof this._childMap[parent] === 'undefined') {
    this._childMap[parent] = [ child ];
  } else if (this._childMap[parent].indexOf(child) === -1) {
    this._childMap[parent] = [].concat(this._childMap[parent], child);
  }
};

LayersTree.prototype._removeChild = function (parent, child) {
  var children = this._childMap[parent];
  var idx = children.indexOf(child);
  if (idx !== -1) {
    this._childMap[parent] = [].concat(children.slice(0, idx), children.slice(idx + 1));
  }
};

LayersTree.prototype._expandChangedIdMap = function (changedIdMap, positionMap) {
  var testIds = Object.keys(changedIdMap), idx = 0;
  while (idx < testIds.length) {
    var testId = testIds[idx];
    var position = positionMap[testId];

    if (position && position.parent && typeof changedIdMap[position.parent] === 'undefined') {
      changedIdMap[position.parent] = true;
      testIds.push(position.parent);
    }

    idx++;
  }
};

LayersTree.prototype.getValue = function () {
  if (this._dirty === true) {
    var id;
    var tombstones = this._tombstoneSet.getValue();
    var dataMap = this._dataMap.getValue();
    var positionMap = this._positionMap.getValue();

    var changedIdMap = {};

    // determine which elements have changed since the last getValue()
    // and update their cached data
    for (var key in dataMap) {
      var data = dataMap[key];
      var pos = positionMap[key];
      var flattened = this._flatMap[key];
      var isTombstoned = tombstones.indexOf(key) !== -1

      if (typeof flattened === 'undefined' ||
          flattened.pos !== pos ||
          flattened.data !== data ||
          flattened.tombstoned !== isTombstoned) {
        changedIdMap[key] = true;

        if (flattened) {
          if (flattened.pos.parent) {
            changedIdMap[flattened.pos.parent] = true;
          }
          this._removeChild(flattened.pos.parent, key);
        }
        if (pos.parent) {
          changedIdMap[pos.parent] = true;
        }
        this._addChild(pos.parent, key);

        this._flatMap[key] = {
          pos: pos,
          data: data,
          tombstoned: isTombstoned
        };
      }
    }

    this._expandChangedIdMap(changedIdMap, positionMap);

    var rootIds = [];
    for (id in positionMap) {
      if (positionMap[id].parent === null) {
        rootIds.push(id);
      }
    }
    rootIds.sort(this._compare);

    var _value = [];
    for (var i = 0; i < rootIds.length; i++) {
      id = rootIds[i];
      var _item = this._composeTreeNew(changedIdMap, id);
      if (typeof _item !== 'undefined') {
        _value.push(_item);
      }
    }
    this._value = _value;

    this._dirty = false;
  }
  return this._value;
};

LayersTree.prototype.merge = function (state) {
  this._tombstoneSet.merge(state.tombstones);
  this._dataMap.merge(state.data);
  this._positionMap.merge(state.positions);
  this._dirty = true;
};

LayersTree.prototype.move = function (id, parentId, startEl, endEl) {
  var positionMapValue = this._positionMap.getValue();
  var startPos = startEl ? positionMapValue[startEl].position : null;
  var endPos = endEl ? positionMapValue[endEl].position : null;
  var pos = IdGenerator.generate(this._ident, ID_LENGTH, startPos, endPos);

  this._positionMap.add(id, {parent: parentId, position: pos});
  this._dirty = true;
};

LayersTree.prototype.update = function (id, data) {
  this._dataMap.add(id, data);
  this._dirty = true;
};

LayersTree.prototype.add = function (id, parentId, data, startEl, endEl) {
  this.move(id, parentId, startEl, endEl);
  this.update(id, data);
  this._tombstoneSet.remove(id);

  this._dirty = true;
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

  this._dirty = true;
};

module.exports = LayersTree;
