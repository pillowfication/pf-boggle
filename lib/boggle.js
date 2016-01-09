'use strict';

var sowpods = require('pf-sowpods');
var dice = require('./dice');

var points = {
  //    0  1  2  3  4  5  6  7  8+
  '4': [0, 0, 0, 1, 1, 2, 3, 5, 11],
  '5': [0, 0, 0, 0, 1, 2, 3, 5, 11],
  '6': [0, 0, 0, 0, 1, 2, 3, 5, 11]
};

module.exports = {
  generate: function(size, d) {
    size = size || 4;
    d = (d || dice[size]).slice();
    var board = [], i = d.length, j, l = size*size, temp;
    // Shuffle dice
    while (--i) {
      j = (i+1)*Math.random()|0;
      temp = d[i];
      d[i] = d[j];
      d[j] = temp;
    }
    // Roll dice
    for (i = 0; i < l; ++i)
      board.push(d[i][6*Math.random()|0]);
    return board;
  },

  solve: function(board, dict) {
    var size = Math.sqrt(board.length);
    var trie = sowpods.trie, i, l;
    if (dict) {
      // Create a trie out of dictionary
      trie = {};
      var j, t, n, w, k;
      for (i = 0, l = dict.length; i < l; ++i) {
        for (t = trie, j = 0, w = dict[i], k = w.length; j < k; ++j)
          t = t[n = w[j]] || (t[n] = {});
        t._ = true;
      }
    }

    function check(index, trie, input, seq) {
      var nodes = board[index];
      // Avoid retracing
      if (seq.indexOf(index) !== -1)
        return [];
      // Crawl the trie
      for (var i = 0, l = nodes.length; i < l; ++i)
        if (!(trie = trie[nodes[i]]))
          return [];
      // Check if valid word
      input += nodes;
      seq = seq.slice();
      seq.push(index);
      var result = trie._ ? [{word: input, sequence: seq}] : [];
      // Recursively recheck neighbors
      var up = index/size|0,   down = up !== size-1,
          left = index%size, right = left !== size-1;
      if (up && left)
        result = result.concat(check(index-size-1, trie, input, seq));
      if (up)
        result = result.concat(check(index-size,   trie, input, seq));
      if (up && right)
        result = result.concat(check(index-size+1, trie, input, seq));
      if (left)
        result = result.concat(check(index-1,      trie, input, seq));
      if (right)
        result = result.concat(check(index+1,      trie, input, seq));
      if (down && left)
        result = result.concat(check(index+size-1, trie, input, seq));
      if (down)
        result = result.concat(check(index+size,   trie, input, seq));
      if (down && right)
        result = result.concat(check(index+size+1, trie, input, seq));
      return result;
    }

    var result = [];
    for (i = 0, l = board.length; i < l; ++i)
      result = result.concat(check(i, trie, '', []));
    return result;
  },

  points: function(word, size) {
    if (size === 6 && word.length >= 9)
      return word.length*2;
    var p = points[size || 4];
    return p[word.length >= p.length ? p.length-1 : word.length];
  }
};
