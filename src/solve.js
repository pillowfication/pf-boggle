const _ = require('lodash');
const sowpods = require('pf-sowpods/src/sowpods');
const EOW = sowpods.trieEOW;

const getTrie = _.memoize((dictionary) => {
  const trie = {};
  for (const word of dictionary)
    _.set(trie, (word.toUpperCase() + EOW).split(''), true);
  return trie;
});

module.exports = function solve(board, dict) {
  const size = Math.sqrt(board.length);
  const trie = dict ? getTrie(dict) : sowpods.trie;
  const results = [];

  function check(index, trieNode, path, sequence) {
    // Avoid retracing
    if (sequence.indexOf(index) !== -1)
      return;

    const nodes = board[index]; // Note: A square on the board may represent
                                //       multiple characters
    // Crawl the trie
    for (const node of nodes)
      if (!(trieNode = trieNode[node]))
        return;

    // Update variables
    path += nodes;
    sequence = _.concat(sequence, index);

    // Check if valid word
    if (trieNode[EOW])
      results.push({word: path, sequence: sequence});

    // Recurse on neighboring cells
    const up   = index/size|0, down  = up !== size-1,
          left = index%size,   right = left !== size-1;

    up && left &&    check(index-size-1, trieNode, path, sequence);
    up &&            check(index-size,   trieNode, path, sequence);
    up && right &&   check(index-size+1, trieNode, path, sequence);
    left &&          check(index-1,      trieNode, path, sequence);
    right &&         check(index+1,      trieNode, path, sequence);
    down && left &&  check(index+size-1, trieNode, path, sequence);
    down &&          check(index+size,   trieNode, path, sequence);
    down && right && check(index+size+1, trieNode, path, sequence);
  }

  for (let i = 0, l = board.length; i < l; ++i)
    check(i, trie, '', []);

  return results;
};
