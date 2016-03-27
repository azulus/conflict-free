var ObservedRemoveSet = function(ident, emitter) {
  this._ident = ident;
  this._emitter = emitter;
  this._counter = 0;

  this._versions = {};
  this.values = [];
};

ObservedRemoveSet.prototype._getVersion = function () {
  return this._ident + ':' + this._counter++;
};

ObservedRemoveSet.prototype.on = function (evt) {
  if (evt.type === 'add') {
    this._add(evt.val, evt.version);
  } else if (evt.type === 'remove') {
    this._remove(evt.val, evt.versions);
  }
};

ObservedRemoveSet.prototype._add = function (val, version) {
  if (typeof this._versions[val] === 'undefined') {
    this._versions[val] = {
      val: val,
      added: {},
      removed: {}
    };
  }
  this._versions[val].added[version] = true;
}

ObservedRemoveSet.prototype._remove = function (val, versions) {
  if (typeof this._versions[val] === 'undefined') {
    this._versions[val] = {
      val: val,
      added: {},
      removed: {}
    };
  }
  for (var i = 0; i < versions.length; i++) {
    this._versions[val].removed[versions[i]] = true;
  }
}

ObservedRemoveSet.prototype.add = function (val) {
  var version = this._getVersion();
  this._add(val, version);
  this._recalculateValues();
  this._emitter({type: 'add', version: version, val: val});
};

ObservedRemoveSet.prototype.remove = function (val) {
  if (!this._versions[val]) return;
  var versions = Object.keys(this._versions[val].added);
  this._remove(val, versions);
  this._recalculateValues();
  this._emitter({type: 'remove', versions: versions, val: val});
};

ObservedRemoveSet.prototype._recalculateValues = function () {
  this.values = [];
  for (var key in this._versions) {
    var versionData = this._versions[key];
    for (var key in versionData.added) {
      if (typeof versionData.removed[key] === 'undefined') {
        this.values.push(versionData.val);
        continue;
      }
    }
  }
};

ObservedRemoveSet.prototype.handle = function (events) {
  for (var i = 0; i < events.length; i++) {
    this.on(events[i]);
  }
  this._recalculateValues();
};

module.exports = ObservedRemoveSet;
