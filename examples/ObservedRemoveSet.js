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


// A adds key 1 and sends to B and C
// B removes key 1 and sends to A, C on 5 second delay
// A readds key 1 and sends to B and C
//

ObservedRemoveSet.prototype.on = function (event) {
  if (event.type === 'add') {

  } else if (event.type === 'remove') {

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

ObservedRemoveSet.prototype.add = function (val, version) {
  this._add(val, this._getVersion());
  this._recalculateValues();
  // emitter({type: 'add', ident: (this._ident + ':' + this._counter), val: val});
};

ObservedRemoveSet.prototype.remove = function (val) {
  if (!this._versions[val]) return;
  this._remove(val, Object.keys(this._versions[val].added));
  this._recalculateValues();
  // emitter({type: 'remove', versions: [].concat(this._versions[val].added), val: val});
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
