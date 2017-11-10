const diceSets = require('./dice-sets')

function shuffle (array) {
  array = array.slice()
  for (let counter = array.length; counter > 0;) {
    const index = Math.random() * counter | 0
    --counter
    const temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }
  return array
}

module.exports = function generate (size = 4, dice = diceSets[size]) {
  size *= size
  dice = shuffle(dice)
  const board = []

  for (let index = 0; index < size; ++index) {
    const die = dice[index]
    board[index] = die[Math.random() * die.length | 0]
  }

  return board
}
