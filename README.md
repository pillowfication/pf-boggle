# pf-boggle

**Boggle generator and solver** - A Boggle utility for 4x4, 5x5, and 6x6 boards that can be extended to NxN. Includes a fully functioning single-player example webpage.

## Examples

```javascript
// Require the module to use it.
var boggle = require('pf-boggle');

// Create a 5x5 board
var board = boggle.generate(5);
// [ 'E', 'O', 'T', 'I', 'I',
//   'T', 'H', 'I', 'C', 'I',
//   'C', 'N', 'N', 'G', 'F',
//   'O', 'T', 'W', 'D', 'E',
//   'S', 'D', 'E', 'X', 'T' ]

// Solve the above board
var solution = boggle.solve(board, 5);
// [ { word: 'ET', sequence: [ 0, 5 ] },
//   { word: 'ETH', sequence: [ 0, 5, 6 ] },
//   { word: 'ETHIC', sequence: [ 0, 5, 6, 7, 8 ] },
//   ...
//   { word: 'TEF', sequence: [ 24, 19, 14 ] },
//   { word: 'TED', sequence: [ 24, 19, 18 ] },
//   { word: 'TEX', sequence: [ 24, 19, 23 ] } ]

// Find maximum score
// Sort solutions
solution = solution.sort(function(a, b) {
  return a.word.localeCompare(b.word);
});
// Remove duplicates
for (var i = solution.length-1, prev = ''; i >= 0; --i)
  if (solution[i].word === prev)
    solution.splice(i, 1);
  else
    prev = solution[i].word;
// Add scores
var maximum = solution.reduce(function(prev, curr) {
  return prev + boggle.points(curr.word, 5);
}, 0);
// maximum == 226
```

See `examples/index.html` for the Boggle game. To build it, run
```
npm install browserify -g
npm run build
```

## API

### boggle.generate(size, dice)

 * **size** (Number) - Default `4`. Size of the board
 * **dice** (Array) - *Optional*. An array of dice to use
 * **returns** (Array) - The board

`dice` can be an Array of Arrays that represent dice. See `boggle.dice` for the included lists of dice. This module includes default dice sets for `size` equal to `4`, `5`, `6`. For other sizes, `dice` is required.

```javascript
// Create a 4x4 board using the Classic Boggle dice
var classic = boggle.generate(4, boggle.dice['classic4']);

// Create a 7x7 board using two sets of the 6x6 dice
// Every die has an equal chance of being used in the board
var dice = boggle.dice[6].concat(boggle.dice[6]);
var board = boggle.generate(7, dice);
```

Returns an Array of Strings that represent dice faces. The Array can be interpreted as either row-major or column-major order.

### boggle.solve(board, dict)

 * **board** (Array) - The board to solve
 * **dict** (Array) - Default *SOWPODS*. A dictionary to use
 * **returns** (Array) - All possible words with their corresponding sequences

`board` is an Array of Strings whose size is assumed to be `Math.sqrt(board.length)`.

`dict` is an Array of Strings in all-caps already sorted in alphabetical order. The default dictionary used is Scrabble's SOWPODS dictionary.

Returns an Array of Objects with keys `word` and `sequence`. `word` is a String that exists in `dict`. `sequence` is an Array of Numbers that corresponds to the indices of `board` used to obtain `word`.

This solver works by recursively walking around the board, keeping track of the sequence and input string of the path, as well as the sub-array of `dict` that begins with the input string. If the string is a full word in `dict`, add the string and sequence to the results, and continue walking. If the string matches no words in `dict`, stop walking.

### boggle.points(word, size)

 * **word** (String) - The word to score
 * **size** (Number) - Default `4`. Size of the board
 * **returns** (Number) - Score of the word

`size` must be one of `4`, `5`, `6`.

### boggle.dice (Array)

 * `boggle.dice['classic4']` - The classic 4x4 Boggle dice set
 * `boggle.dice['4']` - The new 4x4 Boggle dice set
 * `boggle.dice['5']` - The 5x5 Boggle dice set
 * `boggle.dice['6']` - The 6x6 Boggle dice set
