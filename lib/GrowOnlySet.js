var GrowOnlySet = function(ident) {
  this._ident = ident;
  this._valuesMap = {};
  this._values = [];
  this._dirty = true;
};

GrowOnlySet.prototype.getState = function () {
  return this.getValue();
};

GrowOnlySet.prototype.merge = function (entries) {
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    this._valuesMap[entry] = true;
  }
  this._dirty = true;
};

GrowOnlySet.prototype.getValue = function () {
  if (this._dirty === true) {
    var _values = Object.keys(this._valuesMap);
    if (this._values.length !== _values.length) {
      this._values = _values;
    }
  }
  return this._values;
};

GrowOnlySet.prototype.add = function (val) {
  this._valuesMap[val] = true;
  this._dirty = true;
};

module.exports = GrowOnlySet;
