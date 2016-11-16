const pointSets = {
  //    0  1  2  3  4  5  6  7  8+
  '4': [0, 0, 0, 1, 1, 2, 3, 5, 11],
  '5': [0, 0, 0, 0, 1, 2, 3, 5, 11],
  '6': [0, 0, 0, 0, 1, 2, 3, 5, 11]
};

module.exports = function points(word, size = 4) {
  const length = word.length || word;

  if (size === 6 && length >= 9)
    return length * 2;

  const points = pointSets[size];
  return length < points.length ? points[length] : points[points.length-1];
};
