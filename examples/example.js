'use strict';

var $ = require('jquery');
var boggle = require('..');

$(function() {
  var board, solution, size, time, timer, words, points;

  // Format time
  function getTime(n) {
    return (n/60|0)+':'+('00'+n%60).slice(-2);
  }

  // Lowercase string
  function stringy(str) {
    return str.charAt(0) + str.slice(1).toLowerCase();
  }

  // Validate word is on board and not already used
  function verify(word) {
    var min = 0, max = solution.length-1, mid;
    while (min <= max) {
      mid = min + max >> 1;
      switch (word.localeCompare(solution[mid].word)) {
        case -1: max = mid - 1; break;
        case  1: min = mid + 1; break;
        case  0: return words.indexOf(word) === -1;
      }
    }
    return false;
  }

  $('#start').click(function() {
    // Get form values
    size = +$('input[name=size]:checked').val();
    time = +$('input[name=time]').val();
    board = boggle.generate(size);
    solution = boggle.solve(board).sort(function(a, b) {
      return a.word.localeCompare(b.word);
    });
    words = [];
    points = 0;

    // Setup board
    $('#board')[0].className = 'size-'+size;
    $('#squares').html(board.reduce(function(prev, curr) {
      return prev + '<div>'+stringy(curr)+'</div>';
    }, ''));

    // Reset stats
    $('#words').html('');
    $('#total').html('Total: 0 words, 0 points');

    // Reset solution
    $('#squares').removeClass('show');
    $('#solution').removeClass('show').html(solution.slice().sort(function(a, b) {
      return boggle.points(b.word, size)-boggle.points(a.word, size) || a.word.localeCompare(b.word);
    }).reduce(function(prev, curr) {
      return boggle.points(curr.word, size) ?
        prev + '<div>('+boggle.points(curr.word, size)+') '+curr.word+' - ['+curr.sequence.join(', ')+']</div>' :
        prev;
    }, ''));

    // Start timer
    $('#timer')[0].className = time <= 0 ? 'warn' : '';
    $('#timer').html(getTime(time));
    clearInterval(timer);
    timer = setInterval(function() {
      if (--time <= 0) {
        $('#timer').addClass('warn');
        clearInterval(timer);
      }
      $('#timer').html(getTime(time));
    }, 1000);
  });

  // Toggle solution visibility
  $('#show').click(function() {
    $('#squares, #solution').toggleClass('show');
  });

  // Handle game input
  $('input[name=input]').keydown(function(event) {
    var $this = $(this), word = $this.val().toUpperCase(), point = boggle.points(word, size);
    if (event.keyCode === 13) {
      if (verify(word)) {
        // Update score
        words.push(word);
        points += point;
        $('#words').append('<div>('+point+') '+word+'</div>');
        $('#total').html('Total: '+words.length+' words, '+points+' points');
      }
      $this.val('');
    }
  });
});
