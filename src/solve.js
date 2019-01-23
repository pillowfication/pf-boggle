const baseSolve = require('./base-solve')
const sowpods = require('pf-sowpods/src/dictionary')

baseSolve.initialize(sowpods)

module.exports = function solve (board, dictionary = sowpods) {
  return baseSolve(board, dictionary)
}
