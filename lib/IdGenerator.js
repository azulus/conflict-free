var KEYSPACE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-'.split('').sort();
var KEYSPACE_SIZE = 64;
var KEYSPACE_POWER_2 = 6;
var KEYSPACE_BITMASK = ((1 << KEYSPACE_POWER_2) - 1);
var DELIMITER = '+';

function compare(id1, id2) {
  if (id1[0] !== id2[0]) return id1[0] < id2[0] ? -1 : 1;
  if (id1[1] !== id2[1]) {
    if (typeof id1[1] === 'undefined') {
      // MIN
      return -1;
    } else if (typeof id2[1] === 'undefined') {
      // MAX
      return 1;
    }
    return id1[1] < id2[1] ? -1 : 1
  };
  return 0;
}

function _splitId(id) {
  return id[0].split(DELIMITER).concat(id[1]);
}

function _toIdKey(num, size) {
  var newNum = num;
  var vals = Array(size);

  // var n = original_value & ((1 << N) - 1);
  for (var i = 0; i < size; i++) {
    vals[size - i - 1] = KEYSPACE[newNum & KEYSPACE_BITMASK];
    newNum = newNum >> KEYSPACE_POWER_2;
  }

  return vals.join('');
}

function generate(ident, size, min, max) {
  var prefix = '';
  var minVal = 0;
  var maxVal = Math.pow(KEYSPACE_SIZE, size);
  var bitMask = ((1 << KEYSPACE_POWER_2) - 1);
  var randomKey = _toIdKey(minVal + Math.floor(Math.random() * maxVal), size);

  return [ident, randomKey];
}

function toString(id) {
  return id[0] + '+' + id[1];
}

function getMax(size) {
  return [_toIdKey(Math.pow(KEYSPACE_SIZE, size) - 1, size)];
}

function getMin(size) {
  return [_toIdKey(0, size)];
}

module.exports = {
  generate: generate,
  getMin: getMin,
  getMax: getMax,
  compare: compare,
  toString: toString
};
