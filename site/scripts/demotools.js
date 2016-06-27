'use strict';

let _ = require('lodash');
let animate = require('./animationHelpers');

function whichTransitionEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

function evaluate(board) {
    console.log('evaluating');
    let transitionEvent = whichTransitionEvent();
    // gather one element for each animation
    let matches;
    let orbCounts;
    let matchData;
    let orbs = _.cloneDeep(board.orbs);
    // gather the rest of the necessary information
    matches = _.cloneDeep(board.matches);
    let matchEl = document.getElementById(`main ${matches[0][0][0]} ${matches[0][0][1]}`);
    let allMatchCoords = _.flattenDepth(matches, 1);
    let unaffectedEl = false;
    let unMatchedAbove;
    _.each(allMatchCoords, coord => {
        let orbAbove = [coord[0] - 1, coord[1]];
        // check if the orb above will be dropped down with activate gravity
        if (orbAbove[0] >= 0 && !_.includes(allMatchCoords, orbAbove)) {
            unaffectedEl = document.getElementById(`main ${orbAbove[0]} ${orbAbove[1]}`);
            return false
        }
    })
    orbCounts = getOrbCounts(matches);
    let atticEl = document.getElementsByClassName(`attic ${Object.keys(orbCounts)[0]}`)[0];

    // first, erase the matches
    animate.eraseMatches(matches);
    // update the score (and evaluate the js board!)
    let matchDatas = board.evaluate();
    _.each(matchDatas, matchData => {
        animate.updateScore(matchData);
    });
    // after the match has been erased, call the activate gravity animation
    // TO BE INVESTIGATED: For some reason, the opacity change in eraseMatches is not causing
    // a transition in CSS and therefore the event listener isn't work. Hence the setTimeout
    setTimeout(function() {
        animate.activateGravity(orbs);
    });
    // after gravity has been activated, call the release attic animation
    unaffectedEl && unaffectedEl.addEventListener(transitionEvent, function() {
        animate.releaseAttic(orbCounts);
    });
    // after the attic has been released, update the js board and repopulate
    atticEl.addEventListener(transitionEvent, function() {
        board.resetAttic();
        animate.repopulate(board.orbs, board.atticOrbs);
        if (board.hasMatch()) {
            evaluate(board);
        }
    });
}

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
        // after the swap is done, evaluate the board
        let swapEl = document.getElementById(`main ${swapOrbs[0][0]} ${swapOrbs[0][1]}`);
        swapEl.addEventListener(whichTransitionEvent(), function() {
            animate.repopulate(board.orbs, board.atticOrbs);
            evaluate(board);
        });
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

