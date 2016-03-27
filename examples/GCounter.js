var GCounter = function(ident) {
  this._ident = ident;
  this._values = {};

  this._values[ident] = 0;

  this._value = undefined;
};

GCounter.prototype.getState = function () {
  return {ident: this._ident, val: this._values[this._ident]};
};

GCounter.prototype.getValue = function () {
  if (typeof this._value === 'undefined') {
    var value = 0;
    for (var key in this._values) {
      value += this._values[key];
    }
    this._value = value;
  }
  return this._value;
};

GCounter.prototype.increment = function (amount) {
  this._values[this._ident] += amount;
  this._value = undefined;
};

GCounter.prototype.merge = function (values) {
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    this._values[value.ident] = value.val;
  }
  this._value = undefined;
};

module.exports = GCounter;
