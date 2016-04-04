var LastWriterWinsSet = require('./LastWriterWinsSet');

var LayersTree = function(ident) {
  this._ident = ident;

  this._tombstoneSet = new LastWriterWinsSet(ident);
  this._dataSet = new LastWriterWinsSet(ident);

  this._value = undefined;
};

LayersTree.prototype.getState = function () {

};

LayersTree.prototype.getValue = function () {
  if (typeof this._value === 'undefined') {

  }
  return this._value;
};

LayersTree.prototype.merge = function (state) {
  for (var i = 0; i < state.length; i++) {

  }
  this._value = undefined;
};

LayersTree.prototype.add = function (id, parentId, position) {

  this._value = undefined;
};

LayersTree.prototype.remove = function (id) {

};

module.exports = LayersTree;
