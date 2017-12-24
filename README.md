# pf-boggle

**Boggle generator and solver** - A Boggle utility for 4x4, 5x5, and 6x6 boards that can be extended to NxN.

http://pf-n.co/github/pf-boggle

## Examples

```javascript
// Require the module to use it
const boggle = require('pf-boggle')

// Create a 5x5 board
const board = boggle.generate(5)
// [ 'E', 'O', 'T', 'I', 'I',
//   'T', 'H', 'I', 'C', 'I',
//   'C', 'N', 'N', 'G', 'F',
//   'O', 'T', 'W', 'D', 'E',
//   'S', 'D', 'E', 'X', 'T' ]

// Solve the above board
const solution = boggle.solve(board)
// [ { word: 'ET', sequence: [ 0, 5 ] },
//   { word: 'ETH', sequence: [ 0, 5, 6 ] },
//   { word: 'ETHIC', sequence: [ 0, 5, 6, 7, 8 ] },
//   ...
//   { word: 'TEF', sequence: [ 24, 19, 14 ] },
//   { word: 'TED', sequence: [ 24, 19, 18 ] },
//   { word: 'TEX', sequence: [ 24, 19, 23 ] } ]

// Find maximum score
const _ = require('lodash')
_.chain(solution)
  .map('word')
  .uniq()
  .reduce((total, word) => total + boggle.points(word, 5), 0)
  .value()
// 226
```

## API

### `boggle.generate([size = 4], [dice = boggle.diceSets[size]])`

**Arguments**
 1. `[size = 4]` *(Number)*: The size (number of rows/columns) of the board.
 2. `[dice = boggle.diceSets[size]]` *(Array)*: An array of dice to use.

**Returns**
 * *(Array)*: An array of strings, each string representing a spot on the board. (Note: this is not a 2D array).

`dice` can be an array of dice (each die being an array of strings). See `boggle.diceSets` for the included lists of dice. This module includes default dice sets for `size` equal to `4`, `5`, `6`. For other sizes, `dice` is required. The length of `dice` should be greater than or equal to `size * size`.

```javascript
// Create a 4x4 board using the Classic Boggle dice
boggle.generate(4, boggle.diceSets['classic4'])

// Create a 7x7 board using two sets of the 6x6 dice
// Every die has an equal chance of being used in the board
boggle.generate(7, [ ...boggle.diceSets[6], ...boggle.diceSets[6] ])
```

Since the `return` value is a flat array, it should be interpreted in row-major (or column-major) order to get the 2D board. If you want a 2D array, chunk the values (but `boggle.solve()` only works on the flat array).

```javascript
const _ = require('lodash')
const board = _.chunk(boggle.generate(5), 5)
// [ [ 'E', 'O', 'T', 'I', 'I' ],
//   [ 'T', 'H', 'I', 'C', 'I' ],
//   [ 'C', 'N', 'N', 'G', 'F' ],
//   [ 'O', 'T', 'W', 'D', 'E' ],
//   [ 'S', 'D', 'E', 'X', 'T' ] ]

const solution = boggle.solve(_.flatten(board))
```

### `boggle.solve(board, [dict = SOWPODS])`

**Arguments**
 1. `board` *(Array)*: The board to solve.
 2. `[dict = SOWPODS]` *(Array)*: A list of words to consider.

**Returns**
 * *(Array)*: All possible words with their sequences on the board.

`dict` is an array of strings (case insensitive). The default dictionary used is Scrabble's SOWPODS dictionary (see [pf-sowpods](https://www.npmjs.com/package/pf-sowpods)).

```javascript
boggle.solve([ 'E', 'O', 'T', 'I', 'I',
               'T', 'H', 'I', 'C', 'I',
               'C', 'N', 'N', 'G', 'F',
               'O', 'T', 'W', 'D', 'E',
               'S', 'D', 'E', 'X', 'T' ])
// [ { word: 'ET', sequence: [ 0, 5 ] },
//   { word: 'ETH', sequence: [ 0, 5, 6 ] },
//   { word: 'ETHIC', sequence: [ 0, 5, 6, 7, 8 ] },
//   ...
//   { word: 'TEF', sequence: [ 24, 19, 14 ] },
//   { word: 'TED', sequence: [ 24, 19, 18 ] },
//   { word: 'TEX', sequence: [ 24, 19, 23 ] } ]
```

