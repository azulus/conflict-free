/*
Tree to represent multiple layers/groups in an editor application. Layers/groups
may be moved between parents, have an order within their parent, and cause their
parents to reappear if they've been orphaned
*/


var LayersTree = function(ident) {
  this._ident = ident;

  this._layerData = {};
  this._value = undefined;
};

LayersTree.prototype.getState = function () {
  var state = [];
  for (var key in this._layerData) {
    var layer = this._layerData[key];
    if (layer.tombstone) {
      state.push({
        id: key,
        ident: layer.ident,
        timestamp: layer.timestamp,
        tombstone: true
      });
    } else {
      state.push({
        id: key,
        ident: layer.ident,
        pos: layer.pos,
        parent: layer.parent,
        timestamp: layer.timestamp
      });
    }
  }
  return state;
};

LayersTree.prototype.getValue = function () {
  if (typeof this._value === 'undefined') {

  }
  return this._value;
};

LayersTree.prototype.merge = function (state) {
  for (var i = 0; i < state.length; i++) {
    var layer = state[i];
    var currentLayer = this._layerData[layer.id];

    // new layer added
    //
    // layer was remotely tombstoned
    //
    // layer was locally tombstoned
    //
    // layer has changes in both places

    if (typeof currentLayer === 'undefined') {
      // new layer was added
      this.layerData[layer.id] = layer;

    } else if (currentLayer.tombstone !== layer.tombstone) {
      

    } else if (currentLayer.timestamp < layer.timestamp ||
        currentLayer.ident > layer.ident) {
      // layer has changes in both places, take most recent
      this.layerData[layer.id] = layer
    }
  }
  this._value = undefined;
};

LayersTree.prototype.add = function (id, parentId, position) {
  this._layerData[id] = {
    ident: this._ident,
    parent: parentId,
    pos: position,
    timestamp: Date.now()
  };
  this._value = undefined;
};

LayersTree.prototype._remove = function (id) {
  var layer = this._layerData[id];
  layer.tombstone = true;
  layer.timestamp = Date.now();

  for (var key in this._layerData) {
    var layer = this._layerData[key];
    if (layer.parent === id && layer.tombstone !== true) {
      this._remove(key);
    }
  }
};

LayersTree.prototype.remove = function (id) {
  this._remove(id);
  this._value = undefined;
};

module.exports = LayersTree;
