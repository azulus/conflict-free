var GrowOnlySet = function(ident) {
  this._ident = ident;
  this._valuesMap = {};
  this._values = [];
};

GrowOnlySet.prototype.getState = function () {
  return this.getValue();
};

GrowOnlySet.prototype.merge = function (entries) {
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    this._valuesMap[entry] = true;
  }
  this._values = undefined;
};

GrowOnlySet.prototype.getValue = function () {
  if (typeof this._values === 'undefined') {
    this._values = Object.keys(this._valuesMap);
  }
  return this._values;
};

GrowOnlySet.prototype.add = function (val) {
  this._valuesMap[val] = true;
  this._values = undefined;
};

module.exports = GrowOnlySet;
