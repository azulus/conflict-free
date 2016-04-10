var LastWriterWinsSet = function(ident) {
  this._dirty = false;
  this._ident = ident;
  this._values = [];
  this._valuesMap = {};
};

LastWriterWinsSet.prototype.getStateSince = function (timestamp) {
  var state = [];
  var valuesMap = this._valuesMap;
  for (var key in valuesMap) {
    var item = valuesMap[key];
    if (item.timestamp >= timestamp) {
      state.push({
        id: item.id,
        val: item.val,
        flag: item.flag,
        timestamp: item.timestamp,
        ident: item.ident
      });
    }
  }

  return state;
};

LastWriterWinsSet.prototype.getState = function () {
  var state = [];
  var valuesMap = this._valuesMap;
  for (var key in valuesMap) {
    var item = valuesMap[key];
    state.push({
      val: item.val,
      flag: item.flag,
      timestamp: item.timestamp,
      ident: item.ident
    });
  }

  return state;
};

LastWriterWinsSet.prototype.merge = function (state) {
  for (var i = 0; i < state.length; i++) {
    var item = state[i];
    var currentItem = this._valuesMap[item.val];
    if (typeof currentItem === 'undefined' ||
        currentItem.timestamp < item.timestamp ||
        (currentItem.ident > item.ident && currentItem.timestamp === item.timestamp)) {
      this._valuesMap[item.val] = {
        val: item.val,
        flag: item.flag,
        timestamp: item.timestamp,
        ident: item.ident
      };
    }
  }
  this._dirty = true;
};

LastWriterWinsSet.prototype.getValue = function () {
  if (this._dirty === true) {
    var _changed = false, idx = 0;
    var _values = [];

    for (var key in this._valuesMap) {
      var item = this._valuesMap[key];
      if (item.flag === true) {
        _values.push(item.val);
        if (_changed === false && this._values[idx++] !== item.val) {
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

LastWriterWinsSet.prototype.add = function (val) {
  this._valuesMap[val] = {
    val: val,
    flag: true,
    timestamp: Date.now(),
    ident: this._ident
  };
  this._dirty = true;
};

LastWriterWinsSet.prototype.remove = function (val) {
  this._valuesMap[val] = {
    val: val,
    flag: false,
    timestamp: Date.now(),
    ident: this._ident
  };
  this._dirty = true;
};

module.exports = LastWriterWinsSet;
