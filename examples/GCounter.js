var GCounter = function(ident) {
  this._ident = ident;
  this._values = {};

  this._values[ident] = 0;

  this.value = 0;
  this._recalculateValue();
};

GCounter.prototype.getState = function () {
  return {ident: this._ident, val: this._values[this._ident]};
};

GCounter.prototype._recalculateValue = function () {
  var value = 0;
  for (var key in this._values) {
    value += this._values[key];
  }
  this.value = value;
};

GCounter.prototype.increment = function (amount) {
  this._values[this._ident] += amount;
  this._recalculateValue();
};

GCounter.prototype.merge = function (values) {
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    this._values[value.ident] = value.val;
  }
  this._recalculateValue();
};

module.exports = GCounter;
