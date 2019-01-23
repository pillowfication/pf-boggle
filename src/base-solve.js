const trieCache = new Map()

function getTrie (dictionary) {
  let trie = trieCache.get(dictionary)
  if (trie) {
    return trie
  }
  trie = {}

  for (const word of dictionary) {
    let node = trie
    for (const letter of word.toUpperCase()) {
      let nextNode = node[letter]
      if (!nextNode) {
        nextNode = node[letter] = {}
      }
      node = nextNode
    }
    node._ = true
  }

  trieCache.set(dictionary, trie)
  return trie
}

module.exports = function baseSolve (board, dictionary) {
  const size = Math.sqrt(board.length)
  const trie = getTrie(dictionary)
  const results = []

  function _solve (index, trieNode, path, sequence) {
    // Avoid retracing
    if (sequence.indexOf(index) !== -1) {
      return
    }

    // Note: A square on the board may represent multiple characters
    const nodes = board[index].toUpperCase()
    // Crawl the trie
    for (const node of nodes) {
      if (!(trieNode = trieNode[node])) {
        return
      }
    }

    // Update variables
    path += nodes
    sequence = sequence.concat([ index ])

    // Check if valid word
    if (trieNode._) {
      results.push({ word: path, sequence: sequence })
    }

    // Recurse on neighboring cells
    const up = index / size | 0
    const down = up !== size - 1
    const left = index % size
    const right = left !== size - 1

    up && left && _solve(index - size - 1, trieNode, path, sequence)
    up && _solve(index - size, trieNode, path, sequence)
    up && right && _solve(index - size + 1, trieNode, path, sequence)
    left && _solve(index - 1, trieNode, path, sequence)
    right && _solve(index + 1, trieNode, path, sequence)
    down && left && _solve(index + size - 1, trieNode, path, sequence)
    down && _solve(index + size, trieNode, path, sequence)
    down && right && _solve(index + size + 1, trieNode, path, sequence)
  }

  for (let i = 0, l = board.length; i < l; ++i) {
    _solve(i, trie, '', [])
  }
  return results
}

module.exports.initialize = function initialize (dictionary) {
  getTrie(dictionary)
}
