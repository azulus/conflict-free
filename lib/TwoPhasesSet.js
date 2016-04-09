var TwoPhasesSet = function(ident) {
  this._addedMap = {};
  this._dirty = false;
  this._ident = ident;
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
  this._dirty = true;
};

TwoPhasesSet.prototype.getValue = function () {
  if (this._dirty === true) {
    var _values = [], idx = 0;
    var _changed = false;

    for (var key in this._addedMap) {
      if (typeof this._removedMap[key] === 'undefined') {
        _values.push(key);
        if (_changed === false && this._values[idx++] !== key) {
          _changed = true;
        }
      }
    }

    if (_changed === true || _values.length !== this._values.length) {
      this._values = _values;
    }

    this._dirty = false;
  }
  return this._values;
};

TwoPhasesSet.prototype.add = function (val) {
  this._addedMap[val] = true;
  this._dirty = true;
};

TwoPhasesSet.prototype.remove = function (val) {
  this._removedMap[val] = true;
  this._dirty = true;
};

module.exports = TwoPhasesSet;
