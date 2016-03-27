var ObservedRemoveSet = function(ident) {
  this._ident = ident;
  this._counter = 0;

  this._versions = {};
  this._values = [];
};

ObservedRemoveSet.prototype.getState = function () {
  var versions = this._versions;
  return Object.keys(this._versions).map(function (key) {
    var versionData = versions[key];
    return {
      v: versionData.val,
      a: Object.keys(versionData.added),
      r: Object.keys(versionData.removed)
    };
  });
};

ObservedRemoveSet.prototype.merge = function (entries) {
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    for (var j = 0; j < entry.a.length; j++) {
      this._add(entry.v, entry.a[j]);
    }

    this._remove(entry.v, entry.r);
  }
  this._values = undefined;
};

ObservedRemoveSet.prototype.getValue = function () {
  if (typeof this._values === 'undefined') {
    this._values = [];
    for (var key in this._versions) {
      var versionData = this._versions[key];
      for (var key in versionData.added) {
        if (typeof versionData.removed[key] === 'undefined') {
          this._values.push(versionData.val);
          continue;
        }
      }
    }
  }
  return this._values;
};

ObservedRemoveSet.prototype._getVersion = function () {
  return this._ident + ':' + this._counter++;
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
  this._values = undefined;
};

ObservedRemoveSet.prototype.remove = function (val) {
  if (!this._versions[val]) return;
  var versions = Object.keys(this._versions[val].added);
  this._remove(val, versions);
  this._values = undefined;
};

module.exports = ObservedRemoveSet;
