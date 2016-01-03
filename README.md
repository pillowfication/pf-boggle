# pf-boggle

**Boggle generator and solver** - A Boggle utility for 4x4, 5x5, and 6x6 boards that can be extended to NxN. Includes a fully functioning single-player example webpage.

## Examples

```javascript
// Require the module to use it.
var boggle = require('pf-boggle');

// Create a 4x4 board using the Classic Boggle dice
var newBoggle = boggle.generate(4, boggle.dice['classic4']);

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
var solution = solution.sort(function(a, b) {
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

`dice` can be an array of 6-character strings that represent dice. See `boggle.dice` for the included lists of dice. This module includes default dice sets for `size` equal to `4`, `5`, `6`. For other sizes, `dice` is required.`

Returns an Array of strings which are single characters. Note that you may need to use `boggle.charMap()` to determine what string of letters the character represents. The Array can be interpreted as either row-major or column-major order.

### boggle.solve(board, size, dict)

 * **board** (Array, String) - The representation of a board
 * **size** (Number) - The dimensions of the board
 * **dict** (Array) - Default *SOWPODS*. A dictionary to use
 * **returns** (Array) - All possible words with their corresponding sequences

`board` is either an Array or String of characters of length `size * size`.

`dict` is an array of words in all-caps. The default dictionary used is Scrabble's SOWPODS dictionary.

Returns an Array of objects with keys `word` and `sequence`. `word` is a String that is a valid word. `sequence` is an Array of Numbers that corresponds to the indices of `board` used to obtain `word`. This solver works on any sized board, and uses `boggle.charMap` to convert dice faces to words.

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

### boggle.charMap(char)

 * **char** (String) - The character to map
 * **returns** (String) - The character's representation

Every face of a die is represented by a single character, but may be interpreted as multiple characters. For example, `boggle.charMap('Q') === 'QU'`.
