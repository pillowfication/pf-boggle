const _ = require('lodash');
const diceSets = require('./diceSets');

module.exports = function generate(size = 4, dice = diceSets[size]) {
  const board = [];

  for (const die of _.shuffle(dice))
    board.push(die[_.random(0, 5)]);

  return board;
};
