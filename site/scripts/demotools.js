'use strict';

let _ = require('lodash');

exports.makeMove = function(board, swapOrbs) {
    let [[r1, c1], [r2, c2]] = swapOrbs;
    let first = document.getElementById(r1 + ' ' + c1);
    let second = document.getElementById(r2 + ' ' + c2);

    // remove the white borders
    first.style.border = 'none';
    second.style.border = 'none';
    
    // make the swap
    board.swap(swapOrbs);
    if (!board.hasMatch()) {
        // unswaps in the board instance and leave the html unchanged
        board.swap(swapOrbs)
        alert('That\'s not a valid move, you fool!');
    } else {
        // make the swap in the html
        first.style.backgroundColor = board.orbs[r1][c1];
        second.style.backgroundColor = board.orbs[r2][c2];
        
        // evaluate the board
        // save data for matches to be implemented soon
        // catch for matches after the evaluation drops new orbs down
        let matches = [];
        while (board.hasMatch()) {
            let matchData = board.evaluate();
            matches.push(matchData);
        }
        
        // catch if there are no possible matches left
        if (board.needsShuffle()) { board.shuffle() };
        
         
        // repopulate the board in html
        _.each(_.range(board.orbs.length), row => {
            _.each(_.range(board.orbs[row].length), col => {
                let td = document.getElementById(row + ' ' + col);
                td.style.backgroundColor = board.orbs[row][col];
            })
        })
    }
};

let repopulate = function(board) {
    console.log('repopulating');
    _.each(_.range(board.orbs.length), row => {
        _.each(_.range(board.orbs[row].length), col => {
            let td = document.getElementById(row + ' ' + col);
            td.style.backgroundColor = board.orbs[row][col];
        })
    })
}

exports.repopulate = repopulate;
    
exports.areNeighbors = function(orbs) {
    let [[r1, c1], [r2, c2]] = orbs;
    return (r1 == r2 && Math.abs(c1 - c2) == 1) || (c1 == c2 && Math.abs(r1 - r2) == 1)
};
