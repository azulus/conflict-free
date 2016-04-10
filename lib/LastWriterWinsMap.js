var LastWriterWinsMap = function(ident) {
  this._dirty = false;
  this._ident = ident;
  this._values = {};
  this._valuesMap = {};
};

LastWriterWinsMap.prototype.getStateSince = function (timestamp) {
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

LastWriterWinsMap.prototype.getState = function () {
  var state = [];
  var valuesMap = this._valuesMap;
  for (var key in valuesMap) {
    var item = valuesMap[key];
    state.push({
      id: item.id,
      val: item.val,
      flag: item.flag,
      timestamp: item.timestamp,
      ident: item.ident
    });
  }

  return state;
};

LastWriterWinsMap.prototype.merge = function (state) {
  for (var i = 0; i < state.length; i++) {
    var item = state[i];
    var currentItem = this._valuesMap[item.id];
    if (typeof currentItem === 'undefined' ||
        currentItem.timestamp < item.timestamp ||
        (currentItem.ident > item.ident && currentItem.timestamp === item.timestamp)) {
      this._valuesMap[item.id] = {
        id: item.id,
        val: item.val,
        flag: item.flag,
        timestamp: item.timestamp,
        ident: item.ident
      };
    }
  }

  this._dirty = true;
};

LastWriterWinsMap.prototype.getValue = function () {
  if (this._dirty === true) {
    var _changed = false, count = 0;

    var _values = {};
    for (var key in this._valuesMap) {
      var item = this._valuesMap[key];
      if (item.flag === true) {
        _values[item.id] = item.val;
        if (_changed === false && this._values[item.id] !== item.val) {
          _changed = true;
        }
        count++;
      }
    }

    if (_changed === true || Object.keys(this._values).length !== count) {
      this._values = _values;
    }

    this._dirty = false;
  }
  return this._values;
};

LastWriterWinsMap.prototype.add = function (id, val) {
  this._valuesMap[id] = {
    id: id,
    val: val,
    flag: true,
    timestamp: Date.now(),
    ident: this._ident
  };
  this._dirty = true;
};

LastWriterWinsMap.prototype.remove = function (id) {
  this._valuesMap[id] = {
    id: id,
    val: this._valuesMap[id] ? this._valuesMap[id].val : null,
    flag: false,
    timestamp: Date.now(),
    ident: this._ident
  };
  this._dirty = true;
};

module.exports = LastWriterWinsMap;
