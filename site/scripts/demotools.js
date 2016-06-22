'use strict';

let _ = require('lodash');
let animate = require('./animationHelpers');

exports.makeMove = function(board, swapOrbs) {
    let [[r1, c1], [r2, c2]] = swapOrbs;

    // remove the white borders
    animate.removeBorder(r1, c1);
    animate.removeBorder(r2, c2);
    
    // make the swap
    board.swap(swapOrbs);
    if (!board.hasMatch()) {
        // unswaps in the board instance and leave the html unchanged
        board.swap(swapOrbs);
        alert('That\'s not a valid move, you fool!');
    } else {
        // animate the swap
        animate.swap(board, ...swapOrbs);
        setTimeout(function() { animate.repopulate(board); }, 1000);
        let matches = board.matches;
        let orbCounts = getOrbCounts(matches);
        setTimeout(function() { animate.eraseMatches(matches); }, 2000);
        setTimeout(function() { animate.activateGravity(board); }, 3000);
        setTimeout(function() { animate.releaseAttic(orbCounts); }, 4000);
        /*
        // evaluate the board
        // save data for matches to be implemented soon
        // catch for matches after the evaluation drops new orbs down
        let matchDatas = [];
        while (board.hasMatch()) {
            // remove matches and pull down the orbs from above
            let matches = board.matches;
            let orbCounts = getOrbCounts(matches);
            setTimeout(function() { animate.pullDownOrbs(board, matches, orbCounts) }, 2000);
            
            // update the board instance & send out the matchData
            matchDatas.push(board.evaluate());
        }
        // catch if there are no possible matches left
        if (board.needsShuffle()) { 
            board.shuffle();
            animate.repopulate(board);
        };
        // FYI, the scoreboard will be updated while playing
        // once this return starts happening again
        return matchDatas;
        */
    }
};

let getOrbCounts = function(matches) {
    let orbCounts = {};
    _.each(matches, match => {
        _.each(match, coord => {
            if (orbCounts[coord[1]]) {
                orbCounts[coord[1]] += 1;
            } else {
                orbCounts[coord[1]] = 1;
            };
        });
    });
    return orbCounts;
}
    
exports.areNeighbors = function(orbs) {
    let [[r1, c1], [r2, c2]] = orbs;
    return (r1 == r2 && Math.abs(c1 - c2) == 1) || (c1 == c2 && Math.abs(r1 - r2) == 1)
};

exports.twoSelectedOrbsAreEqual = function(selectedOrbs) {
    let orb1 = selectedOrbs[0];
    let orb2 = selectedOrbs[1];
    return orb1[0] === orb2[0];
};

