/**
aaaa === aaaa:siteA
aaaa:siteA < aaaa:siteB
aaaa:siteA < aaaa:siteA/bbbb
aaaa:siteA < aaaa:siteB/bbbb
aaaa/bbbb:siteA < aaaa:siteB
 */

var KEYSPACE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-'.split('').sort();
var KEYSPACE_MAP = {};
KEYSPACE.forEach(function (char, idx) {
  KEYSPACE_MAP[char] = idx;
});
var KEYSPACE_SIZE = 64;
var KEYSPACE_POWER_2 = 6;
var KEYSPACE_BITMASK = ((1 << KEYSPACE_POWER_2) - 1);

var IDENT_DELIMITER = '!';
var CHUNK_DELIMITER = '/';

function compare(id1, id2) {
  var str1 = stringify(id1);
  var str2 = stringify(id2);
  if (str1 === str2) return 0;
  return str1 < str2 ? -1 : 1;
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
  return [numberToString(Math.pow(KEYSPACE_SIZE, size) - 1, size), null];
}

function getMin(size) {
  return [numberToString(0, size), null];
}

function generate(ident, size, min, max) {
  var minVal, maxVal, prefix = [];
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
  var maxChunks = Math.max(minComponents.length, maxComponents.length) - 1;
  var disambiguator = minComponents[minComponents.length - 1];
  while (idx <= maxChunks) {
    var minNum = stringToNumber(Array.isArray(minComponents[idx]) ? minComponents[idx][0] : getMin(size)[0]);
    var maxNum = stringToNumber(Array.isArray(maxComponents[idx]) ? maxComponents[idx][0] : getMax(size)[0]);

    if (maxNum - minNum >= 2) {
      minVal = minNum + 1;
      maxVal = maxNum - 1;
      break;

    } else {
      var chunkData = [].concat(minComponents[idx]);

      if (minComponents[idx] && // the min chunk exists
          chunkData.length === 1 && // the min chunk does not have a disambiguator
          minComponents[idx][0] === maxComponents[idx][0] && // the min chunk is identical to the max chunk
          (minComponents[idx][1] !== maxComponents[idx][1] || // the disambiguators between the chunks differ
            idx === minComponents.length - 2) && // at the end of the key, forced to add a disambiguator
          !!disambiguator) { // there is a disambiguator attached
        chunkData.push(disambiguator);
      }
      prefix.push(chunkData);
      idx++;
    }
  }

  var numericValue = minVal + Math.floor(Math.random() * (maxVal - minVal));
  var randomKey = numberToString(numericValue, size);
  return [prefix.map(function (chunk) {
    return chunk.join(IDENT_DELIMITER);
  }).concat(randomKey).join(CHUNK_DELIMITER), ident];
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
