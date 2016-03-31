/**
 * 1.) create min and max if needed
 * 2.) Starting at segment 0
 *   a.) generate min and max for segment if needed
 *   b.) check distance between min and max segment value
 *   		1.) if >= 2: pick random point between min+1, max - 1
 *   		2.) else: move to next segment
 */

var KEYSPACE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-'.split('').sort();
var KEYSPACE_MAP = {};
KEYSPACE.forEach(function (char, idx) {
  KEYSPACE_MAP[char] = idx;
});
var KEYSPACE_SIZE = 64;
var KEYSPACE_POWER_2 = 6;
var KEYSPACE_BITMASK = ((1 << KEYSPACE_POWER_2) - 1);

var IDENT_DELIMITER = ':';
var CHUNK_DELIMITER = '/';

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
  return id[0].split(CHUNK_DELIMITER).map(function(chunk) {
    return chunk.split(IDENT_DELIMITER);
  }).concat(id[1]);
}

function stringToNumber(str) {
  var strLen = str.length;
  var num = 0;
  for (var i = 0; i < str.length; i++) {
    num += (Math.pow(KEYSPACE_SIZE, i) * KEYSPACE_MAP[str[strLen - i - 1]]);
  }
  return num;
}

function numberToString(num, size) {
  var newNum = num;
  var vals = Array(size);

  // var n = original_value & ((1 << N) - 1);
  for (var i = 0; i < size; i++) {
    vals[size - i - 1] = KEYSPACE[newNum & KEYSPACE_BITMASK];
    newNum = newNum >> KEYSPACE_POWER_2;
  }

  return vals.join('');
}

function getMax(size) {
  return [numberToString(Math.pow(KEYSPACE_SIZE, size) - 1, size)];
}

function getMin(size) {
  return [numberToString(0, size)];
}

function generate(ident, size, min, max) {
  var minVal, maxVal, prefix;
  if (!min) min = getMin(size);
  if (!max) max = getMax(size);

  if (!compare(min, max)) {
    // swap min into lowest position
    var temp = min;
    min = max;
    max = temp;
  }
  var minComponents = _splitId(min);
  var maxComponents = _splitId(max);

  var idx = 0;
  var minNum = stringToNumber(minComponents[0][0]);
  var maxNum = stringToNumber(maxComponents[0][0]);

  if (maxNum - minNum >= 2) {
    minVal = minNum + 1;
    maxVal = maxNum - 1;
  } else {
    throw new Error('nooo');
  }
  // console.log(minComponents, maxComponents);

  // console.log(minComponents, maxComponents);
  var numericValue = minVal + Math.floor(Math.random() * (maxVal - minVal));
  var randomKey = numberToString(numericValue, size);
  // console.log(numericValue, stringToNumber(randomKey), maxVal - minVal);
  return [randomKey, ident];
}

function stringify(id) {
  return !id[1] ? id[0] : id[0] + IDENT_DELIMITER + id[1];
}

module.exports = {
  generate: generate,
  getMin: getMin,
  getMax: getMax,
  compare: compare,
  stringify: stringify,

  numberToString: numberToString,
  stringToNumber: stringToNumber
};
