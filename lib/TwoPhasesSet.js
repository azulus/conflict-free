var TwoPhasesSet = function(ident) {
  this._ident = ident;
  this._addedMap = {};
  this._removedMap = {};
  this._values = [];
};

TwoPhasesSet.prototype.getState = function () {
  return {
    a: Object.keys(this._addedMap),
    r: Object.keys(this._removedMap)
  };
};

TwoPhasesSet.prototype.merge = function (state) {
  var i;
  for (i = 0; i < state.a.length; i++) {
    this._addedMap[state.a[i]] = true;
  }
  for (i = 0; i < state.r.length; i++) {
    this._removedMap[state.r[i]] = true;
  }
  this._values = undefined;
};

TwoPhasesSet.prototype.getValue = function () {
  if (typeof this._values === 'undefined') {
    this._values = [];
    for (var key in this._addedMap) {
      if (typeof this._removedMap[key] === 'undefined') {
        this._values.push(key);
      }
    }
  }
  return this._values;
};

TwoPhasesSet.prototype.add = function (val) {
  this._addedMap[val] = true;
  this._values = undefined;
};

TwoPhasesSet.prototype.remove = function (val) {
  this._removedMap[val] = true;
  this._values = undefined;
};

module.exports = TwoPhasesSet;