Words can appear multiple times in the solution if there are multiple sequences on the board which create the same word. In the above example, `'TINTED'` appears 4 times.

```javascript
{ word: 'TINTED', sequence: [ 2, 7, 11, 16, 22, 18 ] }
{ word: 'TINTED', sequence: [ 2, 7, 11, 16, 22, 21 ] }
{ word: 'TINTED', sequence: [ 2, 7, 12, 16, 22, 18 ] }
{ word: 'TINTED', sequence: [ 2, 7, 12, 16, 22, 21 ] }
```

Before solving occurs, a trie structure is made on dictionary. Since this operation is memoized, be careful when modifying your dictionary.

```javascript
const _ = require('lodash')
const board = boggle.generate()

const dictionary = require('pf-sowpods')
const solution1 = boggle.solve(board, dictionary)
_.find(solution1, sol => sol.word.length === 2)
// { word: 'ES', sequence: [ 2, 5 ] }

// Remove all 2-letter words from the dictionary since they award no points
_.remove(dictionary, word => word.length === 2)

// Resolve the board with the "new" dictionary
const solution2 = boggle.solve(board, dictionary)
_.find(solution2, sol => sol.word.length === 2)
// { word: 'ES', sequence: [ 2, 5 ] }

// Actually use the new dictionary
const filteredDictionary = dictionary.slice()
const solution3 = boggle.solve(board, filteredDictionary)
_.find(solution3, sol => sol.word.length === 2)
// undefined
```

### `boggle.points(word, [size = 4])`

**Arguments**
 1. `word` *(String|Number)*: The word to score.
 2. `[size = 4]` *(Number)*: The size of board scoring takes place on.

**Returns**
 * *(Number)*: Number of points awarded for the word.

Since only the length of the word (and the size of the board) matters when scoring a word, `word` can also be passed as a number representing the length of a word.

```javascript
boggle.points('abcdef') === boggle.points(6) // true
```

Scoring is determined by the following table

|  Word Length:  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8  |         9+          |
|:--------------:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:--:|:-------------------:|
| Board Size = 4 | 0 | 0 | 1 | 1 | 2 | 3 | 5 | 11 |         11          |
| Board Size = 5 | 0 | 0 | 0 | 1 | 2 | 3 | 5 | 11 |         11          |
| Board Size = 6 | 0 | 0 | 0 | 1 | 2 | 3 | 5 | 11 | 2 points per letter |

(See [Boggle 4x4](http://www.hasbro.com/common/instruct/boggle.pdf), [Boggle 5x5](http://www.hasbro.com/common/instruct/BigBoggle.PDF), [Boggle 6x6](https://winning-moves.com/images/SuperBigBoggleRules.pdf) instruction manuals)

### `boggle.diceSets`

*({Object})*: Included dice sets for use with `boggle.generate()`.

 * `boggle.diceSets['4']` - The new 4x4 Boggle dice set
 * `boggle.diceSets['classic4']` - The classic 4x4 Boggle dice set
 * `boggle.diceSets['czech4']` - The 4x4 Boggle dice set for Czech
 * `boggle.diceSets['french4']` - The 4x4 Boggle dice set for French
 * `boggle.diceSets['5']` - The 5x5 Boggle dice set
 * `boggle.diceSets['italian5']` - The 5x5 Boggle dice set for Italian
 * `boggle.diceSets['spanish5']` - The 5x5 Boggle dice set for Spanish
 * `boggle.diceSets['6']` - The 6x6 Boggle dice set

In `boggle.diceSets['6']`, a `█` represents the "blank" or "blue-square" face.

See the following for references:
 - https://boardgames.stackexchange.com/questions/29264/boggle-what-is-the-dice-configuration-for-boggle-in-various-languages
 - https://boardgamegeek.com/thread/300883/letter-distribution
 - https://boardgamegeek.com/thread/1071406/looking-letter-distribution
