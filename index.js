'use strict';

var sowpods = require('pf-sowpods');

var dice = {
  'classic4': ['AACIOT', 'ABILTY', 'ABJMOQ', 'ACDEMP', 'ACELRS', 'ADENVZ', 'AHMORS', 'BFIORX', 'DENOSW', 'DKNOTU',
    'EEFHIY', 'EGINTV', 'EGKLUY', 'EHINPS', 'ELPSTU', 'GILRUW'],
  '4': ['AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS', 'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY', 'DISTTY', 'EEGHNW', 'EEINSU',
    'EHRTVW', 'EIOSST', 'ELRTTY', 'HIMNUQ', 'HLNNRZ'],
  '5': ['AAAFRS', 'AAEEEE', 'AAFIRS', 'ADENNN', 'AEEEEM', 'AEEGMU', 'AEGMNN', 'AFIRSY', 'BJKQXZ', 'CCNSTW', 'CEIILT',
    'CEILPT', 'CEIPST', 'DDLNOR', 'DHHLOR', 'DHHNOT', 'DHLNOR', 'EIIITT', 'EMOTTT', 'ENSSSU', 'FIPRSY', 'GORRVW',
    'HIPRRY', 'NOOTUW', 'OOOTTU'],
  '6': ['AAAFRS', 'AAEEEE', 'AAEEOO', 'AAFIRS', 'ABDEIO', 'ADENNN', 'AEEEEM', 'AEEGMU', 'AEGMNN', 'AEILMN', 'AEINOU',
    'AFIRSY', '0123Q4', 'BBJKXZ', 'CCENST', 'CDDLNN', 'CEIITT', 'CEIPST', 'CFGNUY', 'DDHNOT', 'DHHLOR', 'DHHNOW',
    'DHLNOR', 'EHILRS', 'EIILST', 'EILPST', 'EIO###', 'EMTTTO', 'ENSSSU', 'GORRVW', 'HIRSTV', 'HOPRST', 'IPRSYY',
    'JKQWXZ', 'NOOTUW', 'OOOTTU']
};
var points = {
  //    0  1  2  3  4  5  6  7  8+
  '4': [0, 0, 0, 1, 1, 2, 3, 5, 11],
  '5': [0, 0, 0, 0, 1, 2, 3, 5, 11],
  '6': [0, 0, 0, 0, 1, 2, 3, 5, 11]
};
var chars = {
  'Q': 'QU',
  '0': 'AN',
  '1': 'ER',
  '2': 'HE',
  '3': 'IN',
  '4': 'TH'
};
function charMap(char) {
  return chars[char] || char;
}

module.exports = {
  generate: function(size, d) {
    size = size || 4;
    d = d || dice[size];
    var board = [], i, j, len = size*size, temp;
    // Roll dice
    for (i = 0; i < len; ++i)
      board.push(d[i].charAt(6*Math.random()|0));
    // Shuffle board
    while (--i) {
      j = (i+1)*Math.random()|0;
      temp = board[i];
      board[i] = board[j];
      board[j] = temp;
    }
    return board;
  },

  solve: function(board, size, dict) {
    dict = dict || sowpods;

    function check(index, dict, input, seq) {
      input += charMap(board[index]);
      // Avoid retracing
      if (seq.indexOf(index) !== -1)
        return [];
      // Find first occurence of input
      var len = dict.length, start = -1, max = len, mid;
      while (max > start+1) {
        mid = max+start+1 >> 1;
        if (dict[mid] <= input)
          start = mid;
        else
          max = mid;
      }
      start = start !== -1 && dict[start] === input ? start : start+1;
      if (start === len || dict[start].indexOf(input))
        return [];
      // Find last occurence of input
      var end;
      for (end = start+1; end < len; ++end)
        if (dict[end].indexOf(input))
          break;
      dict = dict.slice(start, end);
      // Check if valid word
      seq = seq.slice();
      seq.push(index);
      var result = dict[0] === input ? [{word: input, sequence: seq}] : [];
      // Recursively recheck neighbors
      var up = index/size|0, down = up !== size-1,
          left = index % size, right = left !== size-1;
      if (up && left)
        result = result.concat(check(index-size-1, dict, input, seq));
      if (up)
        result = result.concat(check(index-size,   dict, input, seq));
      if (up && right)
        result = result.concat(check(index-size+1, dict, input, seq));
      if (left)
        result = result.concat(check(index-1,      dict, input, seq));
      if (right)
        result = result.concat(check(index+1,      dict, input, seq));
      if (down && left)
        result = result.concat(check(index+size-1, dict, input, seq));
      if (down)
        result = result.concat(check(index+size,   dict, input, seq));
      if (down && right)
        result = result.concat(check(index+size+1, dict, input, seq));
      return result;
    }

    var result = [];
    for (var i = 0, l = size*size; i < l; ++i)
      result = result.concat(check(i, dict, '', []));
    return result;
  },

  points: function(word, size) {
    if (size === 6 && word.length >= 9)
      return word.length*2;
    var p = points[size || 4];
    return p[word.length >= p.length ? p.length-1 : word.length];
  },

  dice: dice,

  charMap: charMap
};
