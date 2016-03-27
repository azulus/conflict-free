var PNCounter = function(ident) {
  this._ident = ident;
  this._values = {};

  this._values[ident] = {p: 0, n: 0};

  this.value = 0;
  this._recalculateValue();
};

PNCounter.prototype.getState = function () {
  var value = this._values[this._ident];

  return {ident: this._ident, p: value.p, n: value.n};
};

PNCounter.prototype._recalculateValue = function () {
  var value = 0;
  for (var key in this._values) {
    value += this._values[key].p - this._values[key].n;
  }
  this.value = value;
};

PNCounter.prototype.increment = function (amount) {
  this._values[this._ident].p += amount;
  this._recalculateValue();
};

PNCounter.prototype.decrement = function (amount) {
  this._values[this._ident].n += amount;
  this._recalculateValue();
};

PNCounter.prototype.merge = function (values) {
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    this._values[value.ident] = {p: value.p, n: value.n};
  }
  this._recalculateValue();
};

module.exports = PNCounter;
