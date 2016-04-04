var PositiveNegativeCounter = function(ident) {
  this._ident = ident;
  this._values = {};

  this._values[ident] = {p: 0, n: 0};

  this._value = undefined;
};

PositiveNegativeCounter.prototype.getState = function () {
  var value = this._values[this._ident];

  return {ident: this._ident, p: value.p, n: value.n};
};

PositiveNegativeCounter.prototype.getValue = function () {
  if (typeof this._value === 'undefined') {
    var value = 0;
    for (var key in this._values) {
      value += this._values[key].p - this._values[key].n;
    }
    this._value = value;
  }
  return this._value;
};

PositiveNegativeCounter.prototype.increment = function (amount) {
  this._values[this._ident].p += amount;
  this._value = undefined;
};

PositiveNegativeCounter.prototype.decrement = function (amount) {
  this._values[this._ident].n += amount;
  this._value = undefined;
};

PositiveNegativeCounter.prototype.merge = function (values) {
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    this._values[value.ident] = {p: value.p, n: value.n};
  }
  this._value = undefined;
};

module.exports = PositiveNegativeCounter;
